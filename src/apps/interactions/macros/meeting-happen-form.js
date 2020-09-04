module.exports = function ({ returnLink, userAgent }) {
  return {
    returnLink,
    buttonText: 'Continue',
    children: [
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        modifier: 'inline',
        name: 'meeting_happen',
        label: 'Did the meeting happen?',
        options: [
          {
            label: 'Yes',
            value: 'true',
          },
          {
            label: 'No',
            value: 'false',
          },
        ],
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        modifier: 'subfield',
        name: 'archived_reason',
        label: 'Reason',
        isLabelHidden: true,
        condition: {
          name: 'meeting_happen',
          value: 'false',
        },
        options: [
          {
            value: 'Client cancelled',
            label: 'Client cancelled',
          },
          {
            value: 'DIT cancelled',
            label: 'DIT cancelled',
          },
          {
            value: 'Rescheduled',
            label: 'Rescheduled',
          },
        ],
        children: [
          {
            macroName: 'TextField',
            type: 'date',
            label: 'When will the meeting take place?',
            modifier: 'short',
            name: 'date',
            hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
            placeholder: '',
            inputClass: userAgent.isIE ? 'ie-date-field' : null,
            condition: {
              name: 'archived_reason',
              value: 'Rescheduled',
            },
          },
        ],
      },
    ],
  }
}
