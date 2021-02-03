# Timeline

### Description

The timeline displays a list of events/stages in chronological order and indicates the current progress of a particular event/stage.

### Usage

```jsx
  <Timeline 
  stages={['Prospect', 'Assign PM', 'Active', 'Verify win', 'Won']}
  currentStage="Prospect" 
  />
```

### Properties

| Prop           | Required | Default      | Type   | Description             |
| :------------- | :------- | :----------- | :----- | :---------------------- |
| `stages`       | true     | ``````       | array  | Text for the stages     |
| `currentStage` | false    | empty string | string | Marks the current stage |
