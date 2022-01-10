Rejected initial values task
=========

The `Form` can resolve its initial values with the _task_ mechanism.
This example demonstrates the rejection of the initial values task.

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
  'Submit Form example': (formValues, formId) =>
    new Promise((resolve, reject) =>
      formValues.reject === 'yes'
        ? setTimeout(reject, 2000, 'You broke the internet!')
        : setTimeout(resolve, 2000, {
          task: 'result',
        })
    ),
}}>  
  <Form
    id="task-form-example-reject-initial-values"
    initialValuesTaskName="Load initial values"
    submissionTaskName="Submit Form example"
    analyticsFormName="formExample"
    redirectTo={(submissionTaskResult, formValues) => '#'}
    flashMessage={(submissionTaskResult, formValues) => 'Form was submitted successfully'}
  >
    <FieldInput name="foo" type="text" label="Foo"/>
    <FieldSelect name="bar" label="Bar" options={[
      {label: 'A', value: 'a'},
      {label: 'B', value: 'b'},
      {label: 'C', value: 'c'},
    ]}/>
  </Form>
<DataHubProvider>
```