module.exports = {
  abandon: {
    macroName: 'TextField',
    type: 'textarea',
    name: 'details',
    hint: 'Add the reason you\'re abandoning this proposition',
  },
  adviser (advisers) {
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
    hint: 'Add the document\'s Sharepoint URL, e.g. http://your-sharepoint-url~',
  },
  documentUpload: {
    macroName: 'TextField',
    type: 'file',
    name: 'filename',
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
