import { BLUE, WHITE } from 'govuk-colours'

export default {
  tabNav: {
    button: {
      textDecoration: 'underline',
    },
    selectedButton: {
      color: WHITE,
      background: BLUE,
      fontWeight: 'bold',
      border: `2px solid ${BLUE}`,
    },
    tabList: {
      borderBottom: 0,
    },
    tabPanel: {
      border: `2px solid ${BLUE}`,
      padding: '15px 15px 0 15px',
      marginBottom: '30px',
    },
  },
}
