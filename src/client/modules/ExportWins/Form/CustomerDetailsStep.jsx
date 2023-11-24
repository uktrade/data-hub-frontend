import React from 'react'

import { useFormContext } from '../../../../client/components/Form/hooks'
import { Step, FieldInput } from '../../../components'
import { steps } from './constants'

const CustomerDetailsStep = () => {
  // eslint-disable-next-line no-unused-vars
  const { values } = useFormContext()
  return (
    <Step name={steps.CUSTOMER_DETAILS}>
      <h1>Customer details</h1>
      <FieldInput name="test1" label="Test 1" type="text" />
    </Step>
  )
}

export default CustomerDetailsStep
