const {
  getSelectorForElementWithText,
  getButtonWithText,
  getListItemMetaElementWithText,
} = require('../../helpers/selectors')

const getBadgeWithText = (text) =>
  getSelectorForElementWithText(text, {
    el: '//span',
    className: 'c-meta-list__item-label',
    child: '/following-sibling::span',
  })
const getFirstListItemMetaElementWithText = (text) =>
  getListItemMetaElementWithText(text)
const getSecondListItemMetaElementWithText = (text) =>
  getListItemMetaElementWithText(text, 2)

module.exports = {
  url: `${process.env.QA_HOST}/companies`,
  props: {},
  elements: {
    h1Element: '.c-local-header__heading',
    addCompanyButton: getButtonWithText('Add company'),
  },
  sections: {
    firstCompanyInList: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },
        companySector: getFirstListItemMetaElementWithText('Sector'),
        updated: getFirstListItemMetaElementWithText('Updated'),
        countryBadge: getBadgeWithText('Country'),
        ukRegionBadge: getBadgeWithText('UK region'),
      },
    },
    secondCompanyInList: {
      selector: '.c-entity-list li:nth-child(2)',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },
        companySector: getSecondListItemMetaElementWithText('Sector'),
        updated: getSecondListItemMetaElementWithText('Updated'),
        countryBadge: getBadgeWithText('Country'),
        ukRegionBadge: getBadgeWithText('UK region'),
      },
    },
    filters: {
      selector: '.c-collection-filters',
      elements: {
        company: '#field-name',
        sector: '[name="sector"]',
        country: '[name="country"]',
        ukRegion: '[name="uk_region"]',
        active: 'label[for=field-archived-1]',
        inactive: 'label[for=field-archived-2]',
      },
    },
    collectionHeader: {
      selector: '.c-collection__header',
      elements: {
        sortBy: '#field-sortby',
        download: '.c-collection__header-actions a[download]',
      },
    },
  },
}
