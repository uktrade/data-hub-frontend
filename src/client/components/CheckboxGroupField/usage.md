# Checkboxes

### Description

Let users select one or more options by using the checkboxes component.

If you have a lot of options to display consider using the `visibleHeight` 
property to create a scrollable area. Selected option count will only show
when you use the `visibleHeight` property.

If when a screenreader reads the label of the checkboxes in isolation it is not clear what they refer to, use the `groupId` prop to ensure the legend of the checkbox group is read after each checkbox label.

### Usage

```jsx
<CheckboxGroupField
  visibleHeight={215}
  name="countries"
  legend="What are your favourite countries?"
  groupId="countries-filters"
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
