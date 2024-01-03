import React from 'react'

import FieldCurrency from '../FieldCurrency'
import Form from '../../../Form'

export default {
  title: 'Form/Form Elements/Currency',

  parameters: {
    component: FieldCurrency,
  },
}

export const FieldCurrencyDefaultValidation = () => (
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
)

FieldCurrencyDefaultValidation.story = {
  name: 'FieldCurrency - default validation',
}
