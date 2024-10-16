const exportWin = {
  id: '111',
  company: {
    id: '222',
    name: 'Foo Ltd',
  },
  name_of_export: 'Rolls Reese',
  company_contacts: [
    {
      name: 'David Test',
      id: '333',
    },
  ],
  country: {
    name: 'USA',
  },
  date: '2023-05-01',
  customer_response: {
    responded_on: '2024-04-18T12:15:49.361611Z',
  },
  total_expected_export_value: 1000,
  total_expected_non_export_value: 2000,
  total_expected_odi_value: 3000,
}

export const exportWinsListData = [
  // The lead_officer id doesn't match the currentAdviserId
  {
    exportWinsList: [
      {
        ...exportWin,
        lead_officer: {
          id: '2',
        },
      },
    ],
    currentAdviserId: '1',
    shouldRenderTag: false,
  },
  {
    // The lead_officer id matches the currentAdviserId
    exportWinsList: [
      {
        ...exportWin,
        lead_officer: {
          id: '1',
        },
      },
    ],
    currentAdviserId: '1',
    shouldRenderTag: true,
    role: 'Role: lead officer',
  },
  // The team_members array doesn't include the currentAdviserId
  {
    exportWinsList: [
      {
        ...exportWin,
        team_members: [
          {
            id: '1',
          },
          {
            id: '2',
          },
          {
            id: '3',
          },
        ],
      },
    ],
    currentAdviserId: '4',
    shouldRenderTag: false,
  },
  {
    // The team_members array includes the currentAdviserId
    exportWinsList: [
      {
        ...exportWin,
        team_members: [
          {
            id: '1',
          },
          {
            id: '2',
          },
          {
            id: '3',
          },
        ],
      },
    ],
    currentAdviserId: '1',
    shouldRenderTag: true,
    role: 'Role: team member',
  },
  // The contributing_advisers array doesn't include the currentAdviserId
  {
    exportWinsList: [
      {
        ...exportWin,
        contributing_advisers: [
          {
            adviser: {
              id: '1',
            },
          },
          {
            adviser: {
              id: '2',
            },
          },
          {
            adviser: {
              id: '3',
            },
          },
        ],
      },
    ],
    currentAdviserId: '4',
    shouldRenderTag: false,
  },
  {
    // The contributing_advisers array includes the currentAdviserId
    exportWinsList: [
      {
        ...exportWin,
        contributing_advisers: [
          {
            adviser: {
              id: '1',
            },
          },
          {
            adviser: {
              id: '2',
            },
          },
          {
            adviser: {
              id: '3',
            },
          },
        ],
      },
    ],
    currentAdviserId: '1',
    shouldRenderTag: true,
    role: 'Role: contributing officer',
  },
]
