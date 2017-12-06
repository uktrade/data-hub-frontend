const { getSelectorForElementWithText } = require('../../../helpers/selectors')

module.exports = {
  elements: {
    heading: '.c-local-header__heading',
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
      getSelectorForDetailsTableWithTitle (title) {
        return getSelectorForElementWithText(title, {
          el: '//h2',
          child: '/../table',
        })
      },
    },
  ],
}
