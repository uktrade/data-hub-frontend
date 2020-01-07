module.exports = {
  abandon: {
    macroName: 'TextField',
    type: 'textarea',
    name: 'details',
    hint: "Add the reason you're abandoning this proposition",
  },
  adviser(advisers) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'adviser',
      initialOption: '-- Select adviser --',
      options: advisers,
    }
  },
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
  deadline: {
    macroName: 'DateFieldset',
    name: 'deadline',
  },
  name: {
    macroName: 'TextField',
    name: 'name',
  },
  scope: {
    macroName: 'TextField',
    name: 'scope',
  },
}
