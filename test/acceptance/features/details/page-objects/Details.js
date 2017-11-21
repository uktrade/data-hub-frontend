const { getSelectorForElementWithText } = require('../../../helpers/selectors')

module.exports = {
  elements: {
    heading: '.c-local-header__heading',
  },
  commands: [
    {
      getDetailFor (label) {
        return getSelectorForElementWithText(label, { el: '//th', child: '/following-sibling::td' })
      },
      getDetailsTabSelector (text) {
        return getSelectorForElementWithText(
          text,
          {
            el: '//a',
            className: 'c-local-nav__link',
          },
        )
      },
    },
  ],
}
