module.exports = function({ returnLink, errors = [] }) {
  const interactionQuestion = 'What would you like to record?'

  return {
    buttonText: 'Continue',
    errors,
    children: [
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        name: 'theme',
        label: 'What is this regarding?',
        options: [
          {
            label: 'Export',
            value: 'interaction',
            children: [
              {
                macroName: 'MultipleChoiceField',
                type: 'radio',
                label: interactionQuestion,
                name: 'kind_export',
                modifier: 'subfield',
                condition: {
                  name: 'theme',
                  value: 'interaction',
                },
                options: [
                  {
                    value: 'export_interaction',
                    label: 'A standard interaction',
                    hint: 'For example, an email, phone call or meeting',
                  },
                  {
                    value: 'export_service_delivery',
                    label: 'A service that you have provided',
                    hint: 'For example a significant assist or an event',
                  },
                ],
              },
            ],
          },
          {
            label: 'Investment',
            value: 'investment_interaction',
          },
          {
            label: 'Other',
            value: 'service_delivery',
            children: [
              {
                macroName: 'MultipleChoiceField',
                type: 'radio',
                label: interactionQuestion,
                name: 'kind_other',
                modifier: 'subfield',
                condition: {
                  name: 'theme',
                  value: 'service_delivery',
                },
                options: [
                  {
                    value: 'other_interaction',
                    label: 'A standard interaction',
                    hint: 'For example, an email, phone call or meeting',
                  },
                  {
                    value: 'other_service_delivery',
                    label: 'A service that you have provided',
                    hint: 'For example a significant assist or an event',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
}
