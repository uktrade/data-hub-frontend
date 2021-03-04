# UserDetails

### Description

Shows some details about the user when they go to the dashboard.

### Usage

```jsx
<PieChart
  data={data}
/>
```

### Properties

| Prop         | Required | Default | Type   | Description                                                                     |
| :----------- | :------- | :------ | :----- | :------------------------------------------------------------------------------ |
| `data`       | true     | ``````  | string | The data for the pie chart. Some transformation takes place in order to convert the data to the format required by Nivo.

### Data format
```jsx
const exampleData = [
  {
    id: 'Prospect',
    label: 'Prospect',
    value: 7,
  },
```
