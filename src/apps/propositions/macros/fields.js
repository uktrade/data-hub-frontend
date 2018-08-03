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
    isLabelHidden: true,
  },
  documentUpload01: {
    macroName: 'TextField',
    type: 'file',
    name: 'filename01',
    isLabelHidden: true,
  },
  documentUpload02: {
    macroName: 'TextField',
    type: 'file',
    name: 'filename02',
    isLabelHidden: true,
  },
  documentUpload03: {
    macroName: 'TextField',
    type: 'file',
    name: 'filename03',
    isLabelHidden: true,
  },
  documentUpload04: {
    macroName: 'TextField',
    type: 'file',
    name: 'filename04',
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
