const registeredAddressFieldsetSelector = '[data-auto-id="registeredAddress"]'

module.exports = {
  tradingName: '#field-trading_names',
  vatNumber: '#field-vat_number',
  annualTurnover: [
    '#field-turnover_range-1',
    '#field-turnover_range-2',
    '#field-turnover_range-3',
    '#field-turnover_range-4',
  ],
  numberOfEmployees: [
    '#field-employee_range-1',
    '#field-employee_range-2',
    '#field-employee_range-3',
    '#field-employee_range-4',
    '#field-employee_range-5',
  ],
  website: '#field-website',
  businessDescription: '#field-description',
  address: {
    postcodeLookup: '#field-trading_address_pcode_lookup',
    line1: '#field-address_1',
    line2: '#field-address_2',
    town: '#field-address_town',
    county: '#field-address_county',
    postcode: '#field-address_postcode',
    country: '#field-address_country',
  },
  registeredAddress: {
    fieldset: {
      selector: registeredAddressFieldsetSelector,
      listItem: (number) => `${registeredAddressFieldsetSelector} ul li:nth-child(${number})`,
    },
  },
  region: '#field-uk_region',
  sector: '#field-sector',
  needToEditTheSector: '[data-auto-id="needToEditTheSector"]',
  businessHierarchy: [
    '#field-headquarter_type-1',
    '#field-headquarter_type-2',
    '#field-headquarter_type-3',
    '#field-headquarter_type-4',
  ],
  needToEditTheHeadquarterType: '[data-auto-id="needToEditTheHeadquarterType"]',
  saveButton: '.c-form-actions button',
  backLink: '.c-form-actions a',
}
