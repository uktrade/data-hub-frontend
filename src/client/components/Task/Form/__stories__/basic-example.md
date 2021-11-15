# A basic TaskForm example

This is a basic example of all the capabilities of `TaskForm`. It:

- Can resolve initial values for its fields with a _task_
- Will start a task when the form is submitted with a map of field values sent
  as a payload to the task
- Renders a flash message when the _submission task_ resolves
- Hard-redirects when when the _submission task_ resolves
- Creates analytics events on submission, step advancement and submission task
  rejection/resolution

```jsx
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
  <TaskForm
    id="task-form-example-resolve-initial-values"
    submissionTaskName="Submit TaskForm example"
    initialValuesTaskName="Load initial values"
    initialValuesPayload="resolve"
    transformInitialValues={initialValues => ({...initialValues, reject: 'yes'})}
    analyticsFormName="task-form-example"
    redirectTo={(submissionTaskResult, formValues) => '#' + JSON.stringify({submissionTaskResult, formValues})}
    flashMessage={(submissionTaskResult, formValues) => 'Form was submitted successfully'}
  >
    <FieldInput
      name="foo"
      type="text"
      label="Foo"
      hint='Initial value shold be "Blah Blah"'
    />
    <FieldSelect name="bar" label="Bar"  hint='Initial value shold be "B".' options={[
      {label: 'A', value: 'a'},
      {label: 'B', value: 'b'},
      {label: 'C', value: 'c'},
    ]}/>
    <FieldRadios
      name="reject"
      label="Reject"
      hint="Should the submission task reject?"
      options={[
        {label: 'Yes', value: 'yes'},
        {label: 'No', value: 'no'},
      ]}
    />
    <p>
      This example redirects to the same path with the result of the submission
      task together with the submitted form values JSON serialized in the
      URL fragment.
    </p>
    <p>
      Note that the expected result of a resolved submission is a hard
      redirection, which can only be seen in Storybook when the canvas
      is open in it's own tab.
    </p>
    <p>
      The form stays in the progress state until the next page is loaded
    </p>
  </TaskForm>
<DataHubProvider>
```