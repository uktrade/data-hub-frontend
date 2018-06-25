const { assign } = require('lodash')

const { accountManagementDisplayLabels } = require('../labels')
const { transformObjectToOption } = require('../../transformers')

const accountManagementFormConfig = function ({
  returnLink,
  advisers = [],
}) {
  return {
    returnLink,
    buttonText: 'Save and return',
    returnText: 'Return without saving',
    children: [
      {
        macroName: 'MultipleChoiceField',
        name: 'one_list_account_owner',
        initialOption: '-- Select account manager --',
        optional: true,
        options () {
          return advisers.map(transformObjectToOption)
        },
      },
    ].map(field => {
      return assign(field, {
        label: accountManagementDisplayLabels[field.name],
      })
    }),
  }
}

module.exports = accountManagementFormConfig
