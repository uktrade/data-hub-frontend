# FieldDate

### Description

Date field for use in forms and filters.

### Usage

```jsx
    <TaskForm
      id="fieldDateExample"
      analyticsFormName="fieldDateExample"
      submissionTaskName="Submit TaskForm example"
    >
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
</TaskForm>
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