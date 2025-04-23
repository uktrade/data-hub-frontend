import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import { kebabCase } from 'lodash'

import { useFormContext } from '../hooks'
import ButtonLink from '../../ButtonLink'
import FormActions from './FormActions'
import AccessibleLink from '../../Link'

function Step({
  name,
  backButton,
  forwardButton,
  cancelUrl,
  submitButtonLabel = 'Submit',
  children,
}) {
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
        <ButtonLink data-test="back" name="back" onClick={goBack}>
          Back
        </ButtonLink>
      )
    }

    if (typeof backButton === 'string') {
      return (
        <ButtonLink
          data-test={kebabCase(backButton)}
          name="back"
          onClick={goBack}
        >
          {backButton}
        </ButtonLink>
      )
    }

    return backButton
  }

  const renderForwardButton = () => {
    if (typeof forwardButton === 'undefined') {
      const label = isLastStep() ? submitButtonLabel : 'Continue'
      return (
        <Button data-test={kebabCase(label.toLowerCase())} name="forward">
          {label}
        </Button>
      )
    }

    if (typeof forwardButton === 'string') {
      return <Button name="forward">{forwardButton}</Button>
    }

    return forwardButton
  }

  const renderCancelLink = () => (
    <AccessibleLink data-test="cancel-link" href={cancelUrl}>
      Cancel
    </AccessibleLink>
  )

  return (
    <>
      {typeof children === 'function' ? children() : children}

      <FormActions>
        {renderForwardButton()}

        {!isFirstStep() && renderBackButton()}
        {isFirstStep() && cancelUrl && renderCancelLink()}
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

export default Step
