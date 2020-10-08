FilterAdvisersTypeahead
=========

### Description

This is a typeahead is to be used in the collection list pages, this component depends on the [Task component](https://github.com/uktrade/data-hub-frontend/tree/master/src/client/components/Task) and should be used in conjuction with our [React/redux architecture](https://github.com/uktrade/data-hub-frontend/blob/master/docs/Redux%20and%20Saga.md).

### Usage

```jsx
  <FilterAdvisersTypeahead
    label="Advisers"
    isMulti={true}
    closeMenuOnSelect={false}
    name="example-1"
    loadOptions={loadOptions}
    placeholder="Search advisers..."
    noOptionsMessage={() => <span>No advisers found</span>}
  />
```

### Properties
Prop | Required | Default | Type | Description
:--- | :------- | :------ | :--- | :----------
 `taskProps` | true | `````` | object | contains props for the task component
 `taskProps - name` | true | `````` | string | name for task
 `taskProps - id` | true | `````` | string | id for task
 `onChange` | true | `````` | function | function to fire when you select an option


