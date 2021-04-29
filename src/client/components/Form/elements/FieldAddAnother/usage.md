FieldAddAnother
=========

### Description

This is a form component renders a list in a form. The fields of this list are specified by a function based as a child to the component that is called with the arguments `{onChange, value, error}`, where:
 - onChange is the callback triggered by modification of the child component's value which takes the single argument `(new_value)`.
 - value is the current value of that particular subfield
 - error is the error of the whole FieldAddAnother component
When onChange is triggered for a given subfield the field value is set to an array of objects with a key `value` containing the value of that field.

### Usage

```jsx
<FormStateful onSubmit={action('onSubmit')}>
  {(state) => (
    <FieldAddAnother
      name="related_trade_agreements"
      label="Related Trade Agreements"
      data-test-prefix="trade-agreement-field-"
      required="Select at least one Trade Agreement"
    >
      {({ value, onChange, error }) => (
        <Typeahead
          name="related_trade_agreements"
          inputId="related_trade_agreements"
          label={''}
          options={options}
          placeholder="-- Search trade agreements --"
          required="Select at least one Trade Agreement"
          aria-label="Select a trade agreement"
          value={options.find(
            ({ value: option_value }) => option_value === value
          )}
          onChange={onChange}
          error={error}
        />
      )}
    </FieldAddAnother>
  )}
</FormStateful>
```

### Properties
Prop | Required | Default | Type | Description
:--- | :------- | :------ | :--- | :----------
 `name` | true | `````` | string | Text for name attribute value
 `required` | false | `````` | boolean | Text 'required' sets whether the input is required or not
 `label` | false | null | string | Text for the label element
 `validate` | false | null | function or array of functions | Validation functions for input
 `children` | true | `````` | function | Function that returns components to be rendered for each item in the list
`data-test-prefix` | false | `````` | string | Allows children to be selected via `[data-test='<data-test-prefix><index>']`
`item-name` | true | `````` | string | For screen readers; What this field is a list of, for example if this were set to 'trade agreements' screen readers would read 'first trade agreement'
