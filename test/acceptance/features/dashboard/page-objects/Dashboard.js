const { getSelectorForElementWithText, getLinkWithText } = require('../../../helpers/selectors')

const getGlobalNavAnchorWithText = (text) => getLinkWithText(text, 'c-global-nav__link')
const getGlobalHeaderAnchorWithText = (text) => getLinkWithText(text, 'proposition-menu__link')

const getDashboardSectionItem = (text, itemNumber) => getSelectorForElementWithText(
  text,
  {
    el: '//h2',
    child: `/following-sibling::ol/li[${itemNumber}]`,
  }
)

module.exports = {
  url: process.env.QA_HOST,
  props: {},
  elements: {
    pageHeading: 'h1.c-local-header__heading',
    term: '#field-term',
    firstMyLatestContact: getDashboardSectionItem('My latest contacts', 1),
  },
  sections: {
    globalHeader: {
      selector: '.global-header',
      elements: {
        support: getGlobalHeaderAnchorWithText('Support'),
      },
    },
    globalNav: {
      selector: '.c-global-nav__container',
      elements: {
        companies: getGlobalNavAnchorWithText('Companies'),
        contacts: getGlobalNavAnchorWithText('Contacts'),
        events: getGlobalNavAnchorWithText('Events'),
        interactionsAndServices: getGlobalNavAnchorWithText('Interactions and services'),
        investmentProjects: getGlobalNavAnchorWithText('Investment projects'),
        ordersOmis: getGlobalNavAnchorWithText('Orders (OMIS)'),
        miDashboards: getGlobalNavAnchorWithText('MI dashboards'),
      },
    },
  },
}
