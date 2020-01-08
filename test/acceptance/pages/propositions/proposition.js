const faker = require('faker')
const { assign, forEach, keys } = require('lodash')

const { getButtonWithText } = require('../../helpers/selectors')
const { generateFutureDate } = require('../../helpers/date')

module.exports = {
  props: {},
  elements: {
    saveButton: getButtonWithText('Add proposition'),
    name: '#field-name',
    scope: '#field-scope',
    adviser: '#field-adviser',
    deadlineOfPropositionYear: '#field-deadline_year',
    deadlineOfPropositionMonth: '#field-deadline_month',
    deadlineOfPropositionDay: '#field-deadline_day',
  },
  commands: [
    {
      createProposition(details = {}, callback) {
        const futureDate = generateFutureDate()
        const proposition = assign(
          {},
          {
            name: faker.lorem.sentence(),
            scope: faker.lorem.sentence(),
            deadlineOfPropositionYear: futureDate.year,
            deadlineOfPropositionMonth: futureDate.month,
            deadlineOfPropositionDay: futureDate.day,
          },
          details
        )
        this.waitForElementVisible('@saveButton')
          .api.perform((done) => {
            this.getListOption('@adviser', (adviser) => {
              proposition.adviser = adviser
              done()
            })
          })
          .perform(() => {
            forEach(keys(proposition), (key) => {
              if (key !== 'adviser') {
                this.replaceValue(`@${key}`, proposition[key])
              }
            })
            proposition.heading = proposition.name
          })
        return this.click('@saveButton', () => {
          callback(proposition)
        })
      },
    },
  ],
}
