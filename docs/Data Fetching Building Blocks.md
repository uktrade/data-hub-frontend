# Data Fetching Building Blocks

## Low level

### Task

The `Task` component is a little framework, which allows you to do side-effects
without violating the Redux architecture and without the need to deal with
Redux-sagas. A _task_ is a function which takes a _payload_ and returns a
promise and can have _dirty input_ and _side effects_.

#### Dependency Injection

The `Task` is using a sort of lightweight _dependency injection_, i.e. you never
call a _task_ function directly, but only refer to it by its _name_ and _id_
and delegate the call to the `Task` component. To what _task_ function exactly
the _name_ resolves depends on what you register under that name by the
`DataHubProvider` component. This has a couple of advantages:

* You can work without a running API instance by plugging in a dummy task which
  resolves with hardcoded or random data.
* You can work on a feature for which an API endpoint is not implemented yet
* You can easily make the tasks fail or delay their resolution
* The DI could theoretically be used in functional tests instead of the sandbox

```js
<DataHubProvider tasks={{
  // Satisfy the dependecies
  'do something': payload => Promise.resolve('result'),
  'do something else': payload => Promise.reject('Error message'),
  // 'talk to the API': () => apiProxyAxios.get('/some-endpoint'),
  'talk to the API': () => new Promise((resolve, reject) =>
    setTimeout(5000, resolve, {dummy: 'data'}),
  ),
}}>
  {/* Here you can use the tasks registered above */} 
  <Task>
    {task =>
      <button onClick={
        // Tasks are only handled by proxy of their dependency name
        task('do something', 'foo')
          .start({
            onSuccessDispatch: 'TASK_RESOLVED',
            payload: 12345,
          })
      }>
        start the task
      </button>
    }
  </Task>
</DataHubProvider>
```

## Higher Level

### Task.Status

Subscribe to lifecycle of a task. Get progress indicator and error view with
retry and cancell butons for free.

```js
<Task.Status
  name="do something"
  id="foo"
  // Optionally start the task when this component mounts or when props change
  startOnRender={{
    onSuccessDispatch: 'TASK_RESOLVED',
    payload: 12345,
  }}
>
  {() =>
    <p>
      I will only be rendered if the task with
      name: "do something" and id: "foo"
      is NOT in progress or error state
    </p>
  }
</Task.Status>
```

### TaskLoadingBox

Same as `Task.Status`, but will always render the children. If the task is in
progress or rejects the children will be wrapped in `LoadingBox`.

```js
<TaskLoadingBox name="do something" id="foo">
  <p>
    I will be hidden behind a LoadinbBox
  </p>
</TaskLoadingBox>
```

## Even Higher Level

### Resource

Calls a task for you and stores its resolved value in the state, untill the same
task resolves again.

No reducer needed anymore for handling the `onSuccessDispatch` action.

```js
<Resource
  name="get something"
  id="foo"
  payload={12345}
>
  {resolvedValue =>
    // I will be rendered only when the "get something" task resolves
    <pre>
      {JSON.stringify(resolvedValue)}
    </pre>}
</Resource>
```

The very generic `Resource` is meant to be used to write specialized reusable
resources like this:

```js
const CompanyResource = props =>
  <Resource {...props} name="get company"/>

<CompanyResource id="company-id">
  {company =>
    <pre>
      {JSON.stringify(company)}
    </pre>}
</CompanyResource>
```

#### Resource factories

Better yet. Instead of using `Resource` directly, se one of the folowing
factories for creating resources for talking to the API.

* `createEntityResource`
* `createCollectionResource`
* `createMetadataResource`

This way you will not only get a specialized component, but also the task for
free:

```js
const Company = createEntityResource('Company', id => `v4/company/${id}`)
const Countries = createMetadataResource('Countries', 'country')
const Interactions = createCollectionResource('Interactions', 'v4/interaction')

// The tasks are accessible like this
companyTask = Company.tasks.Company
countriesTask = Countries.tasks.Countries
interactionsTask = Interactions.tasks.Interactions

// Which allows them to be easily plugged in
<DataHubProvider tasks={{
  ...Company.tasks,
  ...Countries.tasks,
  ...Interactions.tasks,
}}>
  // ...
</DataHubProvider>
```

