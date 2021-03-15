import { BLUE, WHITE } from 'govuk-colours'

export const DASHBOARD_THEME = {
  dashboard: {
    tabNav: {
      selectedButton: {
        color: WHITE,
        background: BLUE,
        fontWeight: 'bold',
        border: `2px solid ${BLUE}`,
      },
      tabPanel: {
        border: `2px solid ${BLUE}`,
        padding: '15px 15px 0 15px',
        marginBottom: '30px',
      },
    },
  },
}
