const { lowerCase } = require('lodash')

const { getSelectorForElementWithText, getButtonWithText } = require('../../../helpers/selectors')

module.exports = {
  elements: {
    pagination: '.c-pagination',
  },
  commands: [
    {
      getSelectorForResultsCountHeader (collectionType) {
        return getSelectorForElementWithText(
          lowerCase(collectionType),
          {
            el: '//div',
            className: 'c-collection__header-intro',
          }
        )
      },
      getSelectorForMetaListItem (label) {
        return getSelectorForElementWithText(
          label,
          {
            el: '//span',
            className: 'c-meta-list__item-label',
            child: '/following-sibling::span',
          }
        )
      },
      getSelectorForBadgeWithText (text) {
        return getSelectorForElementWithText(
          text,
          {
            el: '//span',
            className: 'c-meta-list__item-label',
            child: '/following-sibling::span',
          },
        )
      },
      getButtonSelectorWithText (text) {
        return getButtonWithText(text)
      },
    },
  ],
  sections: {
    localHeader: {
      selector: '.c-local-header',
      elements: {
        header: 'h1.c-local-header__heading',
      },
    },
    collectionHeader: {
      selector: '.c-collection__header',
      elements: {
        paginationSummary: '.c-collection__pagination-summary',
      },
    },
    firstCollectionItem: {
      selector: '.c-collection > .c-entity-list li:first-child',
      elements: {
        header: '.c-entity__title',
      },
    },
    filters: {
      selector: '.c-collection-filters',
    },
  },
}
