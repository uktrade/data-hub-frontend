import React from 'react'
import styled, { css } from 'styled-components'

import FieldChoice from '../FieldChoice'
import Form from '../..'

const getGDSDocsUrl = (component) =>
  `<a href="https://design-system.service.gov.uk/components/${component}" target="_blank" rel="noopener noreferrer">GOV.UK Design System docs - ${component}</a>`

const GDS_DOCS_RADIOS_URL = getGDSDocsUrl('radios')
const GDS_DOCS_CHECKBOXES_URL = getGDSDocsUrl('checkboxes')

const inline = css`
  fieldset div {
    display: flex;
  }
  fieldset div label {
    margin-right: 10px;
  }
`

const FieldChoiceRadioInline = styled(FieldChoice.Radio)`
  ${inline}
`

const FieldChoiceBooleanInline = styled(FieldChoice.Boolean)`
  ${inline}
`

const countryOptions = [
  {
    value: '0',
    label: 'England',
  },
  {
    value: '1',
    label: 'Wales',
  },
  {
    value: '2',
    label: 'Scotland',
  },
  {
    value: '3',
    label: 'Northern Ireland',
  },
]

const countryOptionsSubset = countryOptions.slice(0, 2)

export default {
  title: 'Form/Form Elements/FieldChoice',
  component: FieldChoice,
  args: {
    options: countryOptions,
    name: 'country',
    component: FieldChoice,
  },
  argTypes: {
    type: 'string',
    initialValues: { control: 'object' },
  },
  parameters: {
    docs: {
      description: {
        component: `The <b>FieldChoice</b> component renders a group of radio buttons or checkboxes by setting the prop type to either "radio" or "checkbox".
                    The component sets the entire selected option to the form's state which is helpful on user journeys where the final page is a summary page
                    and you need to extract a label (or any other field) from a previous selection to display to the user. Instead of using FieldChoice directly,
                    favour <b>FieldChoice.Radio</b>, <b>FieldChoice.Checkbox</b>, or <b>FieldChoice.Boolean</b> where the type is set for you.`,
      },
    },
  },
}

const Template = ({ component: Component, initialValues, ...args }, { id }) => (
  <Form
    id={id}
    analyticsFormName="formRadio"
    submissionTaskName="SUBMISSION"
    initialValues={initialValues}
  >
    {(state) => (
      <>
        <Component {...args} />
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </>
    )}
  </Form>
)

const generateFormCode = ({
  comments = [],
  componentName,
  props: { options = countryOptions, ...restProps },
}) => {
  let formCode = ''

  comments.forEach((comment) => {
    formCode += `// ${comment}\n`
  })

  formCode += `
<Form
  id={id}
  analyticsFormName="formRadio"
  submissionTaskName="SUBMISSION"
>
  {(state) => (
    <>
      <${componentName}`

  Object.keys(restProps).forEach((key) => {
    const value = restProps[key]
    if (value) {
      formCode += `
        ${key}="${value}"`
    }
  })

  if (options.length) {
    formCode += `
        options: [`

    options.forEach((option, index) => {
      formCode += `
          {
            value: '${option.value}',
            label: '${option.label}',
          }${index < options.length - 1 ? ',' : ''}`
    })

    formCode += `
        ]`
  }

  formCode += `
      />
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  )}
</Form>
`
  return formCode
}

const formatCountry = (country) =>
  `{ value: '${country.value}', label: '${country.label}' }`

// Radios
export const Radios = Template.bind({})
Radios.args = { type: 'radio' }
Radios.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_RADIOS_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Radio',
        props: {
          name: 'country',
        },
      }),
    },
  },
}

export const RadiosLabel = Template.bind({})
RadiosLabel.storyName = 'Radios and label'
RadiosLabel.args = {
  ...Radios.args,
  label: 'Where do you live',
}
RadiosLabel.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_RADIOS_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Radio',
        props: {
          name: 'country',
          label: 'Where do you live',
        },
      }),
    },
  },
}

