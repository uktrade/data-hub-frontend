# Soft redirect

The `TaskForm` component supports a _hard_ and _soft_ redirection mode, which
you can control with the `redirectMode` prop.
The default _hard_ mode redirects by altering `window.location.href`, the
_soft_ mode uses React-Router.

This example demonstrates the _soft_ (React-Router) redirection.

```jsx
import { Switch, Route, Link } from 'react-router-dom'

<DataHubProvider tasks={{
  'Load initial values': (payload, formId) =>
    new Promise((resolve, reject) =>
      payload === 'reject'
        ? setTimeout(reject, 2000, 'You broke the internet!')
        : setTimeout(resolve, 2000, {
          foo: 'Blah blah',
          bar: 'b',
        })
    ),
  'Submit TaskForm example': (formValues, formId) =>
    new Promise((resolve, reject) =>
      formValues.reject === 'yes'
        ? setTimeout(reject, 2000, 'You broke the internet!')
        : setTimeout(resolve, 2000, {
          task: 'result',
        })
    ),
}}>  
  <Switch>
    <Route path="/iframe.html">
      <TaskForm
        id="task-form-example-resolve-initial-values"
        submissionTaskName="Submit TaskForm example"
        initialValuesTaskName="Load initial values"
        initialValuesPayload="resolve"
        redirectMode="soft"
        transformInitialValues={(initialValues) => ({
          ...initialValues,
          reject: 'yes',
        })}
        analyticsFormName="task-form-example"
        redirectTo={(submissionTaskResult, formValues) => '/success'}
        // eslint-disable-next-line no-unused-vars
        flashMessage={(submissionTaskResult, formValues) =>
          'Form was submitted successfully'
        }
      >
        <FieldInput
          name="foo"
          type="text"
          label="Foo"
          hint='Initial value shold be "Blah Blah"'
          required="Foo is required"
        />
        <FieldSelect
          name="bar"
          label="Bar"
          hint='Initial value shold be "B".'
          required="Bar is required"
          options={[
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
            { label: 'C', value: 'c' },
          ]}
        />
        <FieldRadios
          name="reject"
          label="Reject"
          hint="Should the submission task reject?"
          options={[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]}
        />
      </TaskForm>
    </Route>
    <Route path="/success">
      The submission task resolved
      <br/>
      <Link to="/iframe.html">Back to form</Link>
    </Route>
  </Switch>
<DataHubProvider>
```