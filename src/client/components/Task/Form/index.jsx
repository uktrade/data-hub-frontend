/* eslint-disable prettier/prettier */
import React, { useRef } from 'react'
import { isEmpty } from 'lodash'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import * as ReactRouter from 'react-router-dom'

import multiInstance from '../../../utils/multiinstance'
import { ErrorSummary } from '../..'
import Task from '..'
import TaskLoadingBox from '../LoadingBox'
import Resource from '../../Resource'
import HardRedirect from '../../HardRedirect'
import Wrap from '../../Wrap'
import FlashMessage from '../../FlashMessage'
import Analytics from '../../Analytics'

import reducer from './reducer'
import FormActions from '../../Form/elements/FormActions'
import { FormContextProvider } from '../../Form/hooks'
import Step from '../../Form/elements/Step'

import { validateForm } from '../../Form/MultiInstanceForm'

const _TaskForm = ({
  // Required
  name,
  id,
  analyticsEventName,
  // Optional
  initialValuesTaskName,
  redirectTo,
  flashMessage,
  children,
  // TODO: Allow for react router redirection
  reactRouterRedirect,
  transformInitialValues = (x) => x,
  transformPayload = (x) => x,
  submitButtonLabel = 'Save',
  actionLinks = [],
  // State props
  result,
  resolved,
  errors = {},
  values = {},
  touched = {},
  steps = [],
  currentStep,
  hardRedirect,
  ...props
}) => {
  // TODO: Clean up this mess
  const contextProps = {
    ...props,
    errors,
    values,
    touched,
    steps,
    getStepIndex: (stepName) => {
      const index = steps?.indexOf(stepName)
      return index !== -1 ? index : null
    },
    isFirstStep: () => props?.currentStep === 0,
    isLastStep: () => !steps.length || props?.currentStep === steps?.length - 1,
    getFieldState: (fieldName) => ({
      value: values[fieldName] ?? '',
      touched: touched[fieldName] ?? false,
      error: errors[fieldName],
    }),
  }

  const ref = useRef()

  return (
    <Wrap
      with={Resource}
      when={initialValuesTaskName}
      props={{ id, name: initialValuesTaskName }}
    >
      {(initialValues = {}) => (
        <FormContextProvider
          {...contextProps}
          registerField={props.registerField(
            transformInitialValues(initialValues)
          )}
        >
          <Task>
            {(t) => (
              <TaskLoadingBox name={name} id={id}>
                <Analytics>
                  {(pushAnalytics) => (
                    <form
                      noValidate={true}
                      onSubmit={(e) => {
                        e.preventDefault()
                        const { errors, touched } = validateForm(contextProps)
                        props.onValidate(errors, touched)

                        if (isEmpty(errors)) {
                          if (contextProps.isLastStep()) {
                            t(name, id).start({
                              payload: transformPayload(values),
                              onSuccessDispatch: 'TASK_FORM__RESOLVED',
                            })

                            pushAnalytics({
                              event: `form:${analyticsEventName}:submit`,
                              ...values,
                            })
                          } else {
                            props.goForward()
                            pushAnalytics({
                              event: `form:${analyticsEventName}:next-step`,
                              currentStep,
                            })
                          }
                        } else {
                          requestAnimationFrame(() => ref.current?.focus())
                          pushAnalytics({
                            event: `form:${analyticsEventName}:errors`,
                            ...errors,
                          })
                        }
                      }}
                    >
                      <HardRedirect
                        to={redirectTo(result, values)}
                        when={resolved}
                      />
                      <FlashMessage
                        type="success"
                        when={resolved}
                        context={[result, values]}
                        template={(context) => flashMessage(...context)}
                      />
                      {(!isEmpty(errors)) && (
                        <ErrorSummary
                          ref={ref}
                          // TODO: Rewrite the tests that rely on this and remove it
                          id="form-errors"
                          errors={Object.entries(errors).map(
                            ([name, error]) => ({
                              targetName: name,
                              text: error,
                            })
                          )}
                        />
                      )}
                      {typeof children === 'function'
                        ? children(contextProps)
                        : children}
                      <FormActions>
                        <Button>{submitButtonLabel}</Button>
                        {actionLinks.map(({to, href, children}, i) =>
                          to ? (
                            <ReactRouter.Link key={i} to={to}>
                              {children}
                            </ReactRouter.Link>
                          ) : (
                            <Link key={i} href={href}>
                              {children}
                            </Link>
                          )
                        )}
                      </FormActions>
                    </form>
                  )}
                </Analytics>
              </TaskLoadingBox>
            )}
          </Task>
        </FormContextProvider>
      )}
    </Wrap>
  )
}

// TODO: Clean up this mess
const dispatchToProps = (dispatch) => ({
  registerField: (initialValues) => (field) =>
    dispatch({
      type: 'TASK_FORM__FIELD_REGISTER',
      field: { ...field, initialValue: initialValues[field.name] },
    }),
  deregisterField: (fieldName) =>
    dispatch({
      type: 'TASK_FORM__FIELD_DEREGISTER',
      fieldName,
    }),
  setFieldValue: (fieldName, fieldValue) =>
    dispatch({
      type: 'TASK_FORM__FIELD_SET_VALUE',
      fieldName,
      fieldValue,
    }),
  setFieldTouched: (fieldName) =>
    dispatch({
      type: 'TASK_FORM__FIELD_TOUCHED',
      fieldName,
    }),
  onValidate: (errors, touched) =>
    dispatch({
      type: 'TASK_FORM__VALIDATE',
      errors,
      touched,
    }),
  goForward: (values) =>
    dispatch({
      type: 'TASK_FORM__FORWARD',
      values,
    }),
  goBack: () =>
    dispatch({
      type: 'TASK_FORM__BACK',
    }),
  registerStep: (stepName) =>
    dispatch({
      type: 'TASK_FORM__STEP_REGISTER',
      stepName,
    }),
  deregisterStep: (stepName) =>
    dispatch({
      type: 'TASK_FORM__STEP_DEREGISTER',
      stepName,
    }),
})

/** @type {import("./types").TaskForm} TaskForm */
const TaskForm = multiInstance({
  name: 'TaskForm',
  reducer,
  component: _TaskForm,
  dispatchToProps,
  actionPattern: 'TASK_FORM__',
})

export const Example = () =>
  <TaskForm/>

// TODO: This doesn't seem to be needed
TaskForm.Step = Step

export default TaskForm