export const RadiosLabelAndHint = Template.bind({})
RadiosLabelAndHint.storyName = 'Radios with label and hint'
RadiosLabelAndHint.args = {
  ...Radios.args,
  label: 'Where do you live',
  hint: 'Select one option',
}
RadiosLabelAndHint.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_RADIOS_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Radio',
        props: {
          name: 'country',
          label: 'Where do you live',
          hint: 'Select one option',
        },
      }),
    },
  },
}

export const RadiosLegend = Template.bind({})
RadiosLegend.storyName = 'Radios and legend'
RadiosLegend.args = {
  ...Radios.args,
  legend: <h1>H1 legend</h1>,
}
RadiosLegend.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_RADIOS_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Radio',
        props: {
          name: 'country',
          legend: '{<h1>H1 legend</h1>}',
        },
      }),
    },
  },
}

export const RadiosInline = Template.bind({})
RadiosInline.storyName = 'Radios inline'
RadiosInline.args = {
  ...Radios.args,
  component: FieldChoiceRadioInline,
  options: countryOptionsSubset,
}
RadiosInline.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_RADIOS_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoiceRadioInline',
        props: {
          name: 'country',
          options: countryOptionsSubset,
        },
      }),
    },
  },
}

export const RadiosRequired = Template.bind({})
RadiosRequired.storyName = 'Radios selection required'
RadiosRequired.args = {
  ...Radios.args,
  required: 'Select at least one country',
}
RadiosRequired.parameters = {
  docs: {
    description: {
      story: `Radio button group where a selection is required. Click "Save" to view an error. ${GDS_DOCS_RADIOS_URL}`,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Radio',
        props: {
          name: 'country',
          required: 'Select at least one country',
        },
      }),
    },
  },
}

export const RadiosPreselected = Template.bind({})
RadiosPreselected.storyName = 'Radios preselected'
const country = countryOptions[0]
RadiosPreselected.args = {
  ...Radios.args,
  initialValues: {
    country,
  },
}
RadiosPreselected.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_RADIOS_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Radio',
        comments: [
          'The form will automatically set the initial values providing the name',
          "field is set within the object that's returned by a transformer.",
          `For example: { country: ${formatCountry(country)} }`,
        ],
        props: {
          name: 'country',
        },
      }),
    },
  },
}

// Checkbox
export const Checkboxes = Template.bind({})
Checkboxes.args = { type: 'checkboxes' }
Checkboxes.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_CHECKBOXES_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Checkbox',
        props: {
          name: 'country',
        },
      }),
    },
  },
}

export const CheckboxesLabel = Template.bind({})
CheckboxesLabel.storyName = 'Checkboxes and label'
CheckboxesLabel.args = {
  ...Checkboxes.args,
  label: 'Where do you live',
}
CheckboxesLabel.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_CHECKBOXES_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Checkbox',
        props: {
          name: 'country',
          label: 'Where do you live',
        },
      }),
    },
  },
}

export const CheckboxesLabelAndHint = Template.bind({})
CheckboxesLabelAndHint.storyName = 'Checkboxes label and hint'
const checkboxLabelAndHint = {
  label: 'Where do you live',
  hint: 'Select all that apply',
}
CheckboxesLabelAndHint.args = {
  ...Checkboxes.args,
  ...checkboxLabelAndHint,
}
CheckboxesLabelAndHint.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_CHECKBOXES_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Checkbox',
        props: {
          name: 'country',
          ...checkboxLabelAndHint,
        },
      }),
    },
  },
}

export const CheckboxesLegend = Template.bind({})
CheckboxesLegend.storyName = 'Checkboxes and legend'
CheckboxesLegend.args = {
  ...Checkboxes.args,
  legend: <h1>H1 legend</h1>,
}
CheckboxesLegend.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_CHECKBOXES_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Checkbox',
        props: {
          name: 'country',
          legend: '{<h1>H1 legend</h1>}',
        },
      }),
    },
  },
}

export const CheckboxesRequired = Template.bind({})
CheckboxesRequired.storyName = 'Checkboxes selection required'
CheckboxesRequired.args = {
  ...Checkboxes.args,
  required: 'Select at least one country',
}
CheckboxesRequired.parameters = {
  docs: {
    description: {
      story: `Checkbox group where a selection is required. Click "Save" to view an error. ${GDS_DOCS_CHECKBOXES_URL}`,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Checkbox',
        props: {
          name: 'country',
          required: 'Select at least one country',
        },
      }),
    },
  },
}