The `Resource` is readonly only for now, i.e. the automatically generated tasks
are making `GET` requests only. There is however a POC of a writeable
`Resource` in the `firebreak/writeable-resource` branch, which you can finish
if you think it could be handy, but it seems that all data inputs in DataHub are
done with forms. The one exception are the collection pages, some (or all???) of
which use API endpoints which just expose Elastic Search API and require `POST`
requests, although we are only reading data. A simpler alternative would be to
parametrize the HTTP method in the resource factories.

### TaskTypeahead

The existing `Typeahead` component deviates from the Redux architecture with the
mechanism it uses to resolve its options asynchronously as the user types.
I have a working `TaskTypeahead` prototype which can uses a task instead.

```js
<TaskTypeahead
  id="foo"
  optionsTaskName="get advisers"
  defaultValues={['adviser-id-1', 'adviser-id-2']}
  labelTaskName="get adviser"
/>
```

### TaskForm

```js
<TaskForm
  id="foo"
  submissionTaskName="update something"
  initialValuesTaskName="load something"
  initialValuesPayload={12345}
  transformInitialValues={initialValues => ({
    ...initialValues,
    extraStuf: 'blah',
  })}
  transformPayload={payload => ({...payload, extraStuf: 'blah'})}
  analyticsFormName="Update something"
  redirectTo={(submissionTaskResult, formValues) => '/success'}
  redirectMode="soft"
  flashMessage={(submissionTaskResult, formValues) =>
    'Something was successfully updated'
  }
>
  {/* Here come the form fields */}
</TaskForm>
```

### ResourceOptionsField

I keep advocating for not having the logic of loading options for fields which
have options (select, radios, checkboxes) on the form level, but to instead
write a specialized reusable field in which loading options is an internal detail:

```js
const FieldCountrySelect = (props) => (
  <CountriesResource>
    {(countries) => (
      <FieldSelect
        label="Country"
        {...props}
        options={countries.map(({ name, id }) => ({ label: name, value: id }))}
      />
    )}
  </CountriesResource>
)

const YourFavouriteCountryForm = () =>
  // The form doesn't need to care about loading countries metadata...
  <TaskForm {...props}>
    {/* ...because the field takes care of it internally */}
    <FieldCountrySelect name="country">
  </TaskForm>
```

This however has a flaw:

If the field is required, and the user submits the form before the field loads
it's options, the form will not show a validation error for the field even though
the field is required and the form will be submitted.

This is due to the mechanism of how the form communicates with its fields. The form
component (`TaskForm`) will only learn
that it has a field (required or not) when the field component is mounted and it
registers itself by the form.

So in the case of the `FieldCountrySelect` above, the `FieldSelect` is only
mounted when its options have loaded and thus the form cannot know that it has
a required field. So if the user submits the form before the options have loaded
the form will happily carry on ignorant of the required field.

#### Solution

The solution is in rendering the options field even before the options have loaded.

There is a prototype of the `ResourceOptionsField` component with which it is
very easy to compose any _options_ field component with a specialized _resource_
component:

```js
const FieldCountrySelect = props =>
  <ResourceOptionsField
    {...props}
    resource={CountriesResource}
    field={FieldSelect}
    resultToOptions={(result) =>
      result.map(({ id, name }) => ({ value: id, label: name }))
    }
  />
```

Or in more general way with partial application:

```js
// This will still require the `field` prop, which we will fill out later
const FieldOptionsCountry = props =>
  <ResourceOptionsField
    {...props}
    resource={CountriesResource}
    resultToOptions={(result) =>
      result.map(({ id, name }) => ({ value: id, label: name }))
    }
  />

const FieldCountrySelect = props =>
  <ResourceOptionsField {...props} field={FieldSelect} />

const FieldCountryRadios = props =>
  <ResourceOptionsField {...props} field={FieldRadios} />

const FieldCountryCheckboxes = props =>
  <ResourceOptionsField {...props} field={FieldCheckboxes} />

const FieldCountryTypeahead = props =>
  <ResourceOptionsField {...props} field={FieldTypeahead} />
```
