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
      name="trade_agreement_list"
      required="Please select a trade agreement"
      label="Trade agreements"
      initialValue={[{label: "First value", value: "value"}]}
      options={[{label: "First value", value: "value"}]}
      placeholder="-- Select an item --"
    >
    </FieldAddAnother>
  )}
</FormStateful>
```

### Properties
Prop | Required | Default | Type | Description
:--- | :------- | :------ | :--- | :----------
 `name` | true | `````` | string | Text for name attribute value
 `label` | false | null | string | Text for the label element
 `placeholder` | false | null | string | Placeholder text for all typeaheads
 `required` | false | `````` | Boolean | Text 'required' sets wether the input is required or not
 `initialValue` | false | `````` | Text | Sets initial value of the input
 `options` | false | `````` | Array | This sets the data, if none is passed then it assumes you will use an async call to the api
 `validate` | false | null | function or array of functions | Validate functions for input
 
