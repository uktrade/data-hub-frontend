import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions/dist'
import { withKnobs } from '@storybook/addon-knobs'
import Button from '@govuk-react/button'

import FieldDate from '../FieldDate'
import FormStateful from '../../FormStateful'

import exampleReadme from '../FieldDate/example.md'
import usageReadme from '../FieldDate/usage.md'

addDecorator(withKnobs)

const ERRORS = {
  DAY: 'Enter a valid Epoch day',
  MONTH: 'Enter a valid Epoch month',
  YEAR: 'Enter a valid Epoch year',
}

storiesOf('Forms/Date', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('FieldDate - default validation', () => (
    <FormStateful onSubmit={action('onSubmit')}>
      {(form) => (
        <>
          <FieldDate
            name="date"
            label="What is your date of birth?"
            hint="For example, 01 09 2019"
            required="Enter a valid date of birth"
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
  .add('FieldDate - custom validation', () => (
    <FormStateful onSubmit={action('onSubmit')}>
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
          <Button>Submit</Button>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
  .add('FieldDate - short format', () => (
    <FormStateful onSubmit={action('onSubmit')}>
      {(form) => (
        <>
          <FieldDate
            format="short"
            name="date"
            label="What is the month and year?"
            hint="For example, 09 2019"
            required="Enter a valid date"
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
  .add('FieldDate (reduced)', () => (
    <FormStateful onSubmit={action('onSubmit')}>
      {(form) => (
        <>
          <FieldDate
            name="date"
            label="What is the month and year?"
            hint="For example, 09 2019"
            required="Enter a valid date"
            reduced={true}
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
  .add('FieldDate (IE 11)', () => (
    <FormStateful onSubmit={action('onSubmit')}>
      {(form) => (
        <>
          <FieldDate
            name="date"
            label="What is the month and year?"
            hint="For example, 09 2019"
            required="Enter a valid date"
            isIE={true}
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
