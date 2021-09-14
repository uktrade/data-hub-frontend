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
| `height`       | true     | ``````  | number | A height value is need to render the chart.
| `unit`       | false     | `''`  | string | Unit to display in the centre of the chart.


### Data format
```jsx
const exampleData = [
  {
    id: 'Prospect',
    name: 'prospect',
    value: 318,
    colour: PURPLE,
  },
  {
    id: 'Assign PM',
    name: 'assign_pm',
    value: 201,
    colour: ORANGE,
  },
  {
    id: 'Active',
    name: 'active',
    value: 57,
    colour: BLUE,
  },
  {
    id: 'Verify win',
    name: 'verify_win',
    value: 2,
    colour: YELLOW,
  },
  {
    id: 'Won',
    name: 'won',
    value: 21,
    colour: GREEN,
  },
]
```
