import React from 'react'

import { useFormContext } from '../../../../client/components/Form/hooks'
import { Step, FieldInput } from '../../../components'
import { steps } from './constants'

const SupportProvidedStep = () => {
  // eslint-disable-next-line no-unused-vars
  const { values } = useFormContext()
  return (
    <Step name={steps.SUPPORT_PROVIDED}>
      <h1>Support provided</h1>
      <FieldInput name="test3" label="Test3" type="text" />
    </Step>
  )
}

export default SupportProvidedStep
