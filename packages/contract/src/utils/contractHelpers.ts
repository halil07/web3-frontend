import {
  getLotteryAddress,
  getLotteryTicketAddress,
  getReferralRewardAddress,
  getMulticallAddress,
  getMorningstarAddress,
  getFanzAddress,
  getSuperstarAddress,
  getFanzNftAddress,
  getNftSaleAddress,
  getNftSaleStorageAddress,
  getPancakePairAddress,
  getProfileFactoryAddress,
} from './addressHelpers';
import web3NoAccount from './web3';

import lotteryAbi from '../config/abi/lottery.json';
import lotteryTicketAbi from '../config/abi/lotteryNft.json';
import referralRewardAbi from '../config/abi/ReferralReward.json';
import multiCallAbi from '../config/abi/Multicall2.json';
import morningstarAbi from '../config/abi/morningstar.json';
import erc20Abi from '../config/abi/erc20.json';
import fanzNftAbi from '../config/abi/fanzNft.json';
import nftSaleAbi from '../config/abi/nftSale.json';
import nftSaleStorageAbi from '../config/abi/nftSaleStorage.json';
import PancakePairAbi from '../config/abi/PancakePair.json';
import ProfileFactoryAbi from '../config/abi/profileFactory.json';
import lpTokenAbi from '../config/abi/lpToken.json';
const getContract = (abi:any, address:any, web3:any) => {
  const _web3 = web3 ?? web3NoAccount;
  return new _web3.eth.Contract(abi, address);
};

export const getFanzContract = (web3:any) => getContract(erc20Abi, getFanzAddress(), web3)
export const getSuperstarContract = (web3:any) => getContract(erc20Abi, getSuperstarAddress(), web3)
export const getERC20Contract = (web3:any, contractAddress:any) => getContract(erc20Abi, contractAddress, web3)
export const getLPContract = (web3:any, contractAddress:any) => getContract(lpTokenAbi, contractAddress, web3)
export const getLotteryContract = (web3:any) => getContract(lotteryAbi, getLotteryAddress(), web3)
export const getLotteryTicketContract = (web3:any) => getContract(lotteryTicketAbi, getLotteryTicketAddress(), web3)
export const getReferralRewardContract = (web3:any) => getContract(referralRewardAbi, getReferralRewardAddress(), web3)
export const getMulticallContract = (web3:any) => getContract(multiCallAbi, getMulticallAddress(), web3)
export const getMorningstarContract = (web3:any, address = undefined) => getContract(morningstarAbi, address ?? getMorningstarAddress(), web3)
export const getFanzNftContract = (web3:any, contractAddress:any) => getContract(fanzNftAbi, contractAddress ?? getFanzNftAddress(), web3)
export const getNftSaleContract = (web3:any) => getContract(nftSaleAbi, getNftSaleAddress(), web3)
export const getNftSaleStorageContract = (web3:any) => getContract(nftSaleStorageAbi, getNftSaleStorageAddress(), web3)
export const getPancakePairContract = (web3:any) => getContract(PancakePairAbi, getPancakePairAddress(), web3)
export const getProfileFactoryContract = (web3:any) => getContract(ProfileFactoryAbi, getProfileFactoryAddress(), web3)
