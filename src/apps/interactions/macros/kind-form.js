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
          hint: 'For example, account management or a significant assist',
        }, {
          value: 'event_interaction',
          label: 'Record an invitation or attendance for an event',
          hint: 'For example, to record who came to an event',
        }, {
          value: 'policy_feedback',
          label: 'Policy feedback',
          hint: 'For example, when a company wants to give UK government policy feedback',
        },
        ],
      },
    ],
  }
}
