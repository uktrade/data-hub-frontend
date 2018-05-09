module.exports = {
  name: {
    macroName: 'TextField',
    name: 'name',
  },
  scope: {
    macroName: 'TextField',
    name: 'scope',
  },
  deadline: {
    macroName: 'DateFieldset',
    name: 'deadline',
  },
  adviser (advisers) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'dit_adviser',
      initialOption: '-- Select adviser --',
      options: advisers,
    }
  },
}
