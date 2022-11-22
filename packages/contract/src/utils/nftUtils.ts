const UNIQUE = 'UNIQUE';
const EPIC = 'EPIC';
const RARE = 'RARE';
const UNCOMMON = 'UNCOMMON';
const COMMON = 'COMMON';

export const getRarityLevel = (amount) => {
  if (!amount) return COMMON;

  if (amount > 1000) return COMMON;
  else if (amount > 100) return UNCOMMON;
  else if (amount > 10) return RARE;
  else if (amount > 1) return EPIC;
  else return UNIQUE;
};
