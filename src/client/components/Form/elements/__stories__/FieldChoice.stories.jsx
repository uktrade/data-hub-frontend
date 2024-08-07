import React from 'react'
import { H1 } from '@govuk-react/heading'
import styled, { css } from 'styled-components'

import FieldChoice from '../FieldChoice'
import Form from '../..'

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

const FieldChoiceCheckboxInline = styled(FieldChoice.Checkbox)`
  ${inline}
`

const options = [
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

const formatOption = (option) =>
  `{ value: '${option.value}', label: '${option.label}' }`

const formatOptions = (options) => options.map(formatOption) //.join(', ')

export default {
  title: 'Form/Form Elements/FieldChoice',
  component: FieldChoice,
  args: {
    options,
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
        component: `The <b>FieldChoice</b> component is designed to render a group of radio buttons or checkboxes by setting the prop type to either <b>"radio"</b> or <b>"checkbox"</b>.
        The component sets the entire selected option (Object) to the Form's state which is helpful on user journeys where the final page is a summary page and you
        need to pullout a name (or any other field) from a previous selection to display it to the user. At present, <b>FieldRadio</b> only writes the ID (String) to the form state.`,
      },
    },
  },
}

const Template = (
  { component: Component, initialValues, ...args },
  { id: storyId }
) => (
  <Form
    id={storyId}
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

const defaultFormProps = `\n  id="form-id"\n  analyticsFormName="formRadio"\n  submissionTaskName="SUBMISSION"`
const defaultComponentProps = `name="country"`

const getForm = ({ component, formProp, componentProp }) => {
  const formProps = formProp
    ? `${defaultFormProps}\n  ${formProp}`
    : ` ${defaultFormProps}`

  const componentProps = componentProp
    ? `${defaultComponentProps}
      ${componentProp}`
    : `${defaultComponentProps}`
  return `
<Form ${formProps}>
  {(state) => (
    <${component}
      ${componentProps}
      options={[
        ${formatOption(options[0])}
        ${formatOption(options[1])}
        ${formatOption(options[2])}
        ${formatOption(options[3])}
      ]}
    />
  )}
</Form>
`
}

// Radio
export const Radio = Template.bind({})
Radio.args = {
  type: 'radio',
}
Radio.parameters = {
  docs: {
    description: {
      story: 'A group of 4 radio buttons',
    },
    source: {
      code: getForm({ component: 'FieldChoice.Radio' }),
    },
  },
}

export const RadioLabel = Template.bind({})
RadioLabel.args = {
  ...Radio.args,
  label: 'Countries',
}
RadioLabel.parameters = {
  docs: {
    description: {
      story: 'Radio button group label',
    },
    source: {
      code: getForm({
        component: 'FieldChoice.Radio',
        componentProp: 'label="Countries"',
      }),
    },
  },
}

export const RadioHint = Template.bind({})
RadioHint.args = {
  ...Radio.args,
  hint: 'Country hint',
}
RadioHint.parameters = {
  docs: {
    description: {
      story: 'Radio button group hint text',
    },
    source: {
      code: getForm({
        component: 'FieldChoice.Radio',
        componentProp: 'hint="Country hint"',
      }),
    },
  },
}

export const RadioLegend = Template.bind({})
RadioLegend.args = {
  ...Radio.args,
  legend: <h1>My H1 legend</h1>,
}
RadioLegend.parameters = {
  docs: {
    description: {
      story: 'Radio button group legend',
    },
    source: {
      code: getForm({
        component: 'FieldChoice.Radio',
        componentProp: 'legend={<H1>My H1 legend</H1>}',
      }),
    },
  },
}

export const RadioInline = Template.bind({})
RadioInline.args = {
  ...Radio.args,
  component: FieldChoiceRadioInline,
}
RadioInline.parameters = {
  docs: {
    description: {
      story: 'Radio button group inline',
    },
    source: {
      code: getForm({
        component: 'FieldChoiceRadioInline',
      }),
    },
  },
}

export const RadioRequired = Template.bind({})
RadioRequired.args = {
  ...Radio.args,
  required: 'Select at least one country',
}
RadioRequired.parameters = {
  docs: {
    description: {
      story:
        'Radio button group where a selection is required. Click "Save" to view the form validation error message.',
    },
    source: {
      code: getForm({
        component: 'FieldChoice.Radio',
        componentProp: 'required="Select at least one country"',
      }),
    },
  },
}

export const RadioSelected = Template.bind({})
RadioSelected.args = {
  ...Radio.args,
  initialValues: {
    // Radios require a single object
    country: options[0],
  },
}
RadioSelected.parameters = {
  docs: {
    description: {
      story: 'Radio button group selected',
    },
    source: {
      code: getForm({
        component: 'FieldChoice.Radio',
        formProp: `initialValues={{country: ${formatOption(options[0])}}}`,
      }),
    },
  },
}

// Checkbox
export const Checkbox = Template.bind({})
Checkbox.args = {
  type: 'checkbox',
}
Checkbox.parameters = {
  docs: {
    description: {
      story: 'A group of 4 checkboxes.',
    },
    source: {
      code: getForm({
        component: 'FieldChoice.Checkbox',
      }),
    },
  },
}

export const CheckboxLabel = Template.bind({})
CheckboxLabel.args = {
  ...Checkbox.args,
  label: 'Countries',
}
CheckboxLabel.parameters = {
  docs: {
    description: {
      story: 'Checkbox group label',
    },
    source: {
      code: getForm({
        component: 'FieldChoice.Checkbox',
        componentProp: 'label="Countries"',
      }),
    },
  },
}

export const CheckboxHint = Template.bind({})
CheckboxHint.args = {
  ...Checkbox.args,
  hint: 'Country hint',
}
CheckboxHint.parameters = {
  docs: {
    description: {
      story: 'Checkbox group hint text',
    },
    source: {
      code: getForm({
        component: 'FieldChoice.Checkbox',
        componentProp: 'hint="Country hint"',
      }),
    },
  },
}

export const CheckboxLegend = Template.bind({})
CheckboxLegend.args = {
  ...Checkbox.args,
  legend: <H1>My H1 legend</H1>,
}
CheckboxLegend.parameters = {
  docs: {
    description: {
      story: 'Checkbox group legend',
    },
    source: {
      code: getForm({
        component: 'FieldChoice.Checkbox',
        componentProp: 'legend={<H1>My H1 legend</H1>}',
      }),
    },
  },
}

export const CheckboxInline = Template.bind({})
CheckboxInline.args = {
  ...Checkbox.args,
  component: FieldChoiceCheckboxInline,
}
CheckboxInline.parameters = {
  docs: {
    description: {
      story: 'Checkbox group inline',
    },
    source: {
      code: getForm({
        component: 'FieldChoiceCheckboxInline',
      }),
    },
  },
}

export const CheckboxRequired = Template.bind({})
CheckboxRequired.args = {
  ...Checkbox.args,
  required: 'Choose one or more countries',
}
CheckboxRequired.parameters = {
  docs: {
    description: {
      story:
        'Checkbox group where a user must choose at least one country. Click "Save" to view the form validation error message.',
    },
    source: {
      code: getForm({
        component: 'FieldChoice.Checkbox',
        componentProp: 'required="Choose one or more countries"',
      }),
    },
  },
}

export const CheckboxChecked = Template.bind({})
CheckboxChecked.args = {
  ...Checkbox.args,
  initialValues: {
    // Checkboxes require an array of objects
    country: [options[0], options[1]],
  },
}
CheckboxChecked.parameters = {
  docs: {
    description: {
      story: 'Checkbox group checked',
    },
    source: {
      code: getForm({
        component: 'FieldChoice.Checkbox',
        formProp: `initialValues={{ country: [${formatOptions([options[0], options[1]])}]}}`,
      }),
    },
  },
}
