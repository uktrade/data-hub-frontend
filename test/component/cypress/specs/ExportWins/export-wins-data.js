import { exportWinsFaker } from '../../../../functional/cypress/fakers/export-wins'

export const exportWinsData = [
  // The lead_officer id doesn't match the currentAdviserId
  {
    exportWins: [
      {
        ...exportWinsFaker(),
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
    exportWins: [
      {
        ...exportWinsFaker(),
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
    exportWins: [
      {
        ...exportWinsFaker(),
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
    exportWins: [
      {
        ...exportWinsFaker(),
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
    exportWins: [
      {
        ...exportWinsFaker(),
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
    exportWins: [
      {
        ...exportWinsFaker(),
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
