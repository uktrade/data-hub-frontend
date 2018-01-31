module.exports = function ({
  returnLink,
  errors = [],
}) {
  return {
    buttonText: 'Continue',
    errors,
    children: [
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        label: 'What would you like to record?',
        name: 'kind',
        options: [{
          value: 'interaction',
          label: 'A standard interaction',
          hint: 'For example, an email, phone call or meeting',
        }, {
          value: 'service_delivery',
          label: 'A service that you have provided',
          hint: 'For example, account management, a significant assist or an event',
        }],
      },
    ],
  }
}
