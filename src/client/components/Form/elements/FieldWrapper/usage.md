FieldInput
=========

### Description

A simple wrapper for use in the field components, which applies supporting elements and stylings. The FieldWrapper component caters for the child element within, by providing it with the wrapping elements it needs. In particular, this wrapper looks for passed props such as legends, labels, and hints, and provides the required layout or additional elements. 

In some design cases, there are pages that contain forms with a single radio or checkbox question. These pages have a requirement for a bigger, 'page-title like' legend. The `bigLegend` prop is a boolean which provides alternative styling to the legend, to make it match the bigger legend requirement. 

### Usage

```jsx
  <FieldWrapper {...{ name, label, legend, bigLegend, hint, error, reduced }}>
    <StyledInputWrapper error={error}>
      {touched && error && <ErrorText>{error}</ErrorText>}
      <Input
        key={name}
        error={touched && error}
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...rest}
      />
    </StyledInputWrapper>
  </FieldWrapper>
```

### Properties
Prop | Required | Default | Type | Description
:--- | :------- | :------ | :--- | :----------
 `name` | true | `````` | string | Text for name attribute value
 `label` | false | null | string | Text for the label element
 `legend` | false | null | node | Node for legend element
 `bigLegend` | false | false | boolean | Boolean for showing a big legend
 `hint` | false | null | node | Node for hint element
 `error` | false | null | string | Text for error
 `showBorder` | false | false | boolean | Boolean for showing borders
 `children` | false | null | node | Node for children elements 
 
