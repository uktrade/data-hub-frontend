FilterSelect
=========

### Description

This is the select dropdown component to be used as filters on the collection list pages, this component depends on the [Task component](https://github.com/uktrade/data-hub-frontend/tree/master/src/client/components/Task) and should be used in conjuction with our [React/redux architecture](https://github.com/uktrade/data-hub-frontend/blob/master/docs/Redux%20and%20Saga.md).

### Usage

```jsx
    <FilterSelect
      name="testField"
      label="Test select"
      hint="Some hint"
      initialValue={'testOptionValue2'}
      emptyOption={'Please select'}
      options={[
        { label: 'testOptionLabel1', value: 'testOptionValue1' },
        { label: 'testOptionLabel2', value: 'testOptionValue2' },
      ]}
      taskProps={...taskProps} // task to be forwarded on
      onChange={()=> // function from dispatch}
    />
```

### Properties
Prop | Required | Default | Type | Description
:--- | :------- | :------ | :--- | :----------
`name` | true | ````` | string | name of filter
 `onChange` | true | `````` | function | function to fire from dispatch
 `taskProps` | true | `````` | object | contains props for the task component
 `taskProps - name` | true | `````` | string | name for task
 `taskProps - id` | true | `````` | string | id for task


