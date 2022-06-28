# FieldCheckboxes

### Description

Checkboxes for use in forms and filters.

### Usage

```jsx
<Form
  id="fieldCheckboxExample"
  analyticsFormName="fieldCheckboxExample"
  submissionTaskName="Submit Form example"
>
  {(state) => (
    <>
      <FieldCheckboxes
        name="countries"
        label="What are your favourite countries?"
        required="Select at least one country"
        options={[
          {
            label: 'Italy',
            value: 'it',
          },
          {
            label: 'Poland',
            value: 'pl',
          },
        ]}
      />
    </>
  )}
</Form>
```

### Properties

| Prop           | Required | Default | Type                           | Description                                                                         |
| :------------- | :------- | :------ | :----------------------------- | :---------------------------------------------------------------------------------- |
| `name`         | true     | ``      | string                         | Text for name attribute value                                                       |
| `label`        | false    | null    | string                         | Text for the label element                                                          |
| `legend`       | false    | null    | node                           | Node for legend element                                                             |
| `hint`         | false    | null    | node                           | Node for hint element                                                               |
| `validate`     | false    | null    | function or array of functions | Validate functions for input                                                        |
| `required`     | false    | ``      | boolean                        | Text 'required' sets wether the input is required or not                            |
| `initialValue` | false    | []      | array of strings               | Sets initial value of the input                                                     |
| `options`      | true     | []      | array                          | Defines the checkbox labels and values                                              |
| `exclusive`    | false    | false   | boolean                        | Splits the last checkbox from the others where the choice is exclusive between them |
