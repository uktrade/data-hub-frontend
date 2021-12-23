Form
=========

### Description
A form component which does the following:
 * Starts a _task_ when the form is submitted
 * Renders a {ProgressBox} overlay while the _task_ is in progress
 * Handles the _task_ rejection by delegating it to the underlying {TaskProgressBox}
 * Can optionally be prepopulated with initial values resolved from a _task_

The form also has the following functionality built in:
 * Error summary rendered on top of the form when there are validation errors
 * Submit button and secondary action links
 * Success flash message on _task_ resolution
 * Redirection after the _submission task_ resolves
 * Recording Google Tag Manager events

### A basic Form example

This is a basic example of all the capabilities of `Form`. It:

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
    id="task-form-example-resolve-initial-values"
    submissionTaskName="Submit Form example"
    initialValuesTaskName="Load initial values"
    initialValuesPayload="resolve"
    transformInitialValues={initialValues => ({...initialValues, reject: 'yes'})}
    analyticsFormName="formExample"
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
  </Form>
<DataHubProvider>
```

### Properties
Prop | Required | Default | Type | Description
:--- | :------- | :------ | :--- | :----------
`analyticsFormName` | true | `````` | string | A string to identify the form in Google Analytics events. Should be in camelcase format e.g. editCompany (this is by request of the performance analysis team)
`id` | true | `````` | string | ID of the task that should be started when the form is submitted and when initial values are loaded
`submissionTaskName` | true | `````` | string | Name of the task that should be started when the form is submitted
`analyticsData` | false | `````` | object | A function which takes the values of the form as an argument, and which returns an object containing additional - non-sensitive - data to be passed to Google Analytics.
`cancelButtonLabel` | false | Cancel | string | The label for the built-in cancel button
`cancelRedirectTo` | false | `````` | function | A function which returns a URL to redirect to when the cancel button is clicked. If unset the cancel button will not display.
`flashMessage` | false | `````` | function | A function that will be passed the result of the submission task and the form values, which hould return a string used as a flash message when the submission task succeeds
`initialStepIndex` | false | 0 | integer | An optional integer representing the index of the step which the user will land on when the form is rendered, if the form has multiple steps. This is then set as the currentStep property in the form's state.
`initialValues` | false | `````` | object | An object mapping field names to their initial values.
`initialValuesTaskName` | false | `````` | string | Name of the task used to load initial values for the form
`initialValuesPayload` | false | `````` | function | An optional payload for the initial values task.
`redirectMode` | false | hard | string | The componentnsupports a _hard_ and _soft_ redirection modes. The _hard_ mode alters `window.location.href`, the _soft_ mode uses React-Router.
`redirectTo` | false | `````` | function | A function that will be passed the result of the submission task and the form values, which should return the URL to redirect to
`submitButtonLabel` | false | Save | string | The label for the built-in submit button
`submitButtonColour` | false | BUTTON_COLOUR | string | The colour for the built-in submit button.
`transformInitialValues` | false | `````` | function | A function which can be used to transform the data of the resolved initial values task
`transformPayload` | false | `````` | function | A function which can be used to transform the submitted form values before it is sent as a payload to the submission task