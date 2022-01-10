FieldInput
=========

### Description

A basic input field for numbers and text. 

### Usage

```jsx
<Form
      id="fieldInputExample"
      analyticsFormName="fieldInputExample"
      submissionTaskName="Submit Form example"
    >
  {(state) => (
    <>
      <FieldInput
        label="Text"
        hint="Some hint"
        name="testField"
        required="Enter text"
        type="text"
        reduced
      />
    </>
  )}
</Form>
```

### Properties
Prop | Required | Default | Type | Description
:--- | :------- | :------ | :--- | :----------
 `name` | true | `````` | string | Text for name attribute value
 `label` | false | null | string | Text for the label element
 `legend` | false | null | node | Node for legend element
 `hint` | false | null | node | Node for hint element
 `type` | true | `````` | string | Text for type attribute value
 `validate` | false | null | function or array of functions | Validate functions for input
 `required` | false | `````` | Boolean | Text 'required' sets wether the input is required or not
 `initialValue` | false | `````` | Text | Sets initial value of the input
 `reduced` | false | false | Boolean | Toggles wether the element is a filter or not
