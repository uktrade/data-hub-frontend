import React from 'react'

import Form from '../../../../../client/components/Form'
import StepInteractionType from './StepInteractionType'
import StepInteractionDetails from './StepInteractionDetails'

const onSubmit = () => {}

const AddInteractionForm = (props) => (
  <Form id="add-interaction-form" onSubmit={onSubmit}>
    <>
      <Form.Step name="interaction_type">
        {() => <StepInteractionType />}
      </Form.Step>

      <Form.Step name="interaction_details" forwardButton="Add interaction">
        {() => <StepInteractionDetails {...props} />}
      </Form.Step>
    </>
  </Form>
)

AddInteractionForm.propTypes = StepInteractionDetails.propTypes

export default AddInteractionForm
