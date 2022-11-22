import BigNumber from 'bignumber.js/bignumber';
import { BIG_TEN } from 'utils/bigNumber';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const BSC_BLOCK_TIME = 3;
export const FANZ_USD_PRICE = 0.01;

export const LOTTERY_TICKET_PRICE = 100;
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50;
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18);

// FANZ_PER_BLOCK details
// 40 FANZ is minted per block
// 20 FANZ per block is sent to Burn pool (A farm just for burning fanz)
// 10 FANZ per block goes to FANZ Superstar pool
// 10 FANZ per block goes to Yield farms and lottery
// FANZ_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// FANZ/Block in src/views/Home/components/FanzStats.tsx = 20 (40 - Amount sent to burn pool)

export const FANZ_PER_BLOCK = new BigNumber(0.1);
export const BLOCKS_PER_YEAR = new BigNumber(
  (60 / BSC_BLOCK_TIME) * 60 * 24 * 365
); // 10512000
export const FANZ_PER_YEAR = FANZ_PER_BLOCK.times(BLOCKS_PER_YEAR);

export const NFT_CURRENCIES = {
  bscTestnet: [
    {
      symbol: 'FANZ',
      tokenAddress: '0xCF196780815610399bE17299E97581c95D30A17E',
      decimals: 18,
    },
    {
      symbol: 'BNB',
      tokenAddress: '',
    },
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
  ],
  bscMainnet: [
    {
      symbol: 'FANZ',
      tokenAddress: '0xaC6148f83400803eA7D82B9D7dA2820Ea2063296',
      decimals: 18,
    },
    {
      symbol: 'BNB',
      tokenAddress: '',
    },
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
  ],
};

export const NFT_CATEGORIES = [
  { id: 3, title: 'Art', image: 'nft-category-art.png' },
  { id: 5, title: 'Memes', image: 'nft-category-memes.png' },
  { id: 2, title: 'Sports', image: 'nft-category-sports.png' },
  { id: 6, title: 'Collectibles', image: 'nft-category-collectibles.png' },
  { id: 1, title: 'Games', image: 'nft-category-games.png' },
  { id: 4, title: 'Fashion', image: 'nft-category-fashion.png' },
];
