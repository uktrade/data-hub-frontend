export const STAGE_OPTIONS = [
  {
    name: 'All stages',
    id: 'all-stages',
  },
  {
    name: 'Prospect',
    id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
  },
  {
    name: 'Assign PM',
    id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
  },
  {
    name: 'Active',
    id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
  },
  {
    name: 'Verify win',
    id: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
  },
  {
    name: 'Won',
    id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
  },
]

export const SORT_OPTIONS = [
  {
    name: 'Most recently created',
    value: 'created_on:desc',
  },
  {
    name: 'Earliest land date',
    value: 'estimated_land_date:asc',
  },
  {
    name: 'Latest land date',
    value: 'estimated_land_date:desc',
  },
  {
    name: 'Project name (A-Z)',
    value: 'name:asc',
  },
  {
    name: 'Project name (Z-A)',
    value: 'name:desc',
  },
]
