# Initial values as prop

The initial values of `TaskForm` can also be set with the `initialValues` prop.

```jsx
<DataHubProvider tasks={{
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
    id="task-form-example-reject-initial-values"
    initialValues={{ foo: 'Foo', bar: 'b' }}
    submissionTaskName="Submit TaskForm example"
    analyticsFormName="task-form-example"
    redirectTo={(submissionTaskResult, formValues) => '#'}
    flashMessage={(submissionTaskResult, formValues) =>
      'Form was submitted successfully'
    }
  >
    <FieldInput name="foo" type="text" label="Foo"/>
    <FieldSelect name="bar" label="Bar" options={[
      {label: 'A', value: 'a'},
      {label: 'B', value: 'b'},
      {label: 'C', value: 'c'},
    ]}/>
  </TaskForm>
<DataHubProvider>
```