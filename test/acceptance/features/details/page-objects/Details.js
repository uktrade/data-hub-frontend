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
    },
  ],
}
