import { genLanKeys } from '../../../../config/i18n/i18.interface';

const lans = {
  en: {
    translations: {
      transactionStatus: 'transaction status',
    },
  },
  zh: {
    translations: {
      transactionStatus: 'transaction status',
    },
  },
};

export default lans;

export const lanKeys = genLanKeys(lans);
