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
        component: `The FieldChoice component is designed to render a radio button or a checkbox by setting the prop type to either "radio" or "checkbox".
        The component sets the entire selected option (Object) to the Form's state which is helpful on user journeys where the final page is a summary page and you
        need pullout a name from a previous selection. At present, FieldRadio only writes the ID (String) to the form state.`,
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

export const RadioInitialValue = Template.bind({})
RadioInitialValue.args = {
  ...Radio.args,
  initialValue: options[1],
}

export const RadioHint = Template.bind({})
RadioHint.args = {
  ...Radio.args,
  hint: 'Country hint',
}

export const RadioLegend = Template.bind({})
RadioLegend.args = {
  ...Radio.args,
  legend: <H1>A H1 legend</H1>,
}

export const RadioInline = Template.bind({})
RadioInline.args = {
  ...Radio.args,
  inline: true,
}

export const RadioRequired = Template.bind({})
RadioRequired.args = {
  ...Radio.args,
  required: 'Select at least one country',
}

// Checkbox
export const Checkbox = Template.bind({})
Checkbox.args = {
  type: 'checkbox',
}

export const CheckboxInitialValue = Template.bind({})
CheckboxInitialValue.args = {
  ...Checkbox.args,
  initialValue: [options[1], options[2]],
}

export const CheckboxHint = Template.bind({})
CheckboxHint.args = {
  ...Checkbox.args,
  hint: 'Country hint',
}

export const CheckboxLegend = Template.bind({})
CheckboxLegend.args = {
  ...Checkbox.args,
  legend: <H1>A H1 legend</H1>,
}

export const CheckboxInline = Template.bind({})
CheckboxInline.args = {
  ...Checkbox.args,
  inline: true,
}

export const CheckboxRequired = Template.bind({})
CheckboxRequired.args = {
  ...Checkbox.args,
  required: 'Select at least one country',
}
