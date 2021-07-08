# Checkboxes

### Description

Let users select one or more options by using the checkboxes component.

If you have a lot of options to display consider using the `visibleHeight` 
property to create a scrollable area. Selected option count will only show
when you use the `visibleHeight` property.

### Usage

```jsx
<CheckboxGroupField
  visibleHeight={215}
  name="countries"
  legend="What are your favourite countries?"
  options={moreThanFiveOptions}
  selectedOptions={[
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
```
