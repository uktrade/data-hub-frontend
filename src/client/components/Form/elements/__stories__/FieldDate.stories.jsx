import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

import FieldDate from '../FieldDate'
import Form from '../../../Form'

import exampleReadme from '../FieldDate/example.md'
import usageReadme from '../FieldDate/usage.md'

addDecorator(withKnobs)

const ERRORS = {
  DAY: 'Enter a valid Epoch day',
  MONTH: 'Enter a valid Epoch month',
  YEAR: 'Enter a valid Epoch year',
}

storiesOf('Form/Form Elements/Date', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('FieldDate - default validation', () => (
    <Form
      id="fieldDateExample"
      analyticsFormName="fieldDateExample"
      submissionTaskName="Submit Form example"
    >
      {(form) => (
        <>
          <FieldDate
            name="date"
            label="What is your date of birth?"
            hint="For example, 01 09 2019"
            required="Enter a valid date of birth"
          />
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </Form>
  ))
  .add('FieldDate - custom validation', () => (
    <Form
      id="fieldDateExample"
      analyticsFormName="fieldDateExample"
      submissionTaskName="Submit Form example"
    >
      {(form) => (
        <>
          <FieldDate
            name="date"
            label="What date is Unix epoch?"
            hint="For example, 01 09 2019"
            required="Enter a valid Unix epoch date"
            validate={({ day, month, year }) => {
              // Contrived example
              const dayErr = day === '01' ? null : ERRORS.DAY
              const monthErr = month === '01' ? null : ERRORS.MONTH
              const yearErr = year === '1970' ? null : ERRORS.YEAR
              return dayErr || monthErr || yearErr
            }}
          />
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </Form>
  ))
  .add('FieldDate - short format', () => (
    <Form
      id="fieldDateExample"
      analyticsFormName="fieldDateExample"
      submissionTaskName="Submit Form example"
    >
      {(form) => (
        <>
          <FieldDate
            format="short"
            name="date"
            label="What is the month and year?"
            hint="For example, 09 2019"
            required="Enter a valid date"
          />
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </Form>
  ))
  .add('FieldDate (reduced)', () => (
    <Form
      id="fieldDateExample"
      analyticsFormName="fieldDateExample"
      submissionTaskName="Submit Form example"
    >
      {(form) => (
        <>
          <FieldDate
            name="date"
            label="What is the month and year?"
            hint="For example, 09 2019"
            required="Enter a valid date"
            reduced={true}
          />
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </Form>
  ))
