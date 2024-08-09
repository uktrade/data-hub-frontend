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

const FieldChoiceBooleanInline = styled(FieldChoice.Boolean)`
  ${inline}
`

const RADIO = 'FieldChoice.Radio'
const RADIO_INLINE = 'FieldChoiceRadioInline'
const CHECKBOX = 'FieldChoice.Checkbox'
const CHECKBOX_INLINE = 'FieldChoiceCheckboxInline'
const BOOLEAN = 'FieldChoice.Boolean'
const BOOLEAN_INLINE = 'FieldChoiceBooleanInline'

const COMPONENT_TYPE = {
  RADIO,
  RADIO_INLINE,
  CHECKBOX,
  CHECKBOX_INLINE,
  BOOLEAN,
  BOOLEAN_INLINE,
}

const form = (component, props) =>
  `<Form ... >\n  <${component}\n    ${props}\n  />\n</Form>`

const getCode = (component, props, comment) =>
  comment ? ` ${comment}\n${form(component, props)}` : form(component, props)

const getParameters = ({ story, component, props, comment }) => ({
  docs: {
    description: {
      story,
    },
    source: {
      code: getCode(component, props, comment),
    },
  },
})

const formatCodeComments = (comments) =>
  comments
    .map(
      (comment, index) =>
        `// ${comment}${index !== comments.length - 1 ? '\n' : ''}`
    )
    .join('')

const formatOption = ({ option, flat = false }) =>
  flat
    ? `{ value: '${option.value}', label: '${option.label}' }`
    : `
     {
       value: '${option.value}',
       label: '${option.label}',
     }`

const formatOptions = ({ options, flat = false }) =>
  options.map((option) => formatOption({ option, flat }))

const formatProps = (props) =>
  props.map((prop) => prop.replace(/,/g, '')).join('\n    ')

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

const formattedOptions = formatOptions({ options })

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
        component: `The <b>FieldChoice</b> component renders a group of radio buttons or checkboxes by setting the prop type to either "radio" or "checkbox".
        The component sets the entire selected option to the form's state which is helpful on user journeys where the final page is a summary page and you need to extract a label
        (or any other field) from a previous selection to display to the user. Instead of using FieldChoice directly favour <b>FieldChoice.Radio</b>, <b>FieldChoice.Checkbox</b> or
        <b>FieldChoice.Boolean</b> where there's no need to set the type.`,
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
const formattedRadioOption = formatOption({
  option: options[0],
  flat: true,
})
RadioSelected.parameters = getParameters({
  story: 'Radio button group selected',
  comment: formatCodeComments([
    ...initialValueComments,
    `For example: { country: ${formattedRadioOption}}`,
  ]),
  component: COMPONENT_TYPE.RADIO,
  props: formatProps(['name="country"', `options=[${formattedOptions}]`]),
})

// Boolean
const booleanComment =
  "There's no need to set the options as the FieldChoice.Boolean component does this internally."

export const Boolean = Template.bind({})
Boolean.args = {
  name: 'has_changed_name',
  component: FieldChoice.Boolean,
}
Boolean.parameters = getParameters({
  story: 'A boolean radio group',
  comment: formatCodeComments([booleanComment]),
  component: COMPONENT_TYPE.BOOLEAN,
  props: formatProps(['name="has_changed_name"']),
})

export const BooleanLabel = Template.bind({})
BooleanLabel.args = {
  ...Boolean.args,
  label: 'Have you changed your name?',
}
BooleanLabel.parameters = getParameters({
  story: 'A boolean radio group with label',
  comment: formatCodeComments([booleanComment]),
  component: COMPONENT_TYPE.BOOLEAN,
  props: formatProps([
    'name="has_changed_name"',
    'label=Have you changed your name?',
  ]),
})

export const BooleanLabelAndHint = Template.bind({})
BooleanLabelAndHint.args = {
  ...Boolean.args,
  label: 'Have you changed your name?',
  hint: 'This includes changing your last name or spelling your name differently.',
}
BooleanLabelAndHint.parameters = getParameters({
  story: 'A boolean radio group with label and hint',
  comment: formatCodeComments([booleanComment]),
  component: COMPONENT_TYPE.BOOLEAN,
  props: formatProps([
    'name="has_changed_name"',
    'label="Have you changed your name?"',
    'hint="This includes changing your last name or spelling your name differently.',
  ]),
})

export const BooleanCustomOptionLabels = Template.bind({})
BooleanCustomOptionLabels.args = {
  ...Boolean.args,
  label: 'Have you changed your name?',
  yesLabel: 'Agree',
  noLabel: 'Disagree',
}
BooleanCustomOptionLabels.parameters = getParameters({
  story: 'A boolean radio group with custom option labels',
  comment: formatCodeComments([booleanComment]),
  component: COMPONENT_TYPE.BOOLEAN,
  props: formatProps([
    'name="has_changed_name"',
    'label="Have you changed your name?"',
    'yesLabel="Agree"',
    'noLabel="Disagree"',
  ]),
})

export const BooleanLegend = Template.bind({})
BooleanLegend.args = {
  ...Boolean.args,
  legend: <h1>Have you changed your name?</h1>,
}
BooleanLegend.parameters = getParameters({
  story: 'A boolean radio group with legend',
  comment: formatCodeComments([booleanComment]),
  component: COMPONENT_TYPE.BOOLEAN,
  props: formatProps([
    'name="has_changed_name"',
    'legend={<H1>Have you changed your name?</H1>}',
  ]),
})

export const BooleanInline = Template.bind({})
BooleanInline.args = {
  ...Boolean.args,
  component: FieldChoiceBooleanInline,
}
BooleanInline.parameters = getParameters({
  story: 'An inline boolean radio group',
  comment: formatCodeComments([booleanComment]),
  component: COMPONENT_TYPE.BOOLEAN_INLINE,
  props: formatProps(['name="has_changed_name"']),
})

export const BooleanRequired = Template.bind({})
BooleanRequired.args = {
  ...Boolean.args,
  required: 'Select Yes or No',
}
BooleanRequired.parameters = getParameters({
  story:
    'A boolean radio button group where a selection is required. Click "Save" to view an error.',
  comment: formatCodeComments([booleanComment]),
  component: COMPONENT_TYPE.BOOLEAN,
  props: formatProps([
    'name="has_changed_name"',
    'required="Select Yes or No"',
  ]),
})

export const BooleanSelected = Template.bind({})
const booleanOption = { value: true, label: 'Yes' }
BooleanSelected.args = {
  ...Boolean.args,
  initialValues: {
    has_changed_name: booleanOption,
  },
}
const formattedBooleanOption = formatOption({
  option: booleanOption,
  flat: true,
})
BooleanSelected.parameters = getParameters({
  story: 'A boolean radio button group selected',
  comment: formatCodeComments([
    ...initialValueComments,
    `For example: { has_changed_name: [${formattedBooleanOption}] }`,
  ]),
  component: COMPONENT_TYPE.BOOLEAN,
  props: formatProps(['name="has_changed_name"']),
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
const formattedCheckboxOptions = formatOptions({
  options: [options[0], options[1]],
  flat: true,
})
CheckboxChecked.parameters = getParameters({
  story: 'Checkbox group checked',
  component: COMPONENT_TYPE.CHECKBOX,
  props: formatProps(['name=destination', `options=[${formattedOptions}]`]),
  comment: formatCodeComments([
    ...initialValueComments,
    `For example: { destination: [${formattedCheckboxOptions}] `,
  ]),
})