export const CheckboxPreselected = Template.bind({})
CheckboxPreselected.storyName = 'Checkboxes preselected'
CheckboxPreselected.args = {
  ...Checkboxes.args,
  initialValues: {
    country: [countryOptions[0], countryOptions[1]],
  },
}
CheckboxPreselected.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_CHECKBOXES_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Checkbox',
        comments: [
          'The form will automatically set the initial values providing the name',
          "field is set within the object that's returned by a transformer.",
          `For example: { country: [${formatCountry(countryOptions[0])}, ${formatCountry(countryOptions[1])}] }`,
        ],
        props: {
          name: 'country',
        },
      }),
    },
  },
}

// Boolean
const BOOLEAN_COMMENT =
  "There's no need to set the options as the component does this internally."

export const Boolean = Template.bind({})
Boolean.storyName = 'Boolean radios'
Boolean.args = {
  name: 'has_changed_name',
  component: FieldChoice.Boolean,
}
Boolean.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_RADIOS_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Boolean',
        comments: [BOOLEAN_COMMENT],
        props: {
          name: 'has_changed_name',
          options: [],
        },
      }),
    },
  },
}

export const BooleanLabel = Template.bind({})
BooleanLabel.storyName = 'Boolean radios with label'
BooleanLabel.args = {
  ...Boolean.args,
  label: 'Have you changed your name?',
}
BooleanLabel.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_RADIOS_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Boolean',
        comments: [BOOLEAN_COMMENT],
        props: {
          name: 'has_changed_name',
          label: 'Have you changed your name?',
          options: [],
        },
      }),
    },
  },
}

export const BooleanLabelAndHint = Template.bind({})
BooleanLabelAndHint.storyName = 'Boolean radios with label and hint'
const labelAndHint = {
  label: 'Have you changed your name?',
  hint: 'This includes changing your last name or spelling your name differently.',
}
BooleanLabelAndHint.args = {
  ...Boolean.args,
  ...labelAndHint,
}
BooleanLabelAndHint.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_RADIOS_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Boolean',
        comments: [BOOLEAN_COMMENT],
        props: {
          name: 'has_changed_name',
          ...labelAndHint,
          options: [],
        },
      }),
    },
  },
}

export const BooleanCustomOptionLabels = Template.bind({})
BooleanCustomOptionLabels.storyName = 'Boolean radios with custom labels'
const customOptionLabels = {
  label: 'Have you changed your name?',
  yesLabel: 'Agree',
  noLabel: 'Disagree',
}
BooleanCustomOptionLabels.args = {
  ...Boolean.args,
  ...customOptionLabels,
}
BooleanCustomOptionLabels.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_RADIOS_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Boolean',
        comments: [BOOLEAN_COMMENT],
        props: {
          name: 'has_changed_name',
          ...customOptionLabels,
          options: [],
        },
      }),
    },
  },
}

export const BooleanRequired = Template.bind({})
BooleanRequired.storyName = 'Boolean radios selection required'
BooleanRequired.args = {
  ...Boolean.args,
  required: 'Select at least one option',
}
BooleanRequired.parameters = {
  docs: {
    description: {
      story: `A boolean radio group where a selection is required. Click "Save" to view an error. ${GDS_DOCS_RADIOS_URL}`,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoice.Boolean',
        comments: [BOOLEAN_COMMENT],
        props: {
          name: 'has_changed_name',
          required: 'Select at least one option',
          options: [],
        },
      }),
    },
  },
}

export const BooleanInline = Template.bind({})
BooleanInline.storyName = 'Boolean radios inline'
BooleanInline.args = {
  ...Boolean.args,
  component: FieldChoiceBooleanInline,
}
BooleanInline.parameters = {
  docs: {
    description: {
      story: GDS_DOCS_RADIOS_URL,
    },
    source: {
      code: generateFormCode({
        componentName: 'FieldChoiceBooleanInline',
        comments: [BOOLEAN_COMMENT],
        props: {
          name: 'has_changed_name',
          options: [],
        },
      }),
    },
  },
}
