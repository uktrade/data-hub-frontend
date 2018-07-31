const { getSelectorForElementWithText } = require('../helpers/selectors')

module.exports = {
  elements: {
    heading: '.c-local-header__heading',
    contentHeading: '.heading-medium',
    localNav: '.c-local-nav',
    documentsLink: {
      selector: '//a[contains(.,"View files and documents")][contains(@aria-labelledby,"external-link-label")]',
      locateStrategy: 'xpath',
    },
    noDocumentsMessage: getSelectorForElementWithText('There are no files or documents', { el: '//article//p' }),
  },
  commands: [
    {
      getDetailFor (label) {
        return getSelectorForElementWithText(label, { el: '//th', child: '/following-sibling::td' })
      },
      getLocalNavItemSelector (text) {
        return getSelectorForElementWithText(
          text,
          {
            el: '//a',
            className: 'c-local-nav__link',
          },
        )
      },
      getSelectorForDetailsTable (title) {
        if (!title) {
          return {
            selector: '//table[contains(@class, "table--key-value")][1]',
            locateStrategy: 'xpath',
          }
        }

        return getSelectorForElementWithText(title, {
          el: '//h2',
          child: '/following-sibling::table[1]',
        })
      },
    },
  ],
}
