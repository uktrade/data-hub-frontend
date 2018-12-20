const { getSelectorForElementWithText } = require('../helpers/selectors')

const getDetailsTabSelector = (text) => getSelectorForElementWithText(text,
  {
    el: '//a',
    className: 'c-local-nav__link',
  }
)

module.exports = {
  url: process.env.QA_HOST,
  elements: {
    subHeading: '.heading-medium',
  },
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
          getSelectorForHeaderDescriptionParagraph (text) {
            return getSelectorForElementWithText(text,
              {
                el: '//div',
                className: 'c-local-header__description',
                child: '/p',
              }
            )
          },
        },
      ],
      elements: {
        header: '.c-local-header__heading',
        headerLink: '.c-local-header__heading-before a',
        headerAfter: '.c-local-header__heading-after',
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
          getBadge (text) {
            return getSelectorForElementWithText(text,
              {
                el: '//span',
                className: 'c-badge',
              }
            )
          },
        },
      ],
      elements: {
        details: getDetailsTabSelector('Details'),
        contacts: getDetailsTabSelector('Contacts'),
        interactions: getDetailsTabSelector('Interactions'),
        propositions: getDetailsTabSelector('Propositions'),
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
  commands: [
    {
      getHeading (el, text) {
        return getSelectorForElementWithText(text, { el })
      },
    },
  ],
}
