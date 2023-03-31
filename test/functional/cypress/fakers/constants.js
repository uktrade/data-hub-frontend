export const INVESTMENT_PROJECT_STAGES = {
  prospect: {
    id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
    name: 'Prospect',
  },
  assignPm: {
    id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
    name: 'Assign PM',
  },
  active: {
    id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
    name: 'Active',
  },
  verifyWin: {
    id: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
    name: 'Verify win',
  },
  won: {
    id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
    name: 'Won',
  },
}

export const INVESTMENT_PROJECT_STAGES_LIST = Object.values(
  INVESTMENT_PROJECT_STAGES
)

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
