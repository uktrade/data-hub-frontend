# FieldAddAnother

### Description

This is a form field component which enables rendering of multiple instances of the same field(s). The component takes as its children a function which returns the field(s) to be repeated. The argument to this function is the `{groupIndex}`, where:

- ***groupIndex*** is the the index of FieldAddAnother component item

The ***initialValues*** is an array of grouped items. The ***transformArrayToObject*** function that will flatten this for the ***form*** component to deliver the values to the relative Field type components. 

The **initialChildGroupCount** is an attribute informing the component of how many instances of the child components need to be rendered within the *FieldAddAnother* children and is primarilly used in edit mode when showing values within the *FieldAddAnother* component. So in the example below there are two groups of adviser roles [adviser_0, role_0] and (adviser_1, role_1) and so the *initialChildGroupCount* should be ***2***. By default this is ***1*** and when no data is being assigned will show no component details until the *"Add another"* button is clicked.

### Usage

```jsx
const initialValues = [
  {
    adviser_0: {
      label: 'Bob Bobertson',
      value: '1379f390a-e083-4a2c-9cea-e3b9a08606a723',
    },
    role_0: 'Boss',
  },
  {
    adviser_1: {
      label: 'Mary Maryson',
      value: '8dcd2bb8-dc73-4a42-8655-4ae42d4d3c5a',
    },
    role_1: 'Minion',
  },
]

const transformArrayToObject = (array) => {
  return array.reduce((previous, current) => ({ ...previous, ...current }))
}

<Form
  id="fieldAddAnotherExample"
  analyticsFormName="fieldAddAnotherExample"
  submissionTaskName="Submit Form example"
  initialValues={transformArrayToObject(initialValues)}
>
  {(state) => (
    <>
      <FieldAddAnother
        name="teams"
        label="Related teams with role(s)"
        dataTestPrefix="teams-field-"
        itemName="team"
        initialChildGroupCount={initialValues.length}
      >
        {({ groupIndex }) => (
          <>
            <FieldTypeahead
              name={`adviser_${groupIndex}`}
              inputId={`related_adviser_${groupIndex}`}
              label={''}
              options={options}
              placeholder="Search advisers"
              required="Select at least one Adviser"
              aria-label="Select an adviser"
            />
            <FieldInput name={`role_${groupIndex}`} type="text" />
          </>
        )}
      </FieldAddAnother>
    </>
  )}
</Form>
```

### Properties

| Prop               | Required | Default | Type                           | Description                                                                                                                                            |
| :----------------- | :------- | :------ | :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | true     |   | string                         | Text for name attribute value                                                                                                                          |
| `label`            | false    | null    | string                         | Text for the label element                                                                                                                             |
| `children`         | true     |   | function                       | Function that returns components to be rendered for each item in the list                                                                              |
| `dataTestPrefix` | false    |                                                                            |string|Allows children to be selected via `[data-test='<data-test-prefix><index>']`|
| `initialChildGroupCount` | false    | 1                                                            | number   | Number of child items groups that need to be repeated or added as a children from form on initial load |
| `itemName` | true |  | string | For screen readers; What this field is a list of, for example if this were set to 'trade agreements' screen readers would read 'first trade agreement' |
|                     |          |                                                              |          |                                                              |
