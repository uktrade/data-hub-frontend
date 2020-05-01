# Panel

### Description

Flash messages for users in different colours depending on the message

### Usage

```jsx
<FlashMessages
  flashMessages={{
    'success:with-body': [
      {
        heading: 'Success message heading',
        body: 'Success message body',
      },
    ],
    'info:with-body': [
      {
        heading: 'Info message heading',
        body: 'Info message body',
      },
    ],
    error: ['Error test message'],
    warning: ['Warning test message'],
    muted: ['Muted test message'],
  }}
/>
```

### Properties

| Prop            | Required | Default                                   | Type | Description |
| :-------------- | :------- | :---------------------------------------- | :--- | :---------- |
| `flashMessages` | true     | `` | Object | Contains the flash messages |
