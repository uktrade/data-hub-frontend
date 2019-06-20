const msgCls = '.c-form-group__error-message'

module.exports = {
  addContact: '.c-form-actions .govuk-button',
  validationHeader: '.c-error-summary__heading',
  validationFieldMsg: {
    name: `[for="field-first_name"] ${msgCls}`,
    surname: `[for="field-last_name"] ${msgCls}`,
    primaryContact: `#group-field-primary ${msgCls}`,
    countryCode: `[for="field-telephone_countrycode"] ${msgCls}`,
    phone: `#group-field-telephone_number > label > ${msgCls}`,
    email: `#group-field-email > label > ${msgCls}`,
  },
  validationSummary: (index) => { return `.c-error-summary__list li:nth-child(${index + 1})` },
}
