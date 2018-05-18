module.exports = {
  abandon: {
    macroName: 'TextField',
    type: 'textarea',
    name: 'details',
  },
  adviser (advisers) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'adviser',
      initialOption: '-- Select adviser --',
      options: advisers,
    }
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
