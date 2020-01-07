const { getButtonWithText } = require('../helpers/selectors')

module.exports = {
  url: `${process.env.QA_HOST}/support`,
  elements: {
    flashMessage: '.c-message-list li:first-child',
  },
  sections: {
    form: {
      selector: 'form',
      elements: {
        title: '#field-title',
        titleError: 'label[for=field-title] span:nth-child(2)',
        chooseOneOfThese: '#group-field-feedback_type',
        chooseOneOfTheseError:
          '#group-field-feedback_type span.c-form-group__error-message',
        description: '#field-description',
        email: '#field-email',
        emailError: 'label[for=field-email] span:nth-child(2)',
        webBrowser: '#field-browser',
        sendButton: getButtonWithText('Send'),
      },
    },
  },
}
