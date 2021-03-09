# PieChart

### Description
A visual representaion of data in the form of a pie chart. This component is built using the [nivo.js](https://nivo.rocks/) library which is a wrapper around d3.


### Usage

```jsx
<PieChart
  data={data}
  height={450}
/>
```

### Properties

| Prop         | Required | Default | Type   | Description                                                                     |
| :----------- | :------- | :------ | :----- | :------------------------------------------------------------------------------ |
| `data`       | true     | ``````  | string | The data for the pie chart.
| `height`       | true     | ``````  | number | A height value is need to render the chart


### Data format
```jsx
const exampleData = [
  {
    id: 'Prospect',
    label: 'Prospect',
    value: 7,
  },
  {
    id: 'Assign PM',
    label: 'Assign PM',
    value: 2,
  },
  {
    id: 'Active',
    label: 'Active',
    value: 5,
  },
  {
    id: 'Verify win',
    label: 'Verify win',
    value: 2,
  },
  {
    id: 'Won',
    label: 'Won',
    value: 2,
  },
]
```
