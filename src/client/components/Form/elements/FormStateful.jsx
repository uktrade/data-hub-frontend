import React from 'react'
import PropTypes from 'prop-types'
import LoadingBox from '@govuk-react/loading-box'

import useForm from '../hooks/useForm'
import Form from './Form'

const FormStateful = ({ children, formAttributes, ...contextProps }) => {
  const state = useForm(contextProps)

  const renderChildren = () => {
    if (typeof children === 'function') {
      return children(state)
    }
    return children
  }

  return (
    <Form {...formAttributes} {...state}>
      <LoadingBox loading={state.isLoading}>{renderChildren()}</LoadingBox>
    </Form>
  )
}

FormStateful.propTypes = {
  initialValues: PropTypes.object,
  initialStep: PropTypes.number,
  onSubmit: PropTypes.func,
  scrollToTop: PropTypes.bool,
  onExit: PropTypes.func,
  formAttributes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
}

FormStateful.defaultProps = {
  initialValues: {},
  initialStep: 0,
  onSubmit: undefined,
  scrollToTop: true,
  onExit: undefined,
  formAttributes: {},
}

export default FormStateful
