const { flattenDeep } = require('lodash')

const { globalFields } = require('../../macros')
const canAddCountries = require('./can-add-countries')

const { EXPORT_INTEREST_STATUS_VALUES } = require('../../constants')

module.exports = {
  adviser(advisers) {
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
          autoSubmit: false,
        },
      ],
    }
  },
  contact(contacts) {
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
  policyAreas(areas) {
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
  service(services) {
    const primaryOptionsValues = services.map(
      ({ value, label, isControlledBySecondary }) => {
        return {
          value,
          label,
          isControlledBySecondary: !!isControlledBySecondary,
        }
      }
    )
    const secondaryOptionValues = services.map(({ secondaryOptions }) => {
      return secondaryOptions.map(({ value, label }) => {
        return {
          value,
          label,
        }
      })
    })

    const serviceQuestions = flattenDeep(
      services.map((service) => {
        if (!service.secondaryOptions.length) {
          return service.interactionQuestions
        }
        return service.secondaryOptions.map((secondaryOption) => {
          return secondaryOption.interactionQuestions
        })
      })
    )

    const serviceIds = primaryOptionsValues.map((service) => service.value)
    const primaryOptions = [
      {
        macroName: 'MultipleChoiceField',
        name: 'service',
        initialOption: '-- Select service --',
        options: primaryOptionsValues,
        modifier: ['hide-label'],
      },
    ]

    const secondaryOptions = secondaryOptionValues
      .map((option, index) => {
        if (!option.length) return
        return {
          macroName: 'MultipleChoiceField',
          name: 'subService',
          label: 'Sub service',
          modifier: 'subfield',
          isLabelHidden: true,
          initialOption: '-- Select --',
          options: [].concat(...secondaryOptionValues[index]),
          condition: {
            name: 'service',
            value: option.length && serviceIds[index],
          },
        }
      })
      .filter((x) => x)

    const tertiaryOptions = serviceQuestions.map((option) => {
      return {
        macroName: 'MultipleChoiceField',
        label: option.label,
        name: option.value,
        type: 'radio',
        value: option.label,
        modifier: 'subfield',
        options: option.options.map((option) => {
          return {
            label: option.label,
            name: option.value,
            value: option.value,
          }
        }),
        condition: {
          name: option.isControlledBySecondary ? 'subService' : 'service',
          value: option.serviceId,
        },
      }
    })

    return [...primaryOptions, ...secondaryOptions, ...tertiaryOptions]
  },
  feedbackPolicyIssueType(types) {
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
  participantsHeading(companyName) {
    return {
      macroName: 'FormSubHeading',
      heading: 'Interaction Participants',
      secondaryHeading: companyName,
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
  communicationChannel(channels) {
    return {
      macroName: 'MultipleChoiceField',
      name: 'communication_channel',
      initialOption: '-- Select communication channel --',
      options: channels,
    }
  },
  countriesDiscussed: (theme, interaction) => {
    return !canAddCountries(theme, interaction)
      ? []
      : [
          {
            macroName: 'MultipleChoiceField',
            type: 'radio',
            name: 'were_countries_discussed',
            modifier: 'inline',
            optional: false,
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
          ...EXPORT_INTEREST_STATUS_VALUES.map((name) => ({
            macroName: 'Typeahead',
            name,
            hint: 'Add all that you discussed',
            modifier: 'subfield',
            condition: {
              name: 'were_countries_discussed',
              value: 'true',
            },
            isAsync: false,
            isLabelHidden: false,
            useSubLabel: false,
            placeholder: 'Search countries',
            classes: 'c-form-group--no-filter',
            multipleSelect: true,
            options: globalFields.countries.options(),
            target: 'metadata',
            autoSubmit: false,
          })),
        ]
  },
}
