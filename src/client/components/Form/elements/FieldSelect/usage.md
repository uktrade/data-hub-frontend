# FieldSelect

### Description

A Select dropdown field for use in forms.

**Note: The `<FieldSelect>` has to be wrapped with `<FormStateful>`.**

### Usage

```jsx
<FormStateful onSubmit={action('onSubmit')}>
  {(state) => (
    <>
      <FieldSelect
        name="testField"
        label="Test select"
        hint="Some hint"
        initialValue={text('Initial value', 'testOptionValue2')}
        emptyOption={text('emptyOption', 'Please select')}
        options={object('options', [
          { label: 'testOptionLabel1', value: 'testOptionValue1' },
          { label: 'testOptionLabel2', value: 'testOptionValue2' },
        ])}
        required="Select one of the options"
        validate={(value) =>
          value !== 'testOptionValue2'
            ? text('error', 'You need to select testOptionValue2')
            : null
        }
      />
    </>
  )}
</FormStateful>
```

### Properties

| Prop           | Required | Default                                                                 | Type                           | Description                  |
| :------------- | :------- | :---------------------------------------------------------------------- | :----------------------------- | :--------------------------- |
| `name`         | true     | `` | string | Text for name attribute value                             |
| `label`        | false    | null                                                                    | string                         | Text for the label element   |
| `legend`       | false    | null                                                                    | node                           | Node for legend element      |
| `hint`         | false    | null                                                                    | node                           | Node for hint element        |
| `type`         | true     | `` | string | Text for type attribute value                             |
| `validate`     | false    | null                                                                    | function or array of functions | Validate functions for input |
| `required`     | false    | `` | Boolean | Text 'required' sets wether the input is required or not |
| `initialValue` | false    | `` | Text | Sets initial value of the input                             |
| `options`      | True     | ``` | Array | Items for the list                                        |
| `emptyOption`  | False    | ``` | Text | Text to display when no items are selected                 |
