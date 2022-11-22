import BigNumber from 'bignumber.js';
import { Interface } from '@ethersproject/abi';
import { getWeb3NoAccount } from 'utils/web3';
import MultiCallAbi from 'config/abi/Multicall2.json';
import ticketAbi from 'config/abi/lotteryNft.json';
import lotteryAbi from 'config/abi/lottery.json';
import { DEFAULT_TOKEN_DECIMAL, LOTTERY_TICKET_PRICE } from 'config';
import { getMulticallAddress } from './addressHelpers';
import { BIG_ZERO } from './bigNumber';

export const multiCall = async (abi:any, calls:any, split?:any) => {
  split = split ?? 100;
  const web3 = getWeb3NoAccount();
  // @ts-ignore
  const multi = new web3.eth.Contract(MultiCallAbi, getMulticallAddress());
  const itf = new Interface(abi);
  let res:any = [];
  if (calls.length > split) {
    let i = 0;
    while (i < calls.length / split) {
      const newCalls = calls.slice(i * split, split * (i + 1));

      const calldata = newCalls.map((call:any) => [
        call[0].toLowerCase(),
        itf.encodeFunctionData(call[1], call[2]),
      ]);
      const { returnData } = await multi.methods.aggregate(calldata).call();

      i++;
      res = res.concat(
        returnData.map((call:any, index:any) =>
          itf.decodeFunctionResult(newCalls[index][1], call)
        )
      );
    }
  } else {
    const calldata = calls.map((call:any) => [
      call[0].toLowerCase(),
      itf.encodeFunctionData(call[1], call[2]),
    ]);
    const { returnData } = await multi.methods.aggregate(calldata).call();
    res = returnData.map((call:any, i:any) =>
      itf.decodeFunctionResult(calls[i][1], call)
    );
  }
  return res;
};
export const multiBuy = async (
  lotteryContract:any,
  price:any,
  numbersList:any,
  account:any
) => {
  try {
    return lotteryContract.methods
      .multiBuy(
        new BigNumber(price).times(DEFAULT_TOKEN_DECIMAL).toString(),
        numbersList
      )
      .send({ from: account });
  } catch (err) {
    return console.error(err);
  }
};

export const getTickets = async (
  lotteryContract:any,
  ticketsContract:any,
  account:any,
  customLotteryNum:any
) => {
  const issueIndex =
    customLotteryNum || (await lotteryContract.methods.issueIndex().call());

  var ttickets = await ticketsContract.methods
    .getTickets(account, issueIndex)
    .call();
  let tickets:any = [];

  ttickets.forEach((ticket:any, i) => {
    if (ticket.tokenId != 0) tickets.push(ticket);
  });

  //getTickets_(lotteryContract, ticketsContract, account, customLotteryNum)
  return tickets;
};
export const getTicketCount = async (
  lotteryContract:any,
  ticketsContract:any,
  account:any,
  customLotteryNum:any
) => {
  const issueIndex =
    customLotteryNum || (await lotteryContract.methods.issueIndex().call());

  var ttickets = await ticketsContract.methods
    .getTickets(account, issueIndex)
    .call();
  let tickets:any = [];

  ttickets.forEach((ticket:any, i:any) => {
    if (ticket.tokenId != 0) tickets.push(ticket);
  });

  //getTickets_(lotteryContract, ticketsContract, account, customLotteryNum)
  return tickets.length;
};

export const getTickets_ = async (
  lotteryContract:any,
  ticketsContract:any,
  account:any,
  customLotteryNum:any
) => {
  const issueIndex =
    customLotteryNum || (await lotteryContract.methods.issueIndex().call());

  const length = await getTicketsAmount(ticketsContract, account);
  // eslint-disable-next-line prefer-spread
  // @ts-ignore
  const calls1 = Array.apply(null, { length }).map((a, i) => [
    ticketsContract.options.address,
    'tokenOfOwnerByIndex',
    [account, i],
  ]);

  const res = await multiCall(ticketAbi, calls1);
  const tokenIds = res.map((id) => id.toString());
  const calls2 = tokenIds.map((id) => [
    ticketsContract.options.address,
    'getLotteryIssueIndex',
    [id],
  ]);

  console.log(calls2);
  const ticketIssues = await multiCall(ticketAbi, calls2);
  const finalTokenids:any = [];

  console.log(ticketIssues);
  ticketIssues.forEach(async (ticketIssue:any, i:any) => {
    if (new BigNumber(ticketIssue).eq(issueIndex)) {
      finalTokenids.push(tokenIds[i]);
    }
  });
  const calls3 = finalTokenids.map((id:any) => [
    ticketsContract.options.address,
    'getLotteryNumbers',
    [id],
  ]);
  const tickets = await multiCall(ticketAbi, calls3);
  await getLotteryStatus(lotteryContract);
  console.log(tickets);
  return tickets;
};
export const getTicketsAmount = async (ticketsContract:any, account:any) => {
  return ticketsContract.methods.balanceOf(account).call();
};
export const multiClaim = async (lotteryContract, ticketsContract, account) => {
  const issueIndex = await lotteryContract.methods.issueIndex().call();
  const drawed = await lotteryContract.methods.drawed().call();

  var ttickets = await ticketsContract.methods
    .getTicketsByClaimStatus(account, 0, false)
    .call();

  let tokenIds:any = [];

  ttickets.forEach((ticket, i) => {
    if (ticket.tokenId != 0) {
      if (drawed) tokenIds.push(ticket.tokenId);
      else if (ticket.issueIndex.toString() != issueIndex.toString())
        tokenIds.push(ticket.tokenId);
    }
  });

  if (tokenIds.length > 200) {
    tokenIds = tokenIds.slice(0, 200);
  }
  try {
    return lotteryContract.methods
      .multiClaim(tokenIds)
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash;
      });
  } catch (err) {
    return console.error(err);
  }
};

