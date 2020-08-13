import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'

import useFormContext from '../hooks/useFormContext'
import ButtonLink from '../../ButtonLink'
import FormActions from './FormActions'

function Step({ name, backButton, forwardButton, children }) {
  const {
    currentStep,
    goBack,
    registerStep,
    deregisterStep,
    getStepIndex,
    isFirstStep,
    isLastStep,
  } = useFormContext()

  useEffect(() => {
    registerStep(name)
    return () => deregisterStep(name)
  }, [name])

  const index = getStepIndex(name)

  if (
    index !== currentStep ||
    index === undefined ||
    currentStep === undefined
  ) {
    return null
  }

  const renderBackButton = () => {
    if (typeof backButton === 'undefined') {
      return (
        <ButtonLink name="back" onClick={goBack}>
          Back
        </ButtonLink>
      )
    }

    if (typeof backButton === 'string') {
      return (
        <ButtonLink name="back" onClick={goBack}>
          {backButton}
        </ButtonLink>
      )
    }

    return backButton
  }

  const renderForwardButton = () => {
    if (typeof forwardButton === 'undefined') {
      return (
        <Button name="forward">{isLastStep() ? 'Submit' : 'Continue'}</Button>
      )
    }

    if (typeof forwardButton === 'string') {
      return <Button name="forward">{forwardButton}</Button>
    }

    return forwardButton
  }

  return (
    <>
      {typeof children === 'function' ? children() : children}

      <FormActions>
        {renderForwardButton()}

        {!isFirstStep() && renderBackButton()}
      </FormActions>
    </>
  )
}

Step.propTypes = {
  name: PropTypes.string.isRequired,
  backButton: PropTypes.node,
  forwardButton: PropTypes.node,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
}

Step.defaultProps = {
  backButton: undefined,
  forwardButton: undefined,
  children: null,
}

export default Step
