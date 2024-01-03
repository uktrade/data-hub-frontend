import { companyFaker } from '../../../../functional/cypress/fakers/companies'

import {
  UNITED_KINGDOM_ID,
  CANADA_ID,
} from '../../../../../src/common/constants'

export const companyGlobalUltimateAllDetails = companyFaker({
  companyNumber: '01261539',
  address: {
    line1: '1 On The Road',
    line2: '',
    town: 'Bristol',
    county: 'North Somerset',
    postcode: 'BS20 2BB',
    country: {
      id: UNITED_KINGDOM_ID,
      name: 'United Kingdom',
    },
  },
  website: 'www.there.com',
  numberOfEmployees: 200,
  turnoverGbp: 200000,
  sector: {
    name: 'Aerospace',
    id: '9538cecc-5f95-e211-a939-e4115bead28a',
  },
  globalUltimateCountry: 'United Kingdom',
  ukRegion: {
    name: 'South East',
  },
  oneListGroupGlobalAccountManager: {
    name: 'Billy Bob',
  },
  oneListGroupTier: {
    name: 'Tier A - SRM Programme Accounts',
  },
  contacts: [
    {
      id: '11-11-11',
      name: 'Max Speed',
      primary: true,
      url: '/contacts/11-11-11/details',
    },
    {
      id: '22-22-22',
      name: 'Min Height',
      primary: true,
      url: '/contacts/22-22-22/details',
    },
    {
      id: '33-33-33',
      name: 'Not Here',
      primary: false,
      url: '/contacts/33-33-33/details',
    },
  ],
})

export const companyNoGlobalUltimateAllDetails = companyFaker({
  companyNumber: '01261539',
  address: {
    line1: '1 On The Road',
    line2: '',
    town: 'Bristol',
    county: 'North Somerset',
    postcode: 'BS20 2BB',
    country: {
      id: UNITED_KINGDOM_ID,
      name: 'United Kingdom',
    },
  },
  website: 'www.there.com',
  numberOfEmployees: 200,
  turnoverGbp: 200000,
  sector: {
    name: 'Aerospace',
    id: '9538cecc-5f95-e211-a939-e4115bead28a',
  },
  globalUltimateCountry: null,
  ukRegion: {
    name: 'South East',
  },
  oneListGroupGlobalAccountManager: {
    name: 'Billy Bob',
  },
  oneListGroupTier: {
    name: 'Tier D - International Trade Adviser Accounts',
    id: '1929c808-99b4-4abf-a891-45f2e187b410',
  },
  contacts: [
    {
      id: '11-11-11',
      name: 'Max Speed',
      primary: true,
      url: '/contacts/11-11-11/details',
    },
    {
      id: '22-22-22',
      name: 'Min Height',
      primary: true,
      url: '/contacts/22-22-22/details',
    },
    {
      id: '33-33-33',
      name: 'Not Here',
      primary: false,
      url: '/contacts/33-33-33/details',
    },
  ],
})

export const companyRegisteredAddressOnly = companyFaker({
  companyNumber: '01261539',
  address: null,
  registeredAddress: {
    line1: '1 On The Road',
    line2: '',
    town: 'Bristol',
    county: 'North Somerset',
    postcode: 'BS20 2BB',
    country: {
      id: UNITED_KINGDOM_ID,
      name: 'United Kingdom',
    },
  },
  website: 'www.there.com',
  numberOfEmployees: 200,
  turnoverGbp: 200000,
  sector: {
    name: 'Aerospace',
    id: '9538cecc-5f95-e211-a939-e4115bead28a',
  },
  globalUltimateCountry: null,
})

export const companyNoDetails = companyFaker({
  companyNumber: null,
  address: null,
  website: null,
  numberOfEmployees: null,
  turnoverGbp: null,
  sector: null,
  ukRegion: null,
  oneListGroupGlobalAccountManager: null,
  oneListGroupTier: null,
  contacts: [{}],
})

export const companyNonUK = companyFaker({
  companyNumber: '01261539',
  address: {
    line1: '1 Off The Road',
    line2: '',
    town: 'Montreal',
    county: 'QC',
    postcode: 'H3Z 2Y7',
    country: {
      id: CANADA_ID,
      name: 'Canada',
    },
  },
  website: 'www.there.com',
  numberOfEmployees: 200,
  turnoverGbp: 200000,
  sector: {
    name: 'Aerospace',
    id: '9538cecc-5f95-e211-a939-e4115bead28a',
  },
  globalUltimateCountry: 'Canada',
})
