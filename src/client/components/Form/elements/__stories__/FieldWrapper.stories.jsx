import React from 'react'
import { storiesOf } from '@storybook/react'
import { H1, H2, H3 } from '@govuk-react/heading'

import Form from '../../../Form'
import FieldWrapper from '../FieldWrapper'
import FieldInput from '../FieldInput'

import exampleReadme from '../FieldWrapper/example.md'
import useageReadme from '../FieldWrapper/usage.md'

const testInput = (
  <FieldInput name="testField" type="text" required="Some error" />
)

storiesOf('Form/Form Elements/FieldWrapper', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: useageReadme,
    },
  })
  .add('FieldWrapper - Label', () => (
    <Form
      id="fieldWrapperExample"
      analyticsFormName="fieldWrapperExample"
      submissionTaskName="Submit Form example"
      submitButtonLabel="Click to show error"
    >
      {(form) => (
        <>
          <FieldWrapper
            label="Text"
            name="testField"
            hint="Some hint"
            error={form.errors.testField}
          >
            {testInput}
          </FieldWrapper>
        </>
      )}
    </Form>
  ))
  .add('FieldWrapper - Legend', () => (
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
  ))
