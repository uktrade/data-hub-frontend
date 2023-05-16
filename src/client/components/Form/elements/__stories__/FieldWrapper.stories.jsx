import React from 'react'
import { H1, H2, H3 } from '@govuk-react/heading'

import Form from '../../../Form'
import FieldWrapper from '../FieldWrapper'
import FieldInput from '../FieldInput'

const testInput = (
  <FieldInput name="testField" type="text" required="Some error" />
)

export default {
  title: 'Form/Form Elements/FieldWrapper',

  parameters: {
    component: FieldWrapper,
  },
}

export const FieldWrapperLabel = () => (
  <Form
    id="fieldWrapperExample"
    analyticsFormName="fieldWrapperExample"
    submissionTaskName="Submit Form example"
    submitButtonLabel="Click to show error"
  >
    {(form) => (
      <>
        <FieldWrapper
          label="Label with bold font weight"
          name="testField"
          hint="Some hint"
          error={form.errors.testField}
        >
          {testInput}
        </FieldWrapper>
        <FieldWrapper
          legend="Label without bold font weight"
          name="testField2"
          hint="Some hint"
          error={form.errors.testField}
          boldLabel={false}
        >
          {testInput}
        </FieldWrapper>
      </>
    )}
  </Form>
)

FieldWrapperLabel.story = {
  name: 'FieldWrapper - Label',
}

export const FieldWrapperLegend = () => (
  <Form
    id="fieldWrapperExample"
    analyticsFormName="fieldWrapperExample"
    submissionTaskName="Submit Form example"
    submitButtonLabel="Click to show error"
  >
    {(form) => (
      <>
        <FieldWrapper
          legend="Legend as text"
          name="testField"
          hint="Some hint"
          error={form.errors.testField}
        >
          {testInput}
        </FieldWrapper>

        <FieldWrapper
          legend="Big Legend"
          name="testField"
          hint="Some hint"
          error={form.errors.testField}
          bigLegend={true}
        >
          {testInput}
        </FieldWrapper>

        <FieldWrapper
          legend="Legend with border"
          name="testField"
          hint="Some hint"
          showBorder={true}
          error={form.errors.testField}
        >
          {testInput}
        </FieldWrapper>

        <FieldWrapper
          legend={<H1>Legend as H1</H1>}
          name="testField"
          hint="Some hint"
          error={form.errors.testField}
        >
          {testInput}
        </FieldWrapper>

        <FieldWrapper
          legend={<H2>Legend as H2</H2>}
          name="testField"
          hint="Some hint"
          error={form.errors.testField}
        >
          {testInput}
        </FieldWrapper>

        <FieldWrapper
          legend={<H3>Legend as H3</H3>}
          name="testField"
          hint="Some hint"
          error={form.errors.testField}
        >
          {testInput}
        </FieldWrapper>
      </>
    )}
  </Form>
)

FieldWrapperLegend.story = {
  name: 'FieldWrapper - Legend',
}
