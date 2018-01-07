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
      commands: [
        {
          getHeaderMetaValueSelector (text) {
            return getSelectorForElementWithText(text,
              {
                el: '//span',
                className: 'c-meta-list__item-label',
                child: '/following-sibling::span',
              }
            )
          },
        },
      ],
      elements: {
        header: '.c-local-header__heading',
        headerLink: '.c-local-header__heading-before a',
      },
    },
    localNav: {
      selector: '.c-local-nav',
      commands: [
        {
          getLocalNavLinkSelector (text) {
            return getSelectorForElementWithText(text,
              {
                el: '//a',
                className: 'c-local-nav__link',
              }
            )
          },
        },
      ],
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
    globalNav: {
      selector: '.c-global-nav',
      commands: [
        {
          getGlobalNavLinkSelector (text) {
            return getSelectorForElementWithText(text,
              {
                el: '//a',
                className: 'c-global-nav__link',
              }
            )
          },
        },
      ],
    },
  },
}
