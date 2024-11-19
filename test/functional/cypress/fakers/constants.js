import {
  STAGE_ACTIVE,
  STAGE_ASSIGN_PM,
  STAGE_PROSPECT,
  STAGE_VERIFY_WIN,
  STAGE_WON,
} from '../../../../src/client/modules/Investments/Projects/constants'

export const INVESTMENT_PROJECT_STAGES = {
  prospect: {
    id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
    name: STAGE_PROSPECT,
  },
  assignPm: {
    id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
    name: STAGE_ASSIGN_PM,
  },
  active: {
    id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
    name: STAGE_ACTIVE,
  },
  verifyWin: {
    id: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
    name: STAGE_VERIFY_WIN,
  },
  won: {
    id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
    name: STAGE_WON,
  },
}

export const INVESTMENT_PROJECT_STAGES_LIST = [
  {
    id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
    name: STAGE_PROSPECT,
  },
  {
    id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
    name: STAGE_ASSIGN_PM,
  },
  {
    id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
    name: STAGE_ACTIVE,
  },
  {
    id: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
    name: STAGE_VERIFY_WIN,
  },
  {
    id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
    name: STAGE_WON,
  },
]

export const INVESTMENT_PROJECT_STATUSES_LIST = [
  'ongoing',
  'delayed',
  'abandoned',
  'lost',
  'dormant',
]

export const ESTIMATED_EXPORT_VALUE_YEARS = [
  {
    id: 'a30384b5-2852-4ec5-bc3e-561927328361',
    name: '1 year',
  },
  {
    id: 'b94fbe96-c013-4dca-9b69-3c443652fd8d',
    name: '2 years',
  },
  {
    id: '8f4548c6-6f68-42ec-9ddc-e979fe7a6bb8',
    name: '3 years',
  },
  {
    id: '3f289d56-aec1-4472-a046-10828cad4992',
    name: '4 years',
  },
  {
    id: 'a30b8a1a-70fe-4b47-b4f2-ffe662fd61c9',
    name: '5 years',
  },
  {
    id: 'b9af9007-619c-426d-bfc3-cad3b96a34dd',
    name: 'Not yet known',
  },
]

export const EXPORTER_EXPERIENCE = [
  {
    id: '051a0362-d1a9-41c0-8a58-3171e5f59a8e',
    order: 0,
    name: 'Never exported',
  },
  {
    id: '41b37ec7-0e4d-4f2b-aeae-b5752e1fb79a',
    order: 10,
    name: 'Exported before, but no exports in the last 12 months',
  },
  {
    id: '8937c359-157e-41dd-8520-679383847ea0',
    order: 20,
    name: 'Exported in the last 12 months, but has not won an export order by having an export plan',
  },
  {
    id: '587928e3-cab1-45cb-ba49-0656b6d2f867',
    order: 30,
    name: 'An exporter with a new export win, but has not exported to this country within the last 3 years',
  },
  {
    id: '02a063e3-dab8-40ca-92d3-8e9c2d9f812d',
    order: 40,
    name: 'An exporter that DBT are helping maintain and grow their exports',
  },
  {
    id: 'd23012c5-c1a6-459d-9e05-b3d1b8539025',
    order: 1040,
    disabled_on: '2018-06-20T10:19:43Z',
    name: 'Is an exporter but exports currently account for less than 10% of its overall turnover',
  },
  {
    id: '9390cc45-6ebb-4005-866c-c87fd6d6dec0',
    order: 1080,
    disabled_on: '2018-06-20T10:19:43Z',
    name: 'Is an exporter but has only won export orders in three countries or fewer',
  },
]

export const HEADQUARTER_TYPE = [
  {
    id: '43281c5e-92a4-4794-867b-b4d5f801e6f3',
    name: 'ghq',
  },
  {
    id: 'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
    name: 'ehq',
  },
  {
    id: '3e6debb4-1596-40c5-aa25-f00da0e05af9',
    name: 'ukhq',
  },
]

export const EMPLOYEE_RANGE = [
  {
    id: '3dafd8d0-5d95-e211-a939-e4115bead28a',
    name: '1 to 9',
  },
  {
    id: '3eafd8d0-5d95-e211-a939-e4115bead28a',
    name: '10 to 49',
  },
  {
    id: '3fafd8d0-5d95-e211-a939-e4115bead28a',
    name: '50 to 249',
  },
  {
    id: '40afd8d0-5d95-e211-a939-e4115bead28a',
    name: '250 to 499',
  },
  {
    id: '41afd8d0-5d95-e211-a939-e4115bead28a',
    name: '500+',
  },
]

export const ONE_LIST_TIER = [
  {
    id: 'b91bf800-8d53-e311-aef3-441ea13961e2',
    name: 'Tier A - Strategic Account',
  },
  {
    id: '7e0c261a-d447-e411-985c-e4115bead28a',
    name: 'Tier A2 - Global Partners',
  },
  {
    id: 'bb1bf800-8d53-e311-aef3-441ea13961e2',
    name: 'Tier B - Global Accounts',
  },
  {
    id: '23ef2218-37f7-4abf-aacb-7c49f65ee1e3',
    name: 'Tier B - Global Accounts (Capital Investment)',
  },
  {
    id: 'bd1bf800-8d53-e311-aef3-441ea13961e2',
    name: 'Tier C - Local Accounts (UKTI Managed)',
  },
  {
    id: '12798372-8eb4-e511-88b6-e4115bead28a',
    name: 'Tier D - LEP Managed Branch (not IST)',
  },
  {
    id: '572dfefe-cd1d-e611-9bdc-e4115bead28a',
    name: 'Tier D - POST Identified/Managed',
  },
]
