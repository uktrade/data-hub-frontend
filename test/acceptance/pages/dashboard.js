const {
  getSelectorForElementWithText,
  getLinkWithText,
} = require('../helpers/selectors')

const getGlobalNavAnchorWithText = (text) =>
  getLinkWithText(text, 'datahub-header__navigation__item__link')
const getGlobalHeaderAnchorWithText = (text) =>
  getLinkWithText(text, 'datahub-header__links__item')

module.exports = {
  url: process.env.QA_HOST,
  props: {},
  elements: {
    pageHeading: 'h2.dashboard-section-title',
    term: '#field-term',
    firstMyLatestContact:
      '#main-content > div > div > div > div.govuk-grid-column-two-thirds > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > a',
  },
  sections: {
    globalHeader: {
      selector: '.datahub-header',
      elements: {
        serviceName: '.datahub-header__logo__text',
        support: getGlobalHeaderAnchorWithText('Support'),
      },
    },
    globalNav: {
      selector: '.datahub-header__navigation',
      elements: {
        companies: getGlobalNavAnchorWithText('Companies'),
        contacts: getGlobalNavAnchorWithText('Contacts'),
        events: getGlobalNavAnchorWithText('Events'),
        interactionsAndServices: getGlobalNavAnchorWithText('Interactions'),
        investmentProjects: getGlobalNavAnchorWithText('Investments'),
        ordersOmis: getGlobalNavAnchorWithText('Orders'),
        miDashboards: getGlobalNavAnchorWithText('MI dashboards'),
        findExporters: getGlobalNavAnchorWithText('Find exporters'),
      },
    },
  },
  commands: [
    {
      getGlobalNavItemSelector(text) {
        return getSelectorForElementWithText(text, {
          el: '//a',
          className: 'datahub-header__navigation__item__link',
        })
      },
    },
  ],
}
