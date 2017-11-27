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
      name: 'feedback_type',
      label: 'Choose one of these',
      options: [
        {
          value: 'user_admin',
          label: 'I don\'t have access',
        },
        {
          value: 'bug',
          label: 'I have another problem',
        },
        {
          value: 'feedback',
          label: 'I\'ve got some feedback',
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
