const { getSelectorForElementWithText } = require('../../../helpers/selectors')

module.exports = {
  props: {},
  elements: {
    heading: 'h1',
  },
  commands: [
    {
      getXPathSelectorForEntityMetaListItem (headerText, label) {
        const entitySelector = getSelectorForElementWithText(
          headerText,
          {
            el: '//h3',
            className: 'c-entity__title',
            child: '/../..',
          }
        )

        const metaListItemSelector = getSelectorForElementWithText(
          label,
          {
            el: '//span',
            className: 'c-meta-list__item-label',
            child: '/following-sibling::span',
          }
        )

        return entitySelector.selector + metaListItemSelector.selector
      },
      getXPathSelectorForEntityBadgeWithText (headerText, text) {
        const entitySelector = getSelectorForElementWithText(
          headerText,
          {
            el: '//h3',
            className: 'c-entity__title',
            child: '/../..',
          }
        )

        const badgeSelector = getSelectorForElementWithText(
          text,
          {
            el: '//span',
            className: 'c-meta-list__item-label',
            child: '/following-sibling::span',
          },
        )

        return entitySelector.selector + badgeSelector.selector
      },
    },
  ],
}
