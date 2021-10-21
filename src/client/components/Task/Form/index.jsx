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
  analyticsFormName,
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
          // Required by the FieldDnbCompany
          // eslint-disable-next-line no-unused-vars
          setIsLoading={(isLoading) => {
            // TODO: Is the isLoading actually needed in state?
          }}
          // Required by the FieldDnbCompan
          // eslint-disable-next-line no-unused-vars
          validateForm={(fieldNames) => {
            // We are supposed to take the values, validate them and imperatively
            // set the form state so, that it renders the errors.
            // We actually don't need the fieldValues parameter.
            const { errors, touched } = validateForm(contextProps)
            props.onValidate(errors, touched)

            // We also must return a map of field names to errors
            return errors
          }}
        >
          <Task>
            {(t) => (
              <TaskLoadingBox
                name={name}
                id={id}
                // TODO: We only want to keep the spinner kept around with hard redirects
                // The value shold be falsy for React Router redirection
                when={resolved}
              >
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
                              event: `form:${analyticsFormName}:submit`,
                              ...values,
                            })
                          } else {
                            props.goForward()
                            pushAnalytics({
                              event: `form:${analyticsFormName}:next-step`,
                              currentStep,
                            })
                          }
                        } else {
                          requestAnimationFrame(() => ref.current?.focus())
                          pushAnalytics({
                            event: `form:${analyticsFormName}:errors`,
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
                      {!isEmpty(errors) && (
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
                        {actionLinks.map(({ to, href, children }, i) =>
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

/**
 * @function TaskForm
 * @description A form component which
 * - Starts a _task_ when the form is submitted
 * - Renders a {ProgressBox} overlay while the _task_ is in progress
 * - Handles the _task_ rejection by delegating it to the underlying {TaskProgressBox}
 * - Hard redirects to a specified path when the _task_ resolves
 * - Can optionally be prepopulated with initial values resolved from a _task_
 * The form has built in
 * - Error summary rendered on top of the form when there are validation errors
 * - Submit button and secondary action links
 * - Success flash message on _task_ resolution
 * - Recording Google Tag Manager events on form submission and task resolution
 * @typedef { import("./types").Props } Props
 * @param {Props} props - Refer to the ./types.d.ts file for the concrete props
 * @type {import("./types").TaskForm} TaskForm
 * */
const TaskForm = multiInstance({
  name: 'TaskForm',
  reducer,
  component: _TaskForm,
  dispatchToProps,
  actionPattern: 'TASK_FORM__',
})

export const Example = () => <TaskForm />

// TODO: This doesn't seem to be needed
TaskForm.Step = Step

export default TaskForm
