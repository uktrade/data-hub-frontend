module.exports = {
  name: '#field-name',
  statusActive: '[for="field-archived-1"]',
  statusInactive: '[for="field-archived-2"]',
  firstUkRegion: '[for="field-uk_region-1"]',
  country: '#group-field-country',
  sector: '#group-field-sector_descends',
  contacts: {
    sector: '#group-field-company_sector_descends',
    companyName: '#field-company_name',
    country: '#group-field-address_country',
    firstUkRegion: '[for="field-company_uk_region-1"]',
  },
  investments: {
    companyName: '#group-field-sector_descends',
    country: '#group-field-investor_company_country',
    firstUkRegion: '[for="field-uk_region_location-1"]',
    sector: '#group-field-sector_descends',
  },
  omis: {
    country: '#group-field-primary_market',
    firstUkRegion: '[for="field-uk_region-1"]',
    sector: '#group-field-sector_descends',
  },
  events: {
    country: '#group-field-address_country',
  },
  typeahead (id) {
    return {
      fieldset: id,
      placeHolder: `${id} .multiselect__tags`,
      textInput: `${id} .multiselect__input`,
      selectedOption: `${id} .multiselect__single`,
      addAnotherBtn: `${id} .js-AddItems__add--typeahead`,
      firstOption: `${id} .multiselect__element:nth-child(1)`,
      options: `${id} .multiselect__element`,
    }
  },
}
