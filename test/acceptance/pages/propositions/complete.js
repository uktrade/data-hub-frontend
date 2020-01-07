const faker = require('faker')
const { assign, forEach, keys } = require('lodash')

const { getButtonWithText } = require('../../helpers/selectors')

module.exports = {
  props: {},
  elements: {
    completeButton: getButtonWithText('Complete proposition'),
    details: '#field-details',
  },
  commands: [
    {
      completeProposition(callback) {
        const proposition = assign(
          {},
          {
            details: faker.lorem.sentence(),
          }
        )
        this.waitForElementVisible('@completeButton').api.perform(() => {
          forEach(keys(proposition), (key) => {
            this.replaceValue(`@${key}`, proposition[key])
          })
          proposition.heading = proposition.name
        })
        return this.click('@completeButton', () => {
          callback(proposition)
        })
      },
    },
  ],
}
