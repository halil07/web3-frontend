import BSCIcon from './assets/bsc.png';
import PolygonIcon from './assets/polygon.png';

const config = {
  mainnet: [
    {
      name: 'BSCMainNet',
      icon: BSCIcon,
      displayName: 'Binance Smart Chain',
      shortName: 'BSC',
      networkId: 56,
      rpcUrls: [
        'https://speedy-nodes-nyc.moralis.io/cdea398cbaccd57f2e79cf9f/bsc/mainnet',
      ],
      blockExplorerURL: 'https://bscscan.com',
      currencySymbol: 'BNB',
      multicallAddress: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
      tokens: {
        platformToken: {
          symbol: 'BNB',
          tokenAddress: '',
        },
        mainToken: {
          symbol: 'FANZ',
          tokenAddress: '0xaC6148f83400803eA7D82B9D7dA2820Ea2063296',
          decimals: 18,
        },
        currencies: [
          {
            symbol: 'USDT',
            tokenAddress: '0x55d398326f99059fF775485246999027B3197955',
            decimals: 18,
          },
          {
            symbol: 'TRYB',
            tokenAddress: '0xC1fdbed7Dac39caE2CcC0748f7a80dC446F6a594',
            decimals: 6,
          },
          {
            symbol: 'USDC',
            tokenAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
            decimals: 18,
          },
          {
            symbol: 'BUSD',
            tokenAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
            decimals: 18,
          },
        ],
      },
    },
    {
      name: 'PolygonMainNet',
      icon: PolygonIcon,
      displayName: 'Polygon',
      shortName: 'Polygon',
      networkId: 137,
      rpcUrls: [
        'https://speedy-nodes-nyc.moralis.io/60c5efee4093775cc321a13c/polygon/mainnet',
      ],
      blockExplorerURL: 'https://polygonscan.com',
      currencySymbol: 'Matic',
      tokens: {
        platformToken: {
          symbol: 'Matic',
          tokenAddress: '',
        },
        mainToken: {
          symbol: 'FANZ',
          tokenAddress: '0x4e16cab588f695fFA4d2E27645D74331F79a62d0',
          decimals: 18,
        },
      },
    },
  ],
  testnet: [
    {
      name: 'BSCTestNet',
      icon: BSCIcon,
      displayName: 'Binance Smart Chain',
      shortName: 'BSC',
      networkId: 97,
      rpcUrls: [
        'https://speedy-nodes-nyc.moralis.io/cdea398cbaccd57f2e79cf9f/bsc/testnet/',
      ],
      blockExplorerURL: 'https://testnet.bscscan.com',
      currencySymbol: 'BNB',
      multicallAddress: '0x6e5BB1a5Ad6F68A8D7D6A5e47750eC15773d6042',
      tokens: {
        platformToken: {
          symbol: 'BNB',
          tokenAddress: '',
        },
        mainToken: {
          symbol: 'FANZ',
          tokenAddress: '0xCF196780815610399bE17299E97581c95D30A17E',
          decimals: 18,
        },
        currencies: [
          {
            symbol: 'USDT',
            tokenAddress: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
            decimals: 18,
          },
          {
            symbol: 'TRYB',
            tokenAddress: '0xeBcA807E7d326cAE09eC19c9bF489Ee65Af2191a',
            decimals: 6,
          },
          {
            symbol: 'USDC',
            tokenAddress: '0x64544969ed7EBf5f083679233325356EbE738930',
            decimals: 18,
          },
          {
            symbol: 'BUSD',
            tokenAddress: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
            decimals: 18,
          },
        ],
      },
    },
    {
      name: 'PolygonTestNet',
      icon: PolygonIcon,
      displayName: 'Polygon',
      shortName: 'Polygon',
      networkId: 80001,
      rpcUrls: [
        'https://speedy-nodes-nyc.moralis.io/60c5efee4093775cc321a13c/polygon/mumbai',
      ],
      blockExplorerURL: 'https://mumbai.polygonscan.com',
      currencySymbol: 'Matic',
      tokens: {
        platformToken: {
          symbol: 'Matic',
          tokenAddress: '',
        },
        mainToken: {
          symbol: 'FANZ',
          tokenAddress: '',
          decimals: 18,
        },
      },
    },
  ],
};

export default config;
