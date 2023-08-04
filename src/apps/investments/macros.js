const metadata = require('../../lib/metadata')

const statusFormConfig = {
  buttonText: 'Save',
  children: [
    {
      macroName: 'MultipleChoiceField',
      type: 'radio',
      name: 'status',
      label: 'Status',
      isLabelHidden: true,
      options: metadata.investmentStatusOptions,
    },
  ],
}

module.exports = {
  statusFormConfig,
}
