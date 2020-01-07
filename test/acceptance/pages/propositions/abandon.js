const faker = require('faker')
const { assign, forEach, keys } = require('lodash')

const { getButtonWithText } = require('../../helpers/selectors')

module.exports = {
  props: {},
  elements: {
    abandonButton: getButtonWithText('Abandon proposition'),
    details: '#field-details',
  },
  commands: [
    {
      abandonProposition(callback) {
        const proposition = assign(
          {},
          {
            details: faker.lorem.sentence(),
          }
        )
        this.waitForElementVisible('@abandonButton').api.perform(() => {
          forEach(keys(proposition), (key) => {
            this.replaceValue(`@${key}`, proposition[key])
          })
          proposition.heading = proposition.name
        })
        return this.click('@abandonButton', () => {
          callback(proposition)
        })
      },
    },
  ],
}
