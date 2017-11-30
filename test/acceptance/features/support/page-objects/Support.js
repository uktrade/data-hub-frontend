const { assign } = require('lodash')
const faker = require('faker')

const { getButtonWithText } = require('../../../helpers/selectors')

module.exports = {
  elements: {
    flashMessage: '.c-message-list li:first-child',
  },
  commands: [
    {
      createSupportTicket (details = {}, callback) {
        const supportRequest = assign({}, {
          title: faker.lorem.words(),
          description: faker.lorem.sentence(),
          email: faker.internet.email(),
          webBrowser: faker.random.words(),
        }, details)
        const supportRequestRadioOptions = {}

        return this.section.form
          .waitForElementPresent('@sendButton')
          .api.perform((done) => {
            this.getRadioOption('feedback_type', (result) => {
              supportRequestRadioOptions.employeeRange = result
              done()
            })
          })
          .perform(() => {
            for (const key in supportRequest) {
              if (supportRequest[key]) {
                this.section.form
                  .setValue(`@${key}`, supportRequest[key])
              }
            }
            for (const key in supportRequestRadioOptions) {
              this.api.useCss()
                .click(supportRequestRadioOptions[key].labelSelector)
            }
          })
          .perform(() => {
            this.section.form
              .click('@sendButton')

            callback(assign({}, supportRequest, supportRequestRadioOptions))
          })
      },
    },
  ],
  sections: {
    form: {
      selector: 'form',
      elements: {
        title: '#field-title',
        titleError: 'label[for=field-title] span:nth-child(2)',
        chooseOneOfThese: '#group-field-feedback_type',
        chooseOneOfTheseError: '#group-field-feedback_type span.c-form-group__error-message',
        description: '#field-description',
        email: '#field-email',
        emailError: 'label[for=field-email] span:nth-child(2)',
        webBrowser: '#field-browser',
        sendButton: getButtonWithText('Send'),
      },
    },
  },
}
