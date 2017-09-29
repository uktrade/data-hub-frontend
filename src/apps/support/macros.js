const feedbackFormConfig = (browserInfo) => ({
  buttonText: 'Send',
  children: [
    {
      macroName: 'TextField',
      name: 'title',
      label: 'Title',
      hint: 'A brief summary of your feedback/problem',
    },
    {
      macroName: 'MultipleChoiceField',
      type: 'radio',
      name: 'feedbackType',
      modifier: 'inline',
      label: 'Problem or feedback?',
      options: [
        {
          value: 'bug',
          label: 'Problem',
        },
        {
          value: 'feedback',
          label: 'Feedback',
        },
      ],
    },
    {
      macroName: 'TextField',
      optional: true,
      type: 'textarea',
      name: 'description',
      label: 'Description',
      hint: 'If you were having a problem, explain what you did, what happened and what you expected to happen. If you want to provide feedback or a suggestion, describe it here.',
    },
    {
      macroName: 'TextField',
      optional: true,
      name: 'email',
      label: 'Email',
      hint: 'If you wish to be contacted, please provide your email address',
    },
    {
      macroName: 'TextField',
      optional: true,
      name: 'browser',
      label: 'Web browser',
      hint: 'The name of the web browser and version you were using',
      value: browserInfo,
    },
  ],
})

module.exports = {
  feedbackFormConfig,
}
