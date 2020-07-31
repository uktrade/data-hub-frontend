# FieldCheckboxes

### Description

Checkboxes for use in forms and filters.

**Note: The `<FieldCheckboxes>` has to be wrapped with either the `<Form>` or `<FormStateful>`.**

### Usage

```jsx
<FormStateful onSubmit={action('onSubmit')}>
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
</FormStateful>
```

### Properties

| Prop           | Required | Default                                                                 | Type                           | Description                                   |
| :------------- | :------- | :---------------------------------------------------------------------- | :----------------------------- | :-------------------------------------------- |
| `name`         | true     | `` | string | Text for name attribute value                             |
| `label`        | false    | null                                                                    | string                         | Text for the label element                    |
| `legend`       | false    | null                                                                    | node                           | Node for legend element                       |
| `hint`         | false    | null                                                                    | node                           | Node for hint element                         |
| `validate`     | false    | null                                                                    | function or array of functions | Validate functions for input                  |
| `required`     | false    | `` | Boolean | Text 'required' sets wether the input is required or not |
| `initialValue` | false    | `` | Text | Sets initial value of the input                             |
| `options` | true | empty array | array | Defines the checkbox labels and values
| `reduced`      | false    | false                                                                   | Boolean                        | Toggles wether the element is a filter or not |
| `reducedPadding`      | false    | false                                                                   | Boolean                        | Toggles wether the surrounding padding is reduced for the likes of checkboxes |
