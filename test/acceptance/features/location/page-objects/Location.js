const { getSelectorForElementWithText } = require('../../../helpers/selectors')

const getDetailsTabSelector = (text) => getSelectorForElementWithText(text,
  {
    el: '//a',
    className: 'c-local-nav__link',
  }
)

module.exports = {
  url: process.env.QA_HOST,
  sections: {
    localHeader: {
      selector: '.c-local-header',
      elements: {
        header: '.c-local-header__heading',
      },
    },
    detailsTabs: {
      selector: '.c-local-nav',
      elements: {
        details: getDetailsTabSelector('Details'),
        contacts: getDetailsTabSelector('Contacts'),
        interactions: getDetailsTabSelector('Interactions'),
        export: getDetailsTabSelector('Export'),
        investment: getDetailsTabSelector('Investment'),
        auditHistory: getDetailsTabSelector('Audit history'),
        documents: getDetailsTabSelector('Documents'),
      },
    },
  },
}
