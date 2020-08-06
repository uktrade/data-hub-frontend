FieldTypeahead
=========

### Description

A Typeahead for use in forms. This is a wrapper around the `react-select` by Jed Watson, for indepth documention refer to [Github](https://github.com/JedWatson/react-select) or the [api docs](https://react-select.com/home)

**Note: The `<FieldTypeahead>` has to be wrapped with `<FormStateful>`.** 

### Usage

```jsx
<FormStateful onSubmit={action('onSubmit')}>
  {(state) => (
    <>
      <FieldTypeahead
        label="Typeahead - sync single value"
        hint="Some hint"
        name="sync_single"
        required="Chose value"
        options={options}
      />
    </>
  )}
</FormStateful>
```

### Properties
Prop | Required | Default | Type | Description
:--- | :------- | :------ | :--- | :----------
 `name` | true | `````` | string | Text for name attribute value
 `label` | false | null | string | Text for the label element
 `legend` | false | null | node | Node for legend element
 `hint` | false | null | node | Node for hint element
 `validate` | false | null | function or array of functions | Validate functions for input
 `required` | false | `````` | Boolean | Text 'required' sets wether the input is required or not
 `initialValue` | false | `````` | Text | Sets initial value of the input
 `isMulti` | false | `````` | Boolean | Sets wether you can select multiple options
 `options` | false | `````` | Array | This sets the data, if none is passed then it assumes you will use an async call to the api
 `loadOptions` | false | `````` | Function/promise | The function to be used as a async call to the api
 