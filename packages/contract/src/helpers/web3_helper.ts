// @ts-ignore
import Web3 from 'web3';
import IBEP20 from '../contracts/IBEP20.json';

import config from '../data/config.json';
import {apiHelper} from "@fanz-project/services"

//import {Client} from '@bandprotocol/bandchain.js'
import { getPancakePairContract } from 'utils/contractHelpers';
// import moralisHelper from './moralis_helper';
import { getWalletBalances } from 'utils/wallet';

//import { getFanzAddress } from "utils/addressHelpers";
//const bandEndpoint = 'https://laozi1.bandchain.org/grpc-web'

const chainLinkAggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'description',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint80', name: '_roundId', type: 'uint80' }],
    name: 'getRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];
const chainLinkBSCUSDAddress = '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE';

//const bandchain = new Client(bandEndpoint);

//const price = await bandchain.getReferenceData(['BAND/USD', 'BTC/ETH', 'EUR/USD', 'EUR/BTC']);

//const fanzUsdPrice = 0.01

class Web3Helper {
  private _selectedNetworkName: any;
  // @ts-ignore
  private _pancakPairContract: any;
  private _web3MainNet: any;
  private _chainLinkBNBUSDContract: any;
  private _networkWeb3Provider: any[];
  private currencyIndex: any[];
  private currencyList: any[];
  private fanzBnbPrice: any;
  private bnbUsdPrice: any;
  private usdtTrybPrice: any;
  private lastFanzUsdUpdateDate: any;
  private lastFanzBnbUpdateDate: any;
  private lastUsdtTrybUpdateDate: any;
  private lastBNBUsdUpdateDate: any;
  private lastCurrenctRateUpdateDate: any;
  // @ts-ignore
  private updateCurrencyRatesTimer: any;
  private fanzUsdPrice: any;
  constructor() {
    this._selectedNetworkName = process.env.REACT_APP_SELECTED_NETWORK_NAME; //"bscTestnet"

    // @ts-ignore
    this._pancakPairContract = getPancakePairContract(new Web3(process.env.REACT_APP_MAINNET_NODE));
    // @ts-ignore
    this._web3MainNet = new Web3(process.env.REACT_APP_MAINNET_NODE);
    this._chainLinkBNBUSDContract = new this._web3MainNet.eth.Contract(
      chainLinkAggregatorV3InterfaceABI,
      chainLinkBSCUSDAddress
    );

    this._networkWeb3Provider = [];
    this.currencyIndex = [];
    this.currencyList = [];

    // @ts-ignore
    this.fanzUsdPrice = 0.01;
    this.fanzBnbPrice = 0.00003;
    this.bnbUsdPrice = 0;
    this.usdtTrybPrice = 0;

    this.lastFanzUsdUpdateDate = null;
    this.lastFanzBnbUpdateDate = null;
    this.lastBNBUsdUpdateDate = null;
    this.lastUsdtTrybUpdateDate = null;

    this.lastCurrenctRateUpdateDate = null;
    this.updateCurrencyRatesTimer = 0;
  }

  getUnit(decimals) {
    if (decimals == 6) {
      return 'lovelace';
    }

    return 'ether';
  }

  async getTokenUsdPrice(token) {
    if (token == 'BNB') {
      if (this.lastBNBUsdUpdateDate !== null) {
        if (
          (new Date().getTime() - this.lastBNBUsdUpdateDate.getTime()) / 1000 <
          120
        ) {
          return this.bnbUsdPrice;
        }
      }
      this.lastBNBUsdUpdateDate = new Date();

      const priceData = await this._chainLinkBNBUSDContract.methods
        .latestRoundData()
        .call();
      this.bnbUsdPrice = priceData.answer / 100000000;
      return this.bnbUsdPrice;
    } else if (token == 'FANZ') {
      //return await moralisHelper.getTokenUsdPrice("0xaC6148f83400803eA7D82B9D7dA2820Ea2063296")
      await this.getFanzUsdPrice();
      return this.fanzUsdPrice;
    } else if (token == 'TRYB') {
      if (this.lastUsdtTrybUpdateDate !== null) {
        if (
          (new Date().getTime() - this.lastUsdtTrybUpdateDate.getTime()) /
            1000 <
          120
        ) {
          return this.usdtTrybPrice;
        }
      }
      this.lastUsdtTrybUpdateDate = new Date();
      this.usdtTrybPrice = await apiHelper.getUsdtTrybPrice();
      return this.usdtTrybPrice;
    } else {
      return 1;
    }
    /*
        const priceData = await bandchain.getReferenceData([token + '/USD']);

        return (priceData[0].rate).toFixed(2)
        */
  }

  async getFanzUsdPrice() {
    if (this.lastFanzUsdUpdateDate !== null) {
      if (
        (new Date().getTime() - this.lastFanzUsdUpdateDate.getTime()) / 1000 <
        120
      ) {
        return this.fanzUsdPrice;
      }
    }
    this.lastFanzUsdUpdateDate = new Date();

    // @ts-ignore
    const response = await apiHelper.getConversionRate('fanz', 'usd');

    this.fanzUsdPrice = parseFloat(response.data.price);

    return this.fanzUsdPrice;
  }

  async getFanzBnbPrice() {
    if (this.lastFanzBnbUpdateDate !== null) {
      if (
        (new Date().getTime() - this.lastFanzBnbUpdateDate.getTime()) / 1000 <
        120
      ) {
        return this.fanzBnbPrice;
      }
    }
    this.lastFanzBnbUpdateDate = new Date();

    // @ts-ignore
    const response = await apiHelper.getConversionRate('fanz', 'bnb');

    this.fanzBnbPrice = parseFloat(response.data.price);

    return this.fanzBnbPrice;
  }

  async updateFanzUsdPrice() {
    /*
        var self = this
        setInterval(function () {
            self.getFanzUsdPrice()
        }, 30000)
        */
    this.getFanzUsdPrice();
  }

  getNetworkConfig() {
    if (!config.networks[this._selectedNetworkName]) return {};

    return config.networks[this._selectedNetworkName];
  }

  setSelectedNetworkName(networkName) {
    return new Promise((resolve, reject) => {
      try {
        if (!config.networks[networkName])
          reject(this._handleError({ message: 'geçersiz ağ' }));

        this._selectedNetworkName = networkName;
        resolve(true);
      } catch (error) {
        reject(this._handleError(error));
      }
    });
  }

  updateTokenBalance(symbol, balance) {
    this.getTokens();
    const token = this.currencyIndex[this._selectedNetworkName][symbol];

    if (balance < 0.0000099) balance = 0;

    token.balance = balance;
    token.usdBalance = token.usdPrice * token.balance;
    token.fanzBalance = token.usdBalance / this.fanzUsdPrice;
  }

  async _updateCurrencyRates() {
    if (this.lastCurrenctRateUpdateDate !== null) {
      if (
        (new Date().getTime() - this.lastCurrenctRateUpdateDate.getTime()) /
          1000 <
        30
      ) {
        return this.currencyList[this._selectedNetworkName];
      }
    }
    this.lastCurrenctRateUpdateDate = new Date();

    this.getTokens();

    var balances = await getWalletBalances();

    const networkName = this._selectedNetworkName;

    const currencyList = this.currencyList[networkName];

    var bnbusd = await this.getTokenUsdPrice('BNB');
    var trybusd = await this.getTokenUsdPrice('TRYB');
    var fanzusd = await this.getFanzUsdPrice();

    currencyList.forEach(async (token) => {
      token.balance = balances[token.symbol] * 1;
      if (token.symbol !== 'FANZ') {
        //TODO!
        if (token.symbol == 'BNB') {
          token.usdPrice = bnbusd;
        } else if (token.symbol == 'TRYB') {
          token.usdPrice = trybusd;
        } else {
          token.usdPrice = 1;
        }
        token.usdBalance = token.usdPrice * token.balance;
        token.fanzBalance = token.usdBalance / this.fanzUsdPrice;
      } else {
        token.usdPrice = fanzusd;
        //token.usdBalance =  this.fanzUsdPrice
        token.usdBalance = token.usdPrice * token.balance;
        token.fanzBalance = token.balance;
      }
    });

    return currencyList;
  }

  async updateCurrencyRates() {
    return this._updateCurrencyRates();
  }

  getTotalFanzBalance() {
    return new Promise((resolve, reject) => {
      this.updateCurrencyRates().then((currencyList) => {
        var fanzBalance = 0;
        var usdBalance = 0;
        currencyList.forEach((token) => {
          fanzBalance += token.fanzBalance;
          usdBalance += token.usdBalance;
        });

        resolve({ fanzBalance, usdBalance, currencyList });
      });
    });
  }

  getTokens() {
    const networkName = this._selectedNetworkName;

    if (this.currencyList[networkName])
      return {
        currencyList: this.currencyList[networkName],
        currencyIndex: this.currencyIndex[networkName],
      };

    this.currencyList[networkName] = [];
    this.currencyIndex[networkName] = [];

    const tokens = config.networks[networkName].tokens;
    var mainToken = {
      address: tokens.mainToken.tokenAddress,
      symbol: tokens.mainToken.symbol,
      balance: 0,
      usdPrice: 0,
      usdBalance: 0,
      fanzBalance: 0,
      decimals: 18,
    };
    var platformToken = {
      address: null,
      symbol: tokens.platformToken.symbol,
      balance: 0,
      usdPrice: 0,
      usdBalance: 0,
      fanzBalance: 0,
      decimals: 18,
    };

    this.currencyList[networkName].push(mainToken);
    this.currencyList[networkName].push(platformToken);

    this.currencyIndex[networkName][mainToken.symbol] = mainToken;
    this.currencyIndex[networkName][platformToken.symbol] = platformToken;

    tokens.currencies.forEach((c) => {
      var currency = {
        address: c.tokenAddress,
        symbol: c.symbol,
        balance: 0,
        usdPrice: 0,
        usdBalance: 0,
        fanzBalance: 0,
        decimals: c.decimals,
      };

      this.currencyIndex[networkName][c.symbol] = currency;
      this.currencyList[networkName].push(currency);
    });

    return {
      currencyList: this.currencyList[networkName],
      currencyIndex: this.currencyIndex[networkName],
    };
  }

  clearTokenBalance() {
    const networkName = this._selectedNetworkName;
    this.currencyList[networkName] = null;
    this.getTokens();
  }

  getTokenBalance(accountAddress, tokenSymbol) {
    return new Promise((resolve, reject) => {
      if (!accountAddress)
        reject(this._handleError({ message: 'address not found!' }));
      if (!tokenSymbol)
        reject(this._handleError({ message: 'token not found!' }));

      try {
        const networkName = this._selectedNetworkName;

        var currencyIndex = this.currencyIndex[networkName];

        this.getNetworkProvider()
          .then((web3Wallet) => {
            let walletCurrencyAmount = 0;

            if (tokenSymbol === 'BNB') {
              // @ts-ignore
              walletCurrencyAmount = web3Wallet.eth.getBalance(accountAddress);
            } else {
              var currencyInfo = currencyIndex[tokenSymbol];

              if (!currencyInfo.tokenInstance) {
                // @ts-ignore
                currencyInfo.tokenInstance = new web3Wallet.eth.Contract(
                  IBEP20.abi,
                  currencyInfo.address
                );
              }

              walletCurrencyAmount = currencyInfo.tokenInstance.methods
                .balanceOf(accountAddress)
                .call();
            }

            resolve(walletCurrencyAmount);
          })
          .catch((error) => {
            reject(this._handleError(error));
          });
      } catch (error) {
        reject(this._handleError(error));
      }
    });
  }

  getNetworkProvider() {
    return new Promise((resolve, reject) => {
      try {
        const networkName = this._selectedNetworkName;

        if (!this._networkWeb3Provider[networkName]) {
          // @ts-ignore
          this._networkWeb3Provider[networkName] = new Web3(
            config.networks[networkName].rpcUrl1
          );
        }

        resolve(this._networkWeb3Provider[networkName]);
      } catch (error) {
        reject(this._handleError(error));
      }
    });
  }

  getGasPrice() {
    return new Promise((resolve, reject) => {
      try {
        this.getNetworkProvider().then((web3) => {
          // @ts-ignore
          web3.eth.getGasPrice().then((gasPrice) => {
            resolve(gasPrice / 10 ** 18);
          });
        });
      } catch (error) {
        reject(this._handleError(error));
      }
    });
  }

  getEstimateTransactionFeeFromServer(receiverAddress, amount, tokenSymbol) {
    return new Promise((resolve, reject) => {
      try {
        apiHelper
          .getEstimateTransactionFee(receiverAddress, amount, tokenSymbol)
          .then((fee) => {
            resolve(fee);
          })
          .catch((error) => {
            reject(this._handleError(error));
          });
      } catch (error) {
        reject(this._handleError(error));
      }
    });
  }

  withdraw(receiverAddress, amount, tokenSymbol, validationCode) {
    return new Promise((resolve, reject) => {
      try {
        apiHelper
          .withdraw(receiverAddress, amount, tokenSymbol, validationCode)
          .then((txn_hash) => {
            resolve(txn_hash);
          })
          .catch((error) => {
            reject(this._handleError(error));
          });
      } catch (error) {
        reject(this._handleError(error));
      }
    });
  }

  getEstimateApproveTokenTransactionFeeFromServer(amount, tokenSymbol) {
    return new Promise((resolve, reject) => {
      try {
        apiHelper
          .getEstimateApproveTokenTransactionFee(amount, tokenSymbol)
          .then((fee) => {
            resolve(fee);
          })
          .catch((error) => {
            reject(this._handleError(error));
          });
      } catch (error) {
        reject(this._handleError(error));
      }
    });
  }

  getEstimateBuyFanzTransactionFee(amount, tokenSymbol) {
    return new Promise((resolve, reject) => {
      try {
        apiHelper
          .getEstimateBuyFanzTransactionFee(amount, tokenSymbol)
          .then((fee) => {
            resolve(fee);
          })
          .catch((error) => {
            reject(this._handleError(error));
          });
      } catch (error) {
        reject(this._handleError(error));
      }
    });
  }

  _handleError(error) {
    if (typeof error === 'object' && error !== null) {
      var errorMessage = error.message;

      return errorMessage;
    } else {
      return error;
    }
  }
}

let web3Helper = new Web3Helper();
//web3Helper.updateFanzUsdPrice();
export default web3Helper;
