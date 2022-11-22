import random from 'lodash/random';

import networks from './config';

class Network {
  get networkType() {
    // eslint-disable-next-line no-undef
    return process.env.REACT_APP_NETWORK_TYPE;
  }

  find(params = {}) {
    return this.get(params);
  }

  get({
    chainId = undefined,
    shortName = undefined,
    displayName = undefined,
  } = {}) {
    // @ts-ignore
    const networkList = networks[this.networkType];
    if (!chainId && !shortName && !displayName) {
      // eslint-disable-next-line no-undef
      // @ts-ignore
      chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);
    }

    const network = networkList.find(
      (entity) =>
        entity.shortName === shortName ||
        entity.networkId === chainId ||
        entity.displayName === displayName
    );

    return network;
  }

  rpcUrl({ chainId = undefined, shortName = undefined } = {}) {
    // @ts-ignore
    const networkList = networks[this.networkType];
    if (!chainId && !shortName) {
      // eslint-disable-next-line no-undef
      // @ts-ignore
      chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);
    }

    const network = networkList.find(
      (entity) => entity.shortName === shortName || entity.networkId === chainId
    );

    const idx = random(0, network.rpcUrls.length - 1);

    return network.rpcUrls[idx];
  }
}

const network = new Network();
export default network;
