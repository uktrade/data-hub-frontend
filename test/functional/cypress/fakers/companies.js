import { jsf, faker } from '../../../utils'

import apiSchema from '../../../api-schema.json'

import { addressFaker } from './addresses'
import { listFaker } from './utils'
import { adviserFaker } from './advisers'
import { ukRegionFaker } from './regions'
import { UNITED_KINGDOM_ID, CANADA_ID } from '../../../../src/common/constants'

/**
 * Generate fake data for a single company.
 *
 * Starts by generating data based on the json schema, adds some defaults and
 * merges in overrides.
 */
const companyFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Company),
  id: faker.string.uuid(),
  address: addressFaker(),
  registered_address: addressFaker(),
  one_list_group_global_account_manager: adviserFaker(),
  one_list_group_tier: {
    id: faker.string.uuid(),
    name: faker.word.adjective(),
  },
  uk_region: ukRegionFaker(),
  archived: false,
  ...overrides,
})

/**
 * Generate fake data for a list of companies.
 *
 * The number of items is determined by the length (default is 1).
 * Overrides are applied to all items in the list (default is {}).
 */
const companyListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: companyFaker, length, overrides })

export { companyFaker, companyListFaker }

export default companyListFaker

/**
 * Fake companies used for the Overview page component and functional testing.
 *
 */

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
  exportSubSegment: 'sustain_nurture_and_grow',
  exportPotential: 'High',
  exportCountries: [
    {
      country: {
        id: '12341',
        name: 'France',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        id: '12342',
        name: 'Germany',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        id: '12343',
        name: 'Netherlands',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        id: '12344',
        name: 'Canada',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        id: '12345',
        name: 'Argentina',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        id: '12346',
        name: 'Brazil',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        id: '12347',
        name: 'Iceland',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        id: '955f66a0-5d95-e211-a939-e4115bead28a',
        name: 'Algeria',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        id: '12349',
        name: 'Vietnam',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        id: '12340',
        name: 'Australia',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        id: '12350',
        name: 'Moldova',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        name: 'Western Sahara',
        id: '36afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        name: 'Saint Helena',
        id: 'dec8d80f-efe5-4190-a8e9-c8ccc38e7724',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Samoa',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'San Marino',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Saudi Arabia',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Senegal',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Serbia',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Seychelles',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Sharjah',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Singapore',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Slovakia',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Slovenia',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Somalia',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Spain',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Sri Lanka',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        id: '4123',
        name: 'Sweden',
      },
      status: 'not_interested',
    },
  ],
})

export const companyNoGlobalUltimateAllDetails = companyFaker({
  id: 'ba8fae21-2895-47cf-90ba-9273c94dab88',
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
  exportSubSegment: 'reassure_change_the_game',
  exportCountries: [
    {
      country: {
        id: '12341',
        name: 'France',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        id: '12342',
        name: 'Germany',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        id: '12343',
        name: 'Netherlands',
      },
      status: 'currently_exporting',
    },
    {
      country: {
        name: 'Samoa',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'San Marino',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        name: 'Saudi Arabia',
        id: '37afd8d0-5d95-e211-a939-e4115bead28a',
      },
      status: 'future_interest',
    },
    {
      country: {
        id: '4123',
        name: 'Sweden',
      },
      status: 'not_interested',
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
  id: '1111ae21-2895-47cf-90ba-9273c94dab88',
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
