module.exports = {
  complete: {
    macroName: 'TextField',
    type: 'textarea',
    name: 'details',
    hint: "Add the document's Sharepoint URL, e.g. http://your-sharepoint-url~",
  },
  documentUpload: {
    macroName: 'TextField',
    type: 'file',
    name: 'filename',
    isLabelHidden: true,
  },
}
