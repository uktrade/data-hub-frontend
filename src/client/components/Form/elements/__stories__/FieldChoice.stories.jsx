import React from 'react'
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

const RADIO = 'FieldChoice.Radio'
const RADIO_INLINE = 'FieldChoiceRadioInline'
const CHECKBOX = 'FieldChoice.Checkbox'
const CHECKBOX_INLINE = 'FieldChoiceCheckboxInline'

const COMPONENT_TYPE = {
  RADIO,
  RADIO_INLINE,
  CHECKBOX,
  CHECKBOX_INLINE,
}

const getCode = ({ component, props }) => `
<Form>
  <${component}
   ${props}
  />
</Form>
`

const getCodeWithComment = ({ component, props, comment }) => `
${comment} ${getCode({ component, props })}
`

const getParameters = ({ story, component, props, comment }) => ({
  docs: {
    description: {
      story,
    },
    source: {
      code: comment
        ? getCodeWithComment({
            component,
            props,
            comment,
          })
        : getCode({
            component,
            props,
          }),
    },
  },
})

const formatCodeComments = (comments) =>
  comments.map((comment) => `// ${comment.replace(/,/g, '')}`).join('\n')

const formatOptionFlat = (option) =>
  `{ value: '${option.value}', label: '${option.label}' }`

const formatOptionsFlat = (options) => options.map(formatOptionFlat)

const formatOption = (option) => `
    {
      value: '${option.value}',
      label: '${option.label}',
    }`

const formatOptions = (options) => options.map(formatOption)

const formatProps = (props) =>
  props.map((prop) => prop.replace(/,/g, '')).join('\n   ')

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

const formattedOptions = formatOptions(options)

const initialValueComments = [
  'The form will automatically set the initial values providing the name',
  "field is set within the object that's returned by a transformer.",
]

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
        component: `The <b>FieldChoice</b> component renders a group of radio buttons or checkboxes by setting the prop type to either <b>"radio"</b> or <b>"checkbox"</b>.
        The component sets the entire selected option to the form's state which is helpful on user journeys where the final page is a summary page and you need to extract a label
        (or any other field) from a previous selection to display to the user.`,
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

// Radio
export const Radio = Template.bind({})
Radio.args = { type: 'radio' }
Radio.parameters = getParameters({
  story: 'A group of 4 radio buttons',
  component: COMPONENT_TYPE.RADIO,
  props: formatProps(['name="country"', `options=[${formattedOptions}]`]),
})

export const RadioLabel = Template.bind({})
RadioLabel.args = {
  ...Radio.args,
  label: 'Where do you live',
}
RadioLabel.parameters = getParameters({
  story: 'Radio button group label',
  component: COMPONENT_TYPE.RADIO,
  props: formatProps([
    'name="country"',
    'label="Where do you live"',
    `options=[${formattedOptions}]`,
  ]),
})

export const RadioLabelAndHint = Template.bind({})
RadioLabelAndHint.args = {
  ...Radio.args,
  label: 'Where do you live',
  hint: 'Select one option',
}
RadioLabelAndHint.parameters = getParameters({
  story: 'Radio button group label and hint',
  component: COMPONENT_TYPE.RADIO,
  props: formatProps([
    'name="country"',
    'label="Where do you live"',
    'hint="Select one option"',
    `options=[${formattedOptions}]`,
  ]),
})

export const RadioLegend = Template.bind({})
RadioLegend.args = {
  ...Radio.args,
  legend: <h1>H1 legend</h1>,
}
RadioLegend.parameters = getParameters({
  story: 'Radio button group legend',
  component: COMPONENT_TYPE.RADIO,
  props: formatProps([
    'name="country"',
    'legend={<h1>H1 legend</h1>}',
    `options=[${formattedOptions}]`,
  ]),
})

export const RadioInline = Template.bind({})
RadioInline.args = {
  ...Radio.args,
  component: FieldChoiceRadioInline,
}
RadioInline.parameters = getParameters({
  story: 'Radio button group inline',
  component: COMPONENT_TYPE.RADIO_INLINE,
  props: formatProps(['name="country"', `options=[${formattedOptions}]`]),
})

