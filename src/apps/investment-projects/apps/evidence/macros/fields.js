module.exports = {
  tags: {
    macroName: 'AddAnother',
    buttonName: 'add_item',
    label: 'Tags',
    name: 'tags',
    hint: 'Pick your favorite fruits from the following list',
    children: [{
      macroName: 'MultipleChoiceField',
      type: 'file',
      label: 'Tag',
      name: 'tags',
      isLabelHidden: true,
      initialOption: '-- Select fruit --',
      options: [
        { value: 'apples', label: 'Apples' },
        { value: 'cherries', label: 'Cherries' },
        { value: 'peaches', label: 'Peaches' },
        { value: 'mangoes', label: 'Mangoes' },
        { value: 'bananas', label: 'Bananas' },
        { value: 'strawberries', label: 'Strawberries' },
      ],
    }],
  },
  documentUpload: {
    macroName: 'TextField',
    type: 'file',
    label: 'File',
    name: 'original_filename',
  },
  comment: {
    macroName: 'TextField',
    type: 'textarea',
    name: 'comment',
    hint: 'Add a relevant comment to the evidence you`re uploading',
  },
}
