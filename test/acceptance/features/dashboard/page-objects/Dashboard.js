const { getSelectorForElementWithText } = require('../../../helpers/selectors')

const getGlobalNavSelector = (text) =>
  getSelectorForElementWithText(
    text,
    {
      el: '//a',
      className: 'c-global-nav__link',
    }
  )

module.exports = {
  url: process.env.QA_HOST,
  props: {},
  elements: {
    term: '#field-term',
  },
  sections: {
    globalNav: {
      selector: '.c-global-nav__container',
      elements: {
        companies: getGlobalNavSelector('Companies'),
        contacts: getGlobalNavSelector('Contacts'),
        events: getGlobalNavSelector('Events'),
        interactions: getGlobalNavSelector('Interactions'),
        investmentProjects: getGlobalNavSelector('Investment projects'),
        ordersOmis: getGlobalNavSelector('Orders (OMIS)'),
        performanceDashboards: getGlobalNavSelector('Performance dashboards'),
      },
    },
  },
}
