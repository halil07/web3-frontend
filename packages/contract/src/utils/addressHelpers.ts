import contracts from '../config/constants/contracts';

export const getAddress = (address: any) => {
  const mainNetChainId = 56;
  const chainId = process.env.REACT_APP_CHAIN_ID;
  //@ts-ignore
  return address[chainId] ? address[chainId] : address[mainNetChainId];
};

export const getPancakePairAddress = () => getAddress(contracts.pancakepair)

export const getTokenSaleAddress = () => getAddress(contracts.tokenSale)

export const getFanzAddress = () => getAddress(contracts.fanz)

export const getSuperstarAddress = () => getAddress(contracts.superstar)

export const getLotteryAddress = () => getAddress(contracts.lottery)

export const getLotteryTicketAddress = () => getAddress(contracts.lotteryNFT)

export const getMulticallAddress = () => getAddress(contracts.multiCall)

export const getReferralRewardAddress = () => getAddress(contracts.referralReward)

export const getMorningstarAddress = () => getAddress(contracts.morningstar)

export const getFanzNftAddress = () => getAddress(contracts.fanzNft)

export const getNftSaleAddress = () => getAddress(contracts.nftSale)

export const getNftSaleStorageAddress = () => getAddress(contracts.nftSaleStorage)

export const getProfileFactoryAddress = () => getAddress(contracts.profileFactory)
