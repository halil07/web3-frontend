import { Interface } from '@ethersproject/abi';
import web3NoAccount from './web3';
import { getMulticallContract } from './contractHelpers';
const multicall = async (abi, calls, options:{web3:any, blockNumber:any} = {web3:undefined, blockNumber:undefined}) => {
  try {
    const multi = getMulticallContract(options.web3 || web3NoAccount);
    const itf = new Interface(abi);
    const calldata = calls.map((call) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);
    const { returnData } = await multi.methods
      .aggregate(calldata)
      .call(undefined, options.blockNumber);
    const res = returnData.map((call, i) =>
      itf.decodeFunctionResult(calls[i].name, call)
    );
    return res;
  } catch (error) {
    // @ts-ignore
    throw new Error(error);
  }
};
/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return inclues a boolean whether the call was successful e.g. [wasSuccessfull, callResult]
 */
export const multicallv2 = async (abi, calls, options:{web3:any,blockNumber: any, requireSuccess:any} = {web3:undefined,blockNumber:undefined, requireSuccess:undefined}) => {
  const multi = getMulticallContract(options.web3 || web3NoAccount);
  const itf = new Interface(abi);
  const calldata = calls.map((call) => [
    call.address.toLowerCase(),
    itf.encodeFunctionData(call.name, call.params),
  ]);
  const returnData = await multi.methods
    .tryAggregate(
      options.requireSuccess === undefined ? true : options.requireSuccess,
      calldata
    )
    .call(undefined, options.blockNumber);
  const res = returnData.map((call, i) => {
    const [result, data] = call;
    return result ? itf.decodeFunctionResult(calls[i].name, data) : null;
  });
  return res;
};
export default multicall;