export const RadioRequired = Template.bind({})
RadioRequired.args = {
  ...Radio.args,
  required: 'Select at least one country',
}
RadioRequired.parameters = getParameters({
  story:
    'Radio button group where a selection is required. Click "Save" to view an error.',
  component: COMPONENT_TYPE.RADIO,
  props: formatProps([
    'name="country"',
    'required="Select at least one country"',
    `options=[${formattedOptions}]`,
  ]),
})

export const RadioSelected = Template.bind({})
RadioSelected.args = {
  ...Radio.args,
  initialValues: {
    country: options[0],
  },
}
RadioSelected.parameters = getParameters({
  story: 'Radio button group selected',
  comment: formatCodeComments([
    ...initialValueComments,
    `For example: { country: ${formatOptionFlat(options[0])} }`,
  ]),
  component: COMPONENT_TYPE.RADIO,
  props: formatProps(['name="country"', `options=[${formattedOptions}]`]),
})

// Checkbox
export const Checkbox = Template.bind({})
Checkbox.args = {
  type: 'checkbox',
  name: 'destination',
}
Checkbox.parameters = getParameters({
  story: 'A group of 4 checkboxes.',
  component: COMPONENT_TYPE.CHECKBOX,
  props: formatProps(['name=destination', `options=[${formattedOptions}]`]),
})

export const CheckboxLabel = Template.bind({})
CheckboxLabel.args = {
  ...Checkbox.args,
  label: 'Will you be travelling to any of these countries?',
}
CheckboxLabel.parameters = getParameters({
  story: 'Checkbox group label',
  component: COMPONENT_TYPE.CHECKBOX,
  props: formatProps([
    'name=destination',
    'label="Will you be travelling to any of these countries?"',
    `options=[${formattedOptions}]`,
  ]),
})

export const CheckboxLabelAndHint = Template.bind({})
CheckboxLabelAndHint.args = {
  ...Checkbox.args,
  label: 'Will you be travelling to any of these countries?',
  hint: 'Select all that apply',
}
CheckboxLabelAndHint.parameters = getParameters({
  story: 'Checkbox group hint text',
  component: COMPONENT_TYPE.CHECKBOX,
  props: formatProps([
    'name=destination',
    'label="Will you be travelling to any of these countries?"',
    'hint="Select all that apply"',
    `options=[${formattedOptions}]`,
  ]),
})

export const CheckboxLegend = Template.bind({})
CheckboxLegend.args = {
  ...Checkbox.args,
  legend: <h1>Will you be travelling to any of these countries?</h1>,
}
CheckboxLegend.parameters = getParameters({
  story: 'Checkbox group legend',
  component: COMPONENT_TYPE.CHECKBOX,
  props: formatProps([
    'name=destination',
    'legend={<h1>Will you be travelling to any of these countries?</h1>}',
    `options=[${formattedOptions}]`,
  ]),
})

export const CheckboxInline = Template.bind({})
CheckboxInline.args = {
  ...Checkbox.args,
  component: FieldChoiceCheckboxInline,
}
CheckboxInline.parameters = getParameters({
  story: 'Checkbox group inline',
  component: COMPONENT_TYPE.CHECKBOX_INLINE,
  props: formatProps(['name=destination', `options=[${formattedOptions}]`]),
})

export const CheckboxRequired = Template.bind({})
CheckboxRequired.args = {
  ...Checkbox.args,
  required: 'Choose one or more countries',
}
CheckboxRequired.parameters = getParameters({
  story:
    'Checkbox group where a user must choose at least one country. Click "Save" to view an error.',
  component: COMPONENT_TYPE.CHECKBOX,
  props: formatProps([
    'name=destination',
    'required=Choose one or more countries',
    `options=[${formattedOptions}]`,
  ]),
})

export const CheckboxChecked = Template.bind({})
CheckboxChecked.args = {
  ...Checkbox.args,
  initialValues: {
    // Checkboxes require an array of objects
    destination: [options[0], options[1]],
  },
}
CheckboxChecked.parameters = getParameters({
  story: 'Checkbox group checked',
  component: COMPONENT_TYPE.CHECKBOX,
  props: formatProps(['name=destination', `options=[${formattedOptions}]`]),
  comment: formatCodeComments([
    ...initialValueComments,
    `For example: { destination: [${formatOptionsFlat([options[0], options[1]])}] `,
  ]),
})
