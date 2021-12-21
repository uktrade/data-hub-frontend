# Multi-step form example

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
    id="task-form-example-multi-step"
    submissionTaskName="Submit TaskForm example"
    initialValuesTaskName="Load initial values"
    initialValuesPayload="resolve"
    transformInitialValues={(initialValues) => ({
      ...initialValues,
      reject: 'yes',
    })}
    analyticsFormName="multiStepExample"
    flashMessage={(submissionTaskResult, formValues) =>
      'Form was submitted successfully'
    }
    onSuccess={(result, values) => alert(JSON.stringify({result, values}, null, 2))}
  >
    <Step name="step-1">
      <FieldInput
        name="foo"
        type="text"
        label="Foo"
        hint='Initial value shold be "Blah Blah"'
        required="Foo is required"
      />
    </Step>
    <Step name="step-2">
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
    </Step>
    <Step name="step-3">
      <FieldRadios
        name="reject"
        label="Reject"
        hint="Should the submission task reject?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
      />
    </Step>
  </TaskForm>
<DataHubProvider>
```