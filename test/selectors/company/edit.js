module.exports = {
  form: 'form',
  website: 'input[name="website"]',
  address: {
    postcode: 'input[name="postcode"]',
    areaUS: 'select#area',
    areaCanada: 'select#areaCanada',
  },
  globalHqHierarchy:
    '#field-headquarter_type > fieldset > div > label:nth-child(5)',
  notHqHierarchy:
    '#field-headquarter_type > fieldset > div > label:nth-child(2)',
  saveButton: 'button:contains("Submit")',
}
