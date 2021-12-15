module.exports = {
  listA: {
    legend: `#add-remove-list-form [data-test="company-0"] > div > fieldset > legend`,
    radios:
      '#add-remove-list-form [data-test="company-0"] > div > fieldset > div input',
    radioYes:
      '#add-remove-list-form [data-test="company-0"] > div > fieldset > div input[value="yes"]',
    radioNo:
      '#add-remove-list-form [data-test="company-0"] > div > fieldset > div input[value="no"]',
    labelYes:
      '#add-remove-list-form [data-test="company-0"] > div > fieldset > div > label:nth-child(2)',
    labelNo:
      '#add-remove-list-form [data-test="company-0"] > div > fieldset > div > label:nth-child(3)',
  },
  listB: {
    legend: `#add-remove-list-form [data-test="company-1"] > div > fieldset > legend`,
    radios:
      '#add-remove-list-form [data-test="company-1"] > div > fieldset > div input',
    radioYes:
      '#add-remove-list-form [data-test="company-1"] > div > fieldset > div input[value="yes"]',
    radioNo:
      '#add-remove-list-form [data-test="company-1"] > div > fieldset > div input[value="no"]',
    labelYes:
      '#add-remove-list-form [data-test="company-1"] > div > fieldset > div > label:nth-child(2)',
    labelNo:
      '#add-remove-list-form [data-test="company-1"] > div > fieldset > div > label:nth-child(3)',
  },
  listC: {
    legend: `#add-remove-list-form [data-test="company-2"] > div > fieldset > legend`,
    radios:
      '#add-remove-list-form [data-test="company-2"] > div > fieldset > div input',
    radioYes:
      '#add-remove-list-form [data-test="company-2"] > div > fieldset > div input[value="yes"]',
    radioNo:
      '#add-remove-list-form [data-test="company-2"] > div > fieldset > div input[value="no"]',
    labelYes:
      '#add-remove-list-form [data-test="company-2"] > div > fieldset > div > label:nth-child(2)',
    labelNo:
      '#add-remove-list-form [data-test="company-2"] > div > fieldset > div > label:nth-child(3)',
  },
  createButton: '#add-remove-list-form [data-test="create-list-button"]',
  saveButton: '#add-remove-list-form [data-test="submit-button"]',
  cancelLink: '#add-remove-list-form [data-test="cancel-button"]',
}
