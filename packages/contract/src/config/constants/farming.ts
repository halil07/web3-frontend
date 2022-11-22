import { getAddress } from 'utils/addressHelpers';

const farming = [
  {
    from: 'FANZ',
    to: 'BNB',
    get address() {
      // return default address
      return getAddress(this.addresses.morningstar);
    },
    get lp_address() {
      return getAddress(this.addresses.lptoken);
    },
    addresses: {
      morningstar: {
        97: '0xeF4247dA41Cb1342f725031e101eA855FedaC44c',
        56: '0xF6f2B5f4d40e414F83661bB9e17E50Ae92b2930A',
      },
      lptoken: {
        97: '0xf855e52ecc8b3b795ac289f85f6fd7a99883492b',
        56: '0xe6f819efdda2f0f3fc51383916ea314cb6268847',
      },
    },
  },
];

export default farming;
