# Initial values as prop

The initial values of `Form` can also be set with the `initialValues` prop.

```jsx
<DataHubProvider tasks={{
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
    initialValues={{ foo: 'Foo', bar: 'b' }}
    submissionTaskName="Submit Form example"
    analyticsFormName="fformExample"
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
  </Form>
<DataHubProvider>
```