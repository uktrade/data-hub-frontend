module.exports = {
  adviser (advisers) {
    return {
      macroName: 'AddAnother',
      buttonName: 'add_item',
      name: 'dit_participants',
      children: [
        {
          macroName: 'Typeahead',
          name: 'dit_participants',
          label: 'Advisers',
          isLabelHidden: true,
          entity: 'adviser',
          placeholder: 'Search adviser',
          classes: 'c-form-group c-form-group--no-filter',
          multipleSelect: false,
          options: advisers,
          target: 'metadata',
        },
      ],
    }
  },
  contact (contacts) {
    return {
      macroName: 'AddAnother',
      buttonName: 'add_item',
      name: 'contacts',
      children: [
        {
          macroName: 'MultipleChoiceField',
          name: 'contacts',
          label: 'Contacts',
          initialOption: '-- Select contact --',
          options: contacts,
          optional: false,
          isLabelHidden: true,
        },
      ],
    }
  },
  policyAreas (areas) {
    return {
      macroName: 'AddAnother',
      buttonName: 'add_item',
      name: 'policy_areas',
      children: [
        {
          macroName: 'MultipleChoiceField',
          name: 'policy_areas',
          label: 'Policy area',
          initialOption: '-- Select policy area --',
          options: areas,
          optional: false,
          isLabelHidden: true,
        },
      ],
    }
  },
  service (services) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'service',
      initialOption: '-- Select service --',
      options: services,
      modifier: ['hide-label'],
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
    hint:
      'These notes will be visible to other Data Hub users and may be shared within the department',
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
  serviceHeading: {
    macroName: 'FormSubHeading',
    heading: 'Service',
  },
  participantsHeading (companyName) {
    return {
      macroName: 'FormSubHeading',
      heading: 'Interaction Participants',
      secondaryHeading: companyName && companyName,
    }
  },
  detailsHeading: {
    macroName: 'FormSubHeading',
    heading: 'Details',
  },
  notesHeading: {
    macroName: 'FormSubHeading',
    heading: 'Notes',
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
