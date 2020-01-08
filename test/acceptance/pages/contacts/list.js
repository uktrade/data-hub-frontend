const {
  getSelectorForElementWithText,
  getMetaListItemValueSelector,
} = require('../../helpers/selectors')

const getFilterTagRemoveBtnSelector = (text) =>
  getSelectorForElementWithText(text, {
    el: '//span',
    className: 'c-collection__filter-label',
    child: '/following-sibling::a',
  })

module.exports = {
  url: `${process.env.QA_HOST}/contacts`,
  elements: {
    contactsTab: 'a[href*="/search/contacts"]',
  },
  sections: {
    filterTags: {
      selector: '.c-collection__filter-summary',
      elements: {
        contact: getFilterTagRemoveBtnSelector('Contact name'),
        company: getFilterTagRemoveBtnSelector('Company name'),
        sector: getFilterTagRemoveBtnSelector('Sectors'),
        country: getFilterTagRemoveBtnSelector('Country'),
        ukRegion: getFilterTagRemoveBtnSelector('UK Region'),
        status: getFilterTagRemoveBtnSelector('Status'),
      },
    },
    firstContactInList: {
      selector: '.c-entity-list li:nth-child(1)',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },

        companyName: getMetaListItemValueSelector('Company'),
        companySector: getMetaListItemValueSelector('Sector'),
        countryBadge: getMetaListItemValueSelector('Country'),
      },
    },
    secondContactInList: {
      selector: '.c-entity-list li:nth-child(2)',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },

        companyName: getMetaListItemValueSelector('Company'),
        companySector: getMetaListItemValueSelector('Sector'),
        countryBadge: getMetaListItemValueSelector('Country'),
      },
    },
    filters: {
      selector: '.c-collection-filters',
      elements: {
        contact: '#field-name',
        company: '#field-company_name',
        sector: '[name="company_sector"]',
        country: '[name="address_country"]',
        ukRegion: '[name="company_uk_region"]',
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