export const getTotalClaim_ = async (
  lotteryContract,
  ticketsContract,
  account,
  customLotteryNum
) => {
  try {
    const issueIndex = await lotteryContract.methods.issueIndex().call();
    const length = await getTicketsAmount(ticketsContract, account);
    // eslint-disable-next-line prefer-spread
    //@ts-ignore
    const calls1 = Array.apply(null, { length }).map((a, i) => [
      ticketsContract.options.address,
      'tokenOfOwnerByIndex',
      [account, i],
    ]);
    const res = await multiCall(ticketAbi, calls1);
    const tokenIds = res.map((id) => id.toString());
    const calls2 = tokenIds.map((id) => [
      ticketsContract.options.address,
      'getLotteryIssueIndex',
      [id],
    ]);
    const ticketIssues = await multiCall(ticketAbi, calls2);
    const calls3 = tokenIds.map((id) => [
      ticketsContract.options.address,
      'getClaimStatus',
      [id],
    ]);
    const claimedStatus = await multiCall(ticketAbi, calls3);
    const drawed = await getLotteryStatus(lotteryContract);
    const finalTokenIds:any = [];
    ticketIssues.forEach(async (ticketIssue, i) => {
      if (customLotteryNum) {
        if (
          ticketIssue.toString() === customLotteryNum.toString() &&
          !claimedStatus[i][0]
        )
          finalTokenIds.push(tokenIds[i]);
      } else {
        // eslint-disable-next-line no-empty
        if (!drawed && ticketIssue.toString() === issueIndex) {
        } else if (!claimedStatus[i][0]) {
          finalTokenIds.push(tokenIds[i]);
        }
      }
    });

    const calls4 = finalTokenIds.map((id) => [
      lotteryContract.options.address,
      'getRewardView',
      [id],
    ]);
    const rewards = await multiCall(lotteryAbi, calls4);
    const claim = rewards.reduce((p, c) => BigNumber.sum(p, c), BIG_ZERO);
    return claim;
  } catch (err) {
    console.error(err);
  }
  return BIG_ZERO;
};
export const getTotalClaim = async (
  lotteryContract,
  ticketsContract,
  account,
  customLotteryNum
) => {
  try {
    const issueIndex = await lotteryContract.methods.issueIndex().call();
    const drawed = await lotteryContract.methods.drawed().call();

    var ttickets = await ticketsContract.methods
      .getTicketsByClaimStatus(account, customLotteryNum || 0, false)
      .call();

    let tokenIds:any = [];

    ttickets.forEach((ticket, i) => {
      if (ticket.tokenId != 0) {
        if (drawed) tokenIds.push(ticket.tokenId);
        else if (ticket.issueIndex.toString() != issueIndex.toString())
          tokenIds.push(ticket.tokenId);
      }
    });

    const trewards = await lotteryContract.methods
      .getTotalRewardView(tokenIds)
      .call();
    return trewards;
  } catch (err) {
    console.error(err);
  }
  return BIG_ZERO;
};
export const getTotalRewards = async (lotteryContract) => {
  const issueIndex = await lotteryContract.methods.issueIndex().call();
  return lotteryContract.methods.getTotalRewards(issueIndex).call();
};
export const getMax = async (lotteryContract) => {
  return lotteryContract.methods.maxNumber().call();
};
export const getLotteryIssueIndex = async (lotteryContract) => {
  const issueIndex = await lotteryContract.methods.issueIndex().call();
  return issueIndex;
};
export const getLotteryStatus = async (lotteryContract) => {
  return lotteryContract.methods.drawed().call();
};
export const getMatchingRewardLength = async (lotteryContract, matchNumber) => {
  let issueIndex = await lotteryContract.methods.issueIndex().call();
  const drawed = await lotteryContract.methods.drawed().call();
  if (!drawed) {
    issueIndex -= 1;
  }
  try {
    const amount = await lotteryContract.methods
      .historyAmount(issueIndex, 5 - matchNumber)
      .call();
    return new BigNumber(amount)
      .div(DEFAULT_TOKEN_DECIMAL)
      .div(LOTTERY_TICKET_PRICE)
      .toNumber();
  } catch (err) {
    console.error(err);
  }
  return 0;
};
export const getWinningNumbers = async (lotteryContract) => {
  const issueIndex = await lotteryContract.methods.issueIndex().call();
  const numbers = [];
  const drawed = await lotteryContract.methods.drawed().call();
  if (!drawed && parseInt(issueIndex, 10) === 0) {
    return [0, 0, 0, 0];
  }
  if (!drawed) {
    for (let i = 0; i < 4; i++) {
      // @ts-ignore
      numbers.push(+(
          await lotteryContract.methods.historyNumbers(issueIndex - 1, i).call()
        ).toString()
      );
    }
  } else {
    for (let i = 0; i < 4; i++) {
      // @ts-ignore
      numbers.push(+(await lotteryContract.methods.winningNumbers(i).call()).toString());
    }
  }
  return numbers;
};

export const getMatchingRewardAmounts = async (
  lotteryContract,
  lotteryIssue
) => {
  const length = 4;
  // @ts-ignore
  const calls1 = Array.apply(null, { length }).map((a, i) => [
    lotteryContract.options.address,
    'historyAmount',
    [lotteryIssue, i + 1],
  ]);
  console.log(calls1);
  console.log(lotteryAbi);
  const res = await multiCall(lotteryAbi, calls1);
  console.log(res);
};
