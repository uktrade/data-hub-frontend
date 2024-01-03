module.exports = {
  complete: {
    macroName: 'TextField',
    type: 'textarea',
    name: 'details',
    hint: "Add the document's Sharepoint URL, e.g. http://your-sharepoint-url~",
  },
  multipleDocumentUpload: {
    macroName: 'AddAnother',
    buttonName: 'add_item',
    label: 'Filename',
    name: 'filename',
    children: [
      {
        macroName: 'TextField',
        type: 'file',
        label: 'Filename',
        name: 'filename',
        isLabelHidden: true,
      },
    ],
  },
  documentUpload: {
    macroName: 'TextField',
    type: 'file',
    name: 'filename',
    isLabelHidden: true,
  },
}
