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
        },
        {
          value: 'policy_feedback',
          label: 'Capture policy feedback',
          hint: 'For example, and issue or comment on government policy from a company',
        },
        ],
      },
    ],
  }
}
