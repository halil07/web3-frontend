import erc20Abi from 'config/abi/erc20.json';
import { getWeb3NoAccount } from 'utils/web3';
import multicall from './multicall';
import web3Helper from 'helpers/web3_helper';
import serverWalletHelper from 'helpers/server_wallet_helper';

import Network from 'config/constants/network';

export const setupNetwork = async (
  _provider,
  { chainId = undefined, shortName = undefined } = {}
) => {
  const network = Network.get({ chainId: chainId, shortName: shortName });

  // @ts-ignore
  const provider = _provider ?? window.ethereum;
  if (!provider) {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );

    return false;
  }

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: `0x${network.networkId.toString(16)}`,
        },
      ],
    });

    return true;
  } catch (switchError:any) {
    // BEGIN SWITCH ERROR CATCH
    console.error(switchError);

    // This error code indicates that the chain has not been added to MetaMask. | 4902
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${network.networkId.toString(16)}`,
              chainName: `${network.displayName} ${Network.networkType}`,
              nativeCurrency: network.platformToken,
              rpcUrls: network.rpcUrls,
              blockExplorerUrls: [network.blockExplorerURL],
            },
          ],
        });

        return true;
      } catch (addError) {
        console.error(addError);
        return false;
      }
    }

    // END SWITCH ERROR CATCH
  }

  return false;
};

export const registerToken = async (
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage
) => {
  // @ts-ignore
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  });

  return tokenAdded;
};

export const getWalletBalances = async () => {
  const web3 = getWeb3NoAccount();

  const { currencyList } = web3Helper.getTokens();
  const tokens = currencyList;
  const calls:any = [];

  var ethBalance = await web3.eth.getBalance(serverWalletHelper.address);

  tokens.forEach((token:any) => {
    if (token.address)
      calls.push({
        address: token.address,
        name: 'balanceOf',
        params: [serverWalletHelper.address],
      });
  });

  var r = await multicall(erc20Abi, calls);

  var balances:any = [];

  balances['BNB'] = web3.utils.fromWei(ethBalance.toString());
  var index = 0;
  tokens.forEach((token) => {
    if (token.address) {
      if (token.decimals == 6) {
        balances[token.symbol] = web3.utils.fromWei(
          r[index].toString(),
          'lovelace'
        );
      } else {
        balances[token.symbol] = web3.utils.fromWei(r[index].toString());
      }
      index++;
    }
  });

  return balances;
};
