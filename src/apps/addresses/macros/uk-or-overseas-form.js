module.exports = () => {
  return {
    buttonText: 'Continue',
    children: [
      {
        macroName: 'MultipleChoiceField',
        label: 'Address',
        name: 'uk_or_overseas',
        type: 'radio',
        options: [
          { value: 'uk', label: 'UK address' },
          { value: 'overseas', label: 'Overseas address' },
        ],
      },
    ],
  }
}
