const msgCls = '.c-form-group__error-message'

module.exports = {
  add: '[data-test="Add contact"]',
  addContact: '.c-form-actions .govuk-button',
  name: '#field-first_name',
  lastName: '#field-last_name',
  jobTitle: '#field-job_title',
  primaryContactYes: '[for="field-primary-1"]',
  countryCode: '#field-telephone_countrycode',
  phone: '#field-telephone_number',
  email: '#field-email',
  sameCompanyAddressYes: '[for="field-address_same_as_company-1"]',
  sameCompanyAddressNo: '[for="field-address_same_as_company-2"]',
  postCodeLookupAddress1: '#field-address_1',
  postCodeLookupAddress2: '#field-address_2',
  postCodeLookupTown: '#field-address_town',
  postCodeLookupCountry: '#field-address_country',
  save: 'div.c-form-actions > button.govuk-button',
  details: '.c-details-container__content',
  validationHeader: '.c-error-summary__heading',
  validationFieldMsg: {
    name: `[for="field-first_name"] ${msgCls}`,
    surname: `[for="field-last_name"] ${msgCls}`,
    primaryContact: `#group-field-primary ${msgCls}`,
    countryCode: `[for="field-telephone_countrycode"] ${msgCls}`,
    phone: `#group-field-telephone_number > label > ${msgCls}`,
    email: `#group-field-email > label > ${msgCls}`,
  },
  validationSummary: (index) => {
    return `.c-error-summary__list li:nth-child(${index + 1})`
  },
}
