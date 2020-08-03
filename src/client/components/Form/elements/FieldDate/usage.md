# FieldDate

### Description

Date field for use in forms and filters. When using this component as a filter (reduced version) the native input **`type="date"`** will not work in IE 11 so you need to toggle the **`isIE`** flag on (see props below). The fallback for IE11 is the three input fields pattern.

**Note: The `<FieldDate>` has to be wrapped with `<FormStateful>`.** 

### Usage

```jsx
<FormStateful onSubmit={action('onSubmit')}>
  {(state) => (
    <>
      <FieldDate
        name="date"
        label="What is your date of birth?"
        hint="For example, 01 09 2019"
        required="Enter a valid date of birth"
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
| `isIE`      | false    | false                                                                   | Boolean                        | Toggles wether the native input type="date" is used or not |
