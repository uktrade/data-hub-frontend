import _, { camelCase, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { flushSync } from 'react-dom'

import qs from 'qs'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

import multiInstance from '../../utils/multiinstance'
import ErrorSummary from '../ErrorSummary'
import Task from '../Task'
import TaskLoadingBox from '../Task/LoadingBox'
import Resource from '../Resource/Resource'
import Wrap from '../Wrap'
import Analytics from '../Analytics'

import reducer from './reducer'
import FormActions from './elements/FormActions'
import { FormContextProvider } from './hooks'

import Effect from '../Effect'
import HardRedirect from '../HardRedirect'

import { BUTTON_COLOUR } from '../../../client/utils/colours'

const validateForm = (state) =>
  Object.values(state.fields)
    .map((field) => ({
      name: field.name,
      error: []
        .concat(field.validate)
        .map((validator) => validator(state.values?.[field.name], field, state))
        .filter(Boolean)[0],
    }))
    .filter(({ error }) => error)
    .reduce(
      (acc, { name, error }) => ({
        errors: {
          ...acc.errors,
          [name]: error,
        },
        touched: {
          ...acc.touched,
          [name]: true,
        },
      }),
      {}
    )

const _Form = ({
  // Required
  submissionTaskName,
  id,
  analyticsFormName,
  // Optional
  analyticsData,
  cancelButtonLabel = 'Cancel',
  cancelRedirectTo,
  keepValuesOnDeregister,
  initialValuesTaskName,
  initialValuesPayload,
  redirectTo,
  flashMessage,
  children,
  initialValues,
  redirectMode = 'hard',
  scrollToTopOnStep = false,
  showStepInUrl = false,
  reactRouterRedirect,
  transformInitialValues = (x) => x,
  transformPayload = (x) => x,
  submissionTaskResultToValues,
  onSuccess,
  onError,
  submitButtonLabel = 'Save',
  submitButtonColour = BUTTON_COLOUR,
  // State props
  onLoad,
  result,
  resolved,
  errors = {},
  errorStatus,
  values = {},
  touched = {},
  steps = [],
  initialStepIndex = 0,
  goToStep,
  ...props
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  const qsParams = qs.parse(location.search.slice(1))

  useEffect(() => {
    onLoad(initialValues, initialStepIndex, keepValuesOnDeregister)
  }, [])
  useEffect(() => {
    scrollToTopOnStep && window.scrollTo(0, 0)
  }, [scrollToTopOnStep, props.currentStep])
  useEffect(() => {
    if (showStepInUrl) {
      if (qsParams.step) {
        goToStep(qsParams.step || steps[initialStepIndex])
      } else {
        navigate(
          {
            search: qs.stringify({
              ...qsParams,
              step: steps[initialStepIndex],
            }),
          },
          { replace: true }
        )
      }
    }
  }, [showStepInUrl, qsParams.step, steps])

  // Update form errors after getting a response from API
  useEffect(() => {
    if (result?.errors) {
      onError(
        Object.fromEntries(
          Object.entries(result.errors).map(([k, v]) => [
            camelCase(k),
            v.join(', '),
          ])
        )
      )
      window.scrollTo({ top: 0 })
    }
  }, [result])

  // TODO: Clean up this mess
  const contextProps = {
    ...props,
    errors,
    values,
    touched,
    steps,
    goToStep,
    getStepIndex: (stepName) => {
      const index = steps?.indexOf(stepName)
      return index !== -1 ? index : null
    },
    // FIXME: These don't need to be functions
    isFirstStep: () => props?.currentStep === 0,
    isLastStep: () => !steps.length || props?.currentStep === steps?.length - 1,
    getFieldState: (fieldName, initialValue) => ({
      value: values[fieldName] ?? initialValue,
      touched: touched[fieldName] ?? false,
      error: errors[fieldName],
    }),
  }

  const ref = useRef()
  return (
    <Wrap
      with={Resource}
      when={initialValuesTaskName}
      props={{
        id,
        name: initialValuesTaskName,
        payload: initialValuesPayload,
        taskStatusProps: { dismissable: false },
      }}
    >
      {(initialValues) => (
        <Analytics>
          {(pushAnalytics) => {
            const analytics = (action, extra) =>
              pushAnalytics({
                category: 'Form interaction',
                action,
                label: analyticsFormName,
                extra,
              })
            return (
              <>
                <FormContextProvider
                  {...contextProps}
                  // FIXME: This needs to be called also when the initial values load
                  //        so we need to use the Effect component somewhere above
                  registerField={props.registerField(initialValues)}
                  // Required by the FieldDnbCompany
                  // eslint-disable-next-line no-unused-vars
                  setIsLoading={(isLoading) => {
                    // TODO: Is the isLoading actually needed in state?
                  }}
                  goBack={() => {
                    // Opt out of React v18 batching.
                    flushSync(() => props.goBack())
                    analytics('previous step', {
                      currentStep: props.currentStep,
                    })
                    if (showStepInUrl) {
                      navigate({
                        search: qs.stringify({
                          ...qsParams,
                          step: steps[props.currentStep - 1],
                        }),
                      })
                    }
                  }}
                  resetFields={(values = {}) => {
                    props.resetFields({
                      ...initialValues,
                      ...values,
                    })
                  }}
                  validateForm={(fieldNamesToValidate) => {
                    // This method is supposed to validate only the fields whose names
                    // are listed in fieldNamesToValidate,
                    // or all fields if fieldNamesToValidate is empty, and
                    // set the form state so, that it renders the errors.
                    const { errors, touched } = validateForm({
                      ...contextProps,
                      fields: fieldNamesToValidate?.length
                        ? _.pick(contextProps.fields, fieldNamesToValidate)
                        : contextProps.fields,
                    })
                    props.onValidate(errors, touched)

                    // We also must return a map of field names to errors
                    return errors
                  }}
                >
                  <Task>
                    {(t) => {
                      const submissionTask = t(submissionTaskName, id)
                      return (
                        <TaskLoadingBox
                          name={submissionTaskName}
                          id={id}
                          when={
                            redirectMode === 'hard' && redirectTo && resolved
                          }
                        >
                          <form
                            autoComplete="off"
                            noValidate={true}
                            onSubmit={(e) => {
                              e.preventDefault()
                              const { errors, touched } =
                                validateForm(contextProps)
                              props.onValidate(errors, touched)

                              if (isEmpty(errors)) {
                                if (contextProps.isLastStep()) {
                                  submissionTask.start({
                                    payload: transformPayload(values),
                                    onSuccessDispatch: 'FORM__RESOLVED',
                                  })

                                  analytics('Submit')
                                } else {
                                  props.goForward()
                                  analytics('Next step', {
                                    currentStep: props.currentStep,
                                  })
                                  if (showStepInUrl) {
                                    navigate({
                                      search: qs.stringify({
                                        ...qsParams,
                                        step: steps[props.currentStep + 1],
                                      }),
                                    })
                                  }
                                }
                              } else {
                                requestAnimationFrame(() =>
                                  ref.current?.focus()
                                )
                                analytics('Validation errors', { errors })
                              }
                            }}
                          >
                            <HardRedirect>
                              {(hardRedirect) => (
                                <Effect
                                  dependencyList={[
                                    submissionTaskName,
                                    id,
                                    resolved,
                                    result,
                                  ]}
                                  effect={() => {
                                    if (resolved && !result?.errors) {
                                      analytics(
                                        'Submission request success',
                                        analyticsData && analyticsData(values)
                                      )
                                      if (flashMessage) {
                                        const message = flashMessage(
                                          result,
                                          values
                                        )
                                        props.writeFlashMessage(message)
                                      }
                                      redirectMode === 'soft' &&
                                        redirectTo &&
                                        navigate(redirectTo(result, values))
                                      onSuccess &&
                                        onSuccess(result, values, {
                                          flashMessage: props.writeFlashMessage,
                                          hardRedirect,
                                          softRedirect: navigate,
                                        })
                                      props.resetResolved()
                                    }
                                  }}
                                />
                              )}
                            </HardRedirect>
                            <Effect
                              dependencyList={[initialValues]}
                              effect={() => {
                                if (initialValues) {
                                  onLoad(
                                    transformInitialValues(initialValues),
                                    initialStepIndex
                                  )
                                }
                              }}
                            />
                            {submissionTaskResultToValues && result && (
                              <Effect
                                dependencyList={[result]}
                                effect={() => {
                                  props.setValues(
                                    submissionTaskResultToValues?.(result)
                                  )
                                }}
                              />
                            )}
                            <Effect
                              dependencyList={[submissionTask.hasError]}
                              effect={() => {
                                if (submissionTask.hasError) {
                                  analytics('Submission request error', {
                                    error: submissionTask.errorMessage,
                                  })
                                }
                              }}
                            />
                            {redirectMode === 'hard' &&
                              redirectTo &&
                              resolved && (
                                <HardRedirect
                                  to={redirectTo(result, values)}
                                  when={resolved}
                                />
                              )}
                            {!isEmpty(errors) && (
                              <ErrorSummary
                                ref={ref}
                                // TODO: Rewrite the tests that rely on this and remove it
                                id="form-errors"
                                data-test="summary-form-errors"
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
                            {/*
                            We don't want to render the submit button when the form
                            has multiple steps as the steps come with a built-in submit button
                            */}
                            {!steps.length && (
                              <FormActions>
                                <Button
                                  buttonColour={submitButtonColour}
                                  data-test="submit-button"
                                >
                                  {submitButtonLabel}
                                </Button>
                                {cancelRedirectTo && (
                                  <Link
                                    href={cancelRedirectTo()}
                                    data-test="cancel-button"
                                  >
                                    {cancelButtonLabel}
                                  </Link>
                                )}
                              </FormActions>
                            )}
                          </form>
                        </TaskLoadingBox>
                      )
                    }}
                  </Task>
                </FormContextProvider>
              </>
            )
          }}
        </Analytics>
      )}
    </Wrap>
  )
}

// TODO: Clean up this mess
const dispatchToProps = (dispatch) => ({
  onLoad: (initialValues, initialStepIndex, keepValuesOnDeregister) =>
    dispatch({
      type: 'FORM__LOADED',
      initialValues,
      initialStepIndex,
      keepValuesOnDeregister,
    }),
  resetResolved: () =>
    dispatch({
      type: 'FORM__RESET_RESOLVED',
    }),
  registerField: (initialValues) => (field) =>
    dispatch({
      type: 'FORM__FIELD_REGISTER',
      field: { initialValue: initialValues?.[field.name], ...field },
    }),
  deregisterField: (fieldName) =>
    dispatch({
      type: 'FORM__FIELD_DEREGISTER',
      fieldName,
    }),
  resetFields: (values) =>
    dispatch({
      type: 'FORM__FIELDS__RESET',
      values,
    }),
  setFieldValue: (fieldName, fieldValue) =>
    dispatch({
      type: 'FORM__FIELD_SET_VALUE',
      fieldName,
      fieldValue,
    }),
  setValues: (values) =>
    dispatch({
      type: 'FORM__FIELD_SET_VALUES',
      values,
    }),
  setFieldTouched: (fieldName) =>
    dispatch({
      type: 'FORM__FIELD_TOUCHED',
      fieldName,
    }),
  onValidate: (errors, touched) =>
    dispatch({
      type: 'FORM__VALIDATE',
      errors,
      touched,
    }),
  onError: (errors) =>
    dispatch({
      type: 'FORM__ERRORED',
      errors,
    }),
  goForward: (values) =>
    dispatch({
      type: 'FORM__FORWARD',
      values,
    }),
  goBack: () =>
    dispatch({
      type: 'FORM__BACK',
    }),
  goToStep: (stepName) => {
    dispatch({
      type: 'FORM__GO_TO_STEP',
      stepName,
    })
  },
  registerStep: (stepName) =>
    dispatch({
      type: 'FORM__STEP_REGISTER',
      stepName,
    }),
  deregisterStep: (stepName) =>
    dispatch({
      type: 'FORM__STEP_DEREGISTER',
      stepName,
    }),
  writeFlashMessage: (message) => {
    if (!message) return

    if (typeof message === 'string') {
      dispatch({
        type: 'FLASH_MESSAGE__WRITE_TO_SESSION',
        messageType: 'success',
        message,
      })
      return
    }

    const [heading, body, messageType] = message
    dispatch({
      type: 'FLASH_MESSAGE__WRITE_TO_SESSION',
      messageType,
      message: [heading, body],
    })
  },
})

/**
 * @function Form
 * @description A form component which
 * - Starts a _task_ when the form is submitted
 * - Renders a {ProgressBox} overlay while the _task_ is in progress
 * - Handles the _task_ rejection by delegating it to the underlying {TaskProgressBox}
 * - Can optionally be prepopulated with initial values resolved from a _task_
 * The form has built in
 * - Error summary rendered on top of the form when there are validation errors
 * - Submit button and secondary action links
 * - Success flash message on _task_ resolution
 * - Redirection after the _submission task_ resolves
 * - Recording Google Tag Manager events
 * @type {import("./types").Form} Form
 * @typedef { import("./types").Props } Props
 * @param {Props} props
 * @param {string} props.id - A unique component instance ID
 * @param {string} props.analyticsFormName - The name of the form that will be
 * used in the Google Analytics events
 * @param {Props['analyticsData']} props.analyticsData - A function which takes
 * the values of the form as an argument, and which returns an object
 * containing additional - non-sensitive - data to be passed to google analytics.
 * @param {Props['cancelRedirectTo']} props.cancelRedirectTo - A function which
 * returns a URL to redirect to when the cancel button is clicked. If unset the
 * cancel button will not display.
 * @param {Props['cancelButtonLabel']} props.cancelButtonLabel - The content to
 * display within the react button, defaults to 'Cancel'.
 * @param {Props['submissionTaskName']} props.submissionTaskName - Name of the
 * task that should be started when the form is submitted. The task will receive
 * the form values as payload.
 * @param {Props['onSuccess']} [props.onSuccess] - A function that will be
 * called when the _submission task_ resolves. The function will receive the
 * task result as its first, and the form values as its second argument. The
 * third argument can be an object containing the 3 actions which may result
 * from a form submission: `hardRedirect`, `softRedirect` and `flashMessage`.
 * @param {Props['redirectTo']} [props.redirectTo] - A function which should
 * convert the result of the submission task and the submitted form values into
 * a URL path to which the user should be redirected when the submission task
 * resolves.
 * @param {Props['redirectMode']} [props.redirectMode='hard'] - The component
 * supports a _hard_ and _soft_ redirection modes. The _hard_ mode alters
 * `window.location.href`, the _soft_ mode uses React-Router.
 * @param {Props['flashMessage']} [props.flashMessage] - A function which should
 * convert the result of the submission task and the submitted form values into
 * a flash message text or a tuple of `[heading, body, type]`, which will be used as
 * a flash message when the submission task resolves.
 * @param {Props['initialValues']} [props.initialValues] - An object mapping
 * field names to their initial values.
 * @param {Props['initialValuesTaskName']} [props.initialValuesTaskName] -
 * Name of the task that shoud be used to resolve the initial form field values.
 * The task should resolve with an object mapping field names to their initial
 * values.
 * @param {any} [props.initialValuesPayload] - An optional payload for the
 * initial values task.
 * @param {Props['transformInitialValues']} [props.transformInitialValues] -
 * An function which takes the result of the resolved initial values
 * task and should return an object mapping field names to their initial values.
 * You can use this mechanism to mix in values comming from elsewhere than the
 * initial values task.
 * @param {Props['transformPayload']} [props.transformPayload] -
 * An optional function which takes the form values map as its only argument and
 * whose return value will be used as the payload of the submission task.
 * You can use this to mix in values into the payload which are not coming from
 * the form fields.
 * @param {Props['submitButtonLabel']} [props.submitButtonLabel='Save'] -
 * The label of the submit button.
 * @param {Props['submitButtonColour']} [props.submitButtonColour=BUTTON_COLOUR] -
 * The colour of the submit button.
 * @param {Props['children']} [props.children] - The form fields should be
 * passed as children. Note that the form communicates with it's fields
 * through the context it provides to the {useFormContext} hook, which is used
 * directly, but mostly indirectly through the {useField} hook in the various
 * form fields. The context exposes a vast imperative interface of methods which
 * is not documented yet. The form optionally accepts a function as a child,
 * which will be passed the whole context provided by the form as it's only
 * argument and should return React vdom containing form fields.
 * @param {Props['initialStepIndex']} [props.initialStepIndex] - An optional integer
 * representing the index of the step which the user will land on when the form
 * is rendered, if the form has multiple steps. This is then set as the currentStep
 * property in the form's state.
 * @param {Props['scrollToTopOnStep']} [props.scrollToTopOnStep] - Whether or not page
 * should scroll to the top when navigating between steps.
 * @param {Props['submissionTaskResultToValues']} [props.submissionTaskResultToValues] -
 * Use this to update form values with the submission task result.
 * It will be called with the submission task result and should return an object
 * mapping field names to their values. If not set, the task result will be ignored.
 * */
const Form = multiInstance({
  name: 'Form',
  reducer,
  component: _Form,
  dispatchToProps,
  actionPattern: 'FORM__',
})

Form.propTypes = {
  id: PropTypes.string.isRequired,
  analyticsFormName: PropTypes.string.isRequired,
  analyticsData: PropTypes.func,
  cancelRedirectTo: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  cancelButtonLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  submissionTaskName: PropTypes.string.isRequired,
  submitButtonLabel: PropTypes.string,
  redirectTo: PropTypes.func,
  redirectMode: PropTypes.oneOf(['hard', 'soft']),
  flashMessage: PropTypes.func,
  initialValuesTaskName: PropTypes.string,
  initialValues: PropTypes.object,
  keepValuesOnDeregister: PropTypes.bool,
  transformInitialValues: PropTypes.func,
  transformPayload: PropTypes.func,
  initialStepIndex: PropTypes.number,
  scrollToTopOnStep: PropTypes.bool,
}

export default Form
