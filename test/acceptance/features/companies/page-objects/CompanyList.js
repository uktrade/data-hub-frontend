const { getSelectorForElementWithText, getButtonWithText } = require('../../../helpers/selectors')

const getMetaListItemValueSelector = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//span',
    className: 'c-meta-list__item-label',
    child: '/following-sibling::span',
  }
)

const getBadgeWithText = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//span',
    className: 'c-meta-list__item-label',
    child: '/following-sibling::span',
  },
)

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
        companySector: getMetaListItemValueSelector('Sector'),
        countryBadge: getBadgeWithText('Country'),
        ukRegionBadge: getBadgeWithText('UK region'),
      },
    },
    filters: {
      selector: '.c-collection-filters',
      elements: {
        company: '#field-name',
        sector: '#field-sector',
        country: '#field-trading_address_country',
        ukRegion: '#field-uk_region',
      },
    },
    collectionHeader: {
      selector: '.c-collection__header',
      elements: {
        sortBy: '#field-sortby',
      },
    },
  },
}
