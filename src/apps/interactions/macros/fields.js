module.exports = {
  adviser (advisers) {
    return {
      macroName: 'Typeahead',
      name: 'dit_adviser',
      entity: 'adviser',
      classes: 'c-form-group c-form-group--no-filter',
      placeholder: 'Search adviser',
      multipleSelect: false,
      options: advisers,
    }
  },
  contact (contacts) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'contact',
      initialOption: '-- Select contact --',
      options: contacts,
    }
  },
  provider (teams) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'dit_team',
      initialOption: '-- Select provider --',
      options: teams,
    }
  },
  service (services) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'service',
      initialOption: '-- Select service --',
      options: services,
    }
  },
  policyAreas (areas) {
    return {
      macroName: 'AddAnother',
      buttonName: 'add_item',
      name: 'policy_areas',
      children: [{
        macroName: 'MultipleChoiceField',
        name: 'policy_areas',
        label: 'Policy area',
        initialOption: '-- Select policy area --',
        options: areas,
        optional: false,
        isLabelHidden: true,
      }],
    }
  },
  feedbackPolicyIssueType (types) {
    return {
      macroName: 'MultipleChoiceField',
      type: 'checkbox',
      name: 'policy_issue_types',
      optional: false,
      modifier: 'subfield',
      condition: {
        name: 'was_policy_feedback_provided',
        value: 'true',
      },
      options: types,
    }
  },
  feedbackPolicyRequest: {
    macroName: 'MultipleChoiceField',
    type: 'radio',
    name: 'was_policy_feedback_provided',
    optional: false,
    modifier: 'inline',
    options: [
      {
        label: 'Yes',
        value: 'true',
      },
      {
        label: 'No',
        value: 'false',
      },
    ],
  },
  feedbackPolicyNotes: {
    macroName: 'TextField',
    type: 'textarea',
    modifier: 'subfield',
    condition: {
      name: 'was_policy_feedback_provided',
      value: 'true',
    },
    name: 'policy_feedback_notes',
    hint: 'These notes will be visible to other Data Hub users and may be shared within the department',

  },
  subject: {
    macroName: 'TextField',
    name: 'subject',
  },
  notes: {
    macroName: 'TextField',
    optional: true,
    type: 'textarea',
    name: 'notes',
  },
  date: {
    macroName: 'DateFieldset',
    name: 'date',
  },
  communicationChannel (channels) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'communication_channel',
      initialOption: '-- Select communication channel --',
      options: channels,
    }
  },
}
