import React from 'react'

import FieldDate from '../FieldDate'
import Form from '../../../Form'

const ERRORS = {
  DAY: 'Enter a valid Epoch day',
  MONTH: 'Enter a valid Epoch month',
  YEAR: 'Enter a valid Epoch year',
}

export default {
  title: 'Form/Form Elements/Date',

  parameters: {
    component: FieldDate,
  },
}

export const FieldDateDefaultValidation = () => (
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
)

FieldDateDefaultValidation.story = {
  name: 'FieldDate - default validation',
}

export const FieldDateCustomValidation = () => (
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
)

FieldDateCustomValidation.story = {
  name: 'FieldDate - custom validation',
}

export const FieldDateShortFormat = () => (
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
)

FieldDateShortFormat.story = {
  name: 'FieldDate - short format',
}

export const FieldDateReduced = () => (
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
)

FieldDateReduced.story = {
  name: 'FieldDate (reduced)',
}
