module.exports = {
  tag(tags) {
    return {
      macroName: 'AddAnother',
      buttonName: 'add_item',
      label: 'Tags',
      name: 'tags',
      children: [
        {
          macroName: 'MultipleChoiceField',
          type: 'file',
          label: 'Tag',
          name: 'tags',
          isLabelHidden: true,
          initialOption: '-- Select criteria --',
          options: tags,
        },
      ],
    }
  },
  documentUpload: {
    macroName: 'TextField',
    type: 'file',
    label: 'File',
    name: 'original_filename',
    isLabelHidden: true,
  },
  comment: {
    macroName: 'TextField',
    type: 'textarea',
    name: 'comment',
    optional: true,
  },
}
