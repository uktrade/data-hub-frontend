import React from 'react'
import { storiesOf } from '@storybook/react'

import FieldCurrency from '../FieldCurrency'
import Form from '../../../Form'

storiesOf('Form/Form Elements/Currency', module)
  .addParameters({ component: FieldCurrency })
  .add('FieldCurrency - default validation', () => (
    <Form
      id="fieldCurrencyExample"
      analyticsFormName="fieldCurrencyExample"
      submissionTaskName="Submit Form example"
    >
      {(form) => (
        <>
          <FieldCurrency
            name="date"
            label="Estimate amount in pounds"
            hint="For example, £1,000"
            required="Enter amount in pounds"
          />
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </>
      )}
    </Form>
  ))
