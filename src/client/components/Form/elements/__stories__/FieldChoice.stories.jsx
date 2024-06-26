import React from 'react'
import { H1 } from '@govuk-react/heading'

import FieldChoice from '../FieldChoice'
import Form from '../..'

const options = [
  {
    value: '1',
    label: 'England',
  },
  {
    value: '2',
    label: 'Wales',
  },
  {
    value: '3',
    label: 'Scotland',
  },
  {
    value: '4',
    label: 'Northern Ireland',
  },
]

const formatOptions = (options) =>
  options
    .map((option) => `{ value: '${option.value}', label: '${option.label}' }`)
    .join(', ')

export default {
  title: 'Form/Form Elements/FieldChoice',
  component: FieldChoice,
  args: {
    options,
    label: 'Countries',
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

// Radio
export const Radio = Template.bind({})
Radio.args = {
  type: 'radio',
}
Radio.parameters = {
  docs: {
    description: {
      story: 'A group of 4 radio buttons with a label.',
    },
    source: {
      code: `<FieldChoice.Radio name="country" label="Countries" options={${formatOptions(options)}}/>`,
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
      story: 'A group of 4 radio buttons where the first radio is preselected.',
    },
    source: {
      code: `<FieldChoice.Radio ... initialValue={${formatOptions([options[0]])}}} />`,
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
      story: 'A group of 4 radio buttons with a hint.',
    },
    source: {
      code: `<FieldChoice.Radio ... hint="Country hint" />`,
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
      story: 'A group of 4 radio buttons with a H1 legend.',
    },
    source: {
      code: `<FieldChoice.Radio ... legend={<H1>My H1 legend</H1>} />`,
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
      story: 'A group of 4 inline radio buttons.',
    },
    source: {
      code: `<FieldChoice.Radio ... inline={true} />`,
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
        'A group of 4 inline radio buttons where a selection is mandatory. Click save to view the validation error message.',
    },
    source: {
      code: `<FieldChoice.Radio ... required="Select at least one country" />`,
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
      story: 'A group of 4 checkboxes with a label.',
    },
    source: {
      code: `<FieldChoice.Checkbox name="country" label="Countries" options={${formatOptions(options)}}/>`,
    },
  },
}

export const CheckboxInitialValue = Template.bind({})
CheckboxInitialValue.args = {
  ...Checkbox.args,
  initialValue: [options[1], options[2]],
}
CheckboxInitialValue.parameters = {
  docs: {
    description: {
      story:
        'A group of 4 checkboxes where the second and third checkboxes are preselected.',
    },
    source: {
      code: `<FieldChoice.Checkbox ... initialValue={${formatOptions([options[1], options[2]])}} />`,
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
      story: 'Checkboxes with a hint.',
    },
    source: {
      code: `<FieldChoice.Checkbox ... hint="Country hint" />`,
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
      story: 'Checkboxes with a H1 legend.',
    },
    source: {
      code: `<FieldChoice.Checkbox ... legend={<H1>My H1 legend</H1>} />`,
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
      story: 'Inline checkboxes.',
    },
    source: {
      code: `<FieldChoice.Checkbox ... inline={true} />`,
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
        'Four checkboxes where a user must choose one or more. Click save to view the validation error message.',
    },
    source: {
      code: `<FieldChoice.Checkbox ... required="Choose one or more countries" />`,
    },
  },
}
