import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { H1, H2, H3 } from '@govuk-react/heading'
import Button from '@govuk-react/button'

import FormStateful from '../../FormStateful'
import FieldWrapper from '../FieldWrapper'
import FieldInput from '../FieldInput'

import exampleReadme from '../FieldWrapper/example.md'
import useageReadme from '../FieldWrapper/usage.md'

addDecorator(withKnobs)

const testInput = (
  <FieldInput name="testField" type="text" required="Some error" />
)

storiesOf('Forms', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: useageReadme,
    },
  })
  .add('FieldWrapper - Label', () => (
    <FormStateful>
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

          <Button>Click to show error</Button>
        </>
      )}
    </FormStateful>
  ))
  .add('FieldWrapper - Legend', () => (
    <FormStateful>
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

          <Button>Click to show error</Button>
        </>
      )}
    </FormStateful>
  ))
