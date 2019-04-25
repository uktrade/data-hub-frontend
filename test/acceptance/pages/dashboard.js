const { getSelectorForElementWithText, getLinkWithText } = require('../helpers/selectors')

const getGlobalNavAnchorWithText = (text) => getLinkWithText(text, 'global-nav__link')
const getGlobalHeaderAnchorWithText = (text) => getLinkWithText(text, 'proposition-menu__link')

module.exports = {
  url: process.env.QA_HOST,
  props: {},
  elements: {
    pageHeading: 'h2.dashboard-section-title',
    term: '#field-term',
    firstMyLatestContact: '#main-content > div > div > div > div.govuk-grid-column-two-thirds > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > a',
  },
  sections: {
    globalHeader: {
      selector: '.global-header',
      elements: {
        serviceName: '.global-header__service-name',
        support: getGlobalHeaderAnchorWithText('Support'),
      },
    },
    globalNav: {
      selector: '.c-global-nav__container',
      elements: {
        companies: getGlobalNavAnchorWithText('Companies'),
        contacts: getGlobalNavAnchorWithText('Contacts'),
        events: getGlobalNavAnchorWithText('Events'),
        interactionsAndServices: getGlobalNavAnchorWithText('Interactions'),
        investmentProjects: getGlobalNavAnchorWithText('Investments'),
        ordersOmis: getGlobalNavAnchorWithText('Orders (OMIS)'),
        miDashboards: getGlobalNavAnchorWithText('MI dashboards'),
        findExporters: getGlobalNavAnchorWithText('Find exporters'),
      },
    },
  },
  commands: [
    {
      getGlobalNavItemSelector (text) {
        return getSelectorForElementWithText(
          text,
          {
            el: '//a',
            className: 'global-nav__link',
          },
        )
      },
    },
  ],
}
