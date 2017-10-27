const { getSelectorForElementWithText } = require('../../../helpers/selectors')

const getMetaListItemValueSelector = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//span',
    className: 'c-meta-list__item-label',
    child: '/following-sibling::span',
  }
)

module.exports = {
  url: `${process.env.QA_HOST}/contacts`,
  elements: {
    contactsTab: 'a[href*="/search/contacts"]',
    contactFromFirstList: '.c-entity-list li:first-child .c-entity__title a',
    companyFromFirstList: '.c-entity-list li:first-child .c-entity__content .c-meta-list__item:nth-child(1) span:nth-child(2)',
    countryFromFirstList: '.c-entity-list li:first-child .c-entity__badges span:nth-child(2)',
    createdDateFromFirstList: '.c-entity-list li:first-child .c-entity__content .c-meta-list__item:nth-child(2) span:nth-child(2)',
    sectorFromFirstList: '.c-entity-list li:first-child .c-entity__content .c-meta-list__item:nth-child(3) span:nth-child(2)',
    contactFullNameFromDetailsPage: '.c-local-header__heading',
    primaryFromFirstList: 'a',
    contactsBreadcrumb: '[href="/contacts"]',
    filterSector: '#field-company_sector',
    filterSectorList: '#field-company_sector option:nth-child(2)',
    sectorFromList: '.c-entity-list__item:first-child .c-meta-list__item:nth-child(3) span:nth-child(2)',
    filterCountry: '#field-address_country',
    filterCountryList: '#field-address_country option:nth-child(238)',
    filterRegion: '#field-company_uk_region',
    filterRegionList: '#field-company_uk_region option:nth-child(7)',
    countryFromList: '.c-entity-list__item:first-child .c-meta-list__item:nth-child(1) .c-badge',
    filterCompany: '#field-company_name',
    companyFromList: '.c-entity-list__item:first-child .c-meta-list__item:nth-child(1) .c-meta-list__item-value',
    companyFromSecondList: '.c-entity-list__item:nth-child(2) .c-meta-list__item:nth-child(1) .c-meta-list__item-value',
    companyFromThirdList: '.c-entity-list__item:nth-child(3) .c-meta-list__item:nth-child(1) .c-meta-list__item-value',
  },
  sections: {
    firstContactInList: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },
        company: getMetaListItemValueSelector('Company'),
        sector: getMetaListItemValueSelector('Sector'),
        updated: getMetaListItemValueSelector('Updated'),
      },
    },
  },
}
