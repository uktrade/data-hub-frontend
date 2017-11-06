const { lowerCase } = require('lodash')

const { getSelectorForElementWithText } = require('../../../helpers/selectors')

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
            className: 'c-badge',
          }
        )
      },
      getSelectorForFilterWithTypeAndText (text, type) {
        return getSelectorForElementWithText(
          text,
          {
            el: '//span',
            className: 'c-form-group__label-text',
            child: `/../..//${type}`,
          }
        )
      },
      getSortByOptionSelectorWithText (text) {
        return {
          selector: `//select[@id="field-sortby"]/option[normalize-space(.)="${text}"]`,
          locateStrategy: 'xpath',
        }
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
        addLink: '.c-collection__header-actions > a.button',
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
