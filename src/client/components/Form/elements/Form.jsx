import React from 'react'
import PropTypes from 'prop-types'

import useFormContext from '../hooks/useFormContext'

function Form({ formAttributes, children, ...contextProps }) {
  return (
    <useFormContext.Provider {...contextProps}>
      <form
        {...formAttributes}
        noValidate={true}
        onSubmit={(e) => {
          e.preventDefault()
          contextProps.goForward()
        }}
      >
        {children}
      </form>
    </useFormContext.Provider>
  )
}

Form.propTypes = {
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  fields: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      initialValue: PropTypes.any,
      validate: PropTypes.arrayOf(PropTypes.func),
    })
  ),
  steps: PropTypes.arrayOf(PropTypes.string),
  currentStep: PropTypes.number,
  isDirty: PropTypes.bool,
  registerField: PropTypes.func.isRequired,
  deregisterField: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldError: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
  registerStep: PropTypes.func.isRequired,
  deregisterStep: PropTypes.func.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goToStepByName: PropTypes.func.isRequired,
  getStepIndex: PropTypes.func.isRequired,
  isLastStep: PropTypes.func.isRequired,
  isFirstStep: PropTypes.func.isRequired,
  getFieldState: PropTypes.func.isRequired,
  formAttributes: PropTypes.object,
  children: PropTypes.node,
}

Form.defaultProps = {
  values: {},
  touched: {},
  errors: {},
  fields: {},
  steps: [],
  currentStep: 0,
  isDirty: false,
  formAttributes: {},
  children: null,
}

export default Form
