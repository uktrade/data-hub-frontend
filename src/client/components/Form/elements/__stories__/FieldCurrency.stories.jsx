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
      {() => (
        <>
          <FieldCurrency
            name="currency1"
            label="Estimate amount in pounds (bold label)"
            hint="For example, £1,000"
            required="Enter amount in pounds"
          />

          <FieldCurrency
            name="currency2"
            label="Estimate amount in pounds (not bold label)"
            hint="For example, £1,000"
            required="Enter amount in pounds"
            boldLabel={false}
          />
        </>
      )}
    </Form>
  ))
