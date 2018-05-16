module.exports = {
  abandon: {
    macroName: 'TextField',
    type: 'textarea',
    name: 'abandon',
  },
  adviser (advisers) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'assigned_to',
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
