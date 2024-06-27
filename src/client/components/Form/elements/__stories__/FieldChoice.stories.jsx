import React from 'react'
import { H1 } from '@govuk-react/heading'

import FieldChoice from '../FieldChoice'
import Form from '../..'

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

const formatOptions = (options) => options.map(formatOption).join(', ')

export default {
  title: 'Form/Form Elements/FieldChoice',
  component: FieldChoice,
  args: {
    options,
    name: 'country',
  },
  argTypes: {
    type: 'string',
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

const Template = (args, { story }) => (
  <Form
    id={story}
    analyticsFormName="formRadio"
    submissionTaskName="SUBMISSION"
  >
    {(state) => (
      <>
        <FieldChoice {...args} />
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </>
    )}
  </Form>
)

const getForm = (type, propAndValue = '') => {
  const props = propAndValue
    ? `name="country"
      ${propAndValue}` // Ensure the prop and value are on a new line
    : `name="country"`
  return `
<Form
  id="form-id"
  analyticsFormName="formRadio"
  submissionTaskName="SUBMISSION"
>
  {(state) => (
    <FieldChoice.${type}
      ${props}
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
      code: getForm('Radio'),
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
      code: getForm('Radio', 'label="Countries"'),
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
      code: getForm('Radio', 'hint="Country hint"'),
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
      code: getForm('Radio', 'legend={<H1>My H1 legend</H1>}'),
    },
  },
}

export const RadioInitialValue = Template.bind({})
RadioInitialValue.args = {
  ...Radio.args,
  initialValue: options[0],
}
RadioInitialValue.parameters = {
  docs: {
    description: {
      story: 'Radio button group initial value',
    },
    source: {
      code: getForm('Radio', `initialValue={${formatOptions([options[0]])}}`),
    },
  },
}

export const RadioInline = Template.bind({})
RadioInline.args = {
  ...Radio.args,
  inline: true,
}
RadioInline.parameters = {
  docs: {
    description: {
      story: 'Radio button group inline',
    },
    source: {
      code: getForm('Radio', 'inline={true}'),
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
      code: getForm('Radio', 'required="Select at least one country"'),
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
      code: getForm('Checkbox'),
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
      code: getForm('Checkbox', 'label="Countries"'),
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
      code: getForm('Checkbox', 'hint="Country hint"'),
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
      code: getForm('Checkbox', 'legend={<H1>My H1 legend</H1>}'),
    },
  },
}

export const CheckboxInitialValue = Template.bind({})
CheckboxInitialValue.args = {
  ...Checkbox.args,
  initialValue: [options[0], options[1]],
}
CheckboxInitialValue.parameters = {
  docs: {
    description: {
      story: 'Checkbox group initial value',
    },
    source: {
      code: getForm(
        'Checkbox',
        `initialValue={${formatOptions([options[0], options[1]])}}`
      ),
    },
  },
}

export const CheckboxInline = Template.bind({})
CheckboxInline.args = {
  ...Checkbox.args,
  inline: true,
}
CheckboxInline.parameters = {
  docs: {
    description: {
      story: 'Checkbox group inline',
    },
    source: {
      code: getForm('Checkbox', 'inline={true}'),
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
      code: getForm('Checkbox', 'required="Choose one or more countries"'),
    },
  },
}
