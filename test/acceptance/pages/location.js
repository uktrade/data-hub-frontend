const { getSelectorForElementWithText } = require('../helpers/selectors')

const getDetailsTabSelector = (text) =>
  getSelectorForElementWithText(text, {
    el: '//a',
    className: 'c-local-nav__link',
  })

module.exports = {
  url: process.env.QA_HOST,
  elements: {
    subHeading: '.govuk-heading-m',
  },
  sections: {
    localHeader: {
      selector: '.c-local-header',
      commands: [
        {
          getHeaderMetaValueSelector(text) {
            return getSelectorForElementWithText(text, {
              el: '//span',
              className: 'c-meta-list__item-label',
              child: '/following-sibling::span',
            })
          },
          getSelectorForHeaderDescriptionParagraph(text) {
            return getSelectorForElementWithText(text, {
              el: '//div',
              className: 'c-local-header__description',
              child: '/p',
            })
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
          getLocalNavLinkSelector(text, className = 'c-local-nav__link') {
            return getSelectorForElementWithText(text, {
              className,
              el: '//a',
            })
          },
          getBadge(text) {
            return getSelectorForElementWithText(text, {
              el: '//span',
              className: 'c-badge',
            })
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
      selector: '.datahub-header__navigation',
      commands: [
        {
          getGlobalNavLinkSelector(text) {
            return getSelectorForElementWithText(text, {
              el: '//a',
              className: 'datahub-header__navigation__item__link',
            })
          },
        },
      ],
    },
  },
  commands: [
    {
      getHeading(el, text) {
        return getSelectorForElementWithText(text, { el })
      },
    },
  ],
}
