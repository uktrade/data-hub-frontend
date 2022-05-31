# Panel

### Description

Flash messages for users in different colours depending on the message. 

Note: If the props "flashMessages" are not passed down to the component then flash messages will be taken from session storage, if none exist in session storage then `null` is returned.

### Usage

```jsx
<FlashMessages
  flashMessages={{
    success: ['Success message'],
    'success:with-body': [
      {
        heading: 'Success message heading',
        body: 'Success message body',
      },
    ],
    info: ['Info message'],
    'info:with-body': [
      {
        heading: 'Info message heading',
        body: 'Info message body',
      },
    ],
    error: ['Error test message', 'Another error message'],
    warning: ['Warning test message'],
    muted: ['Muted test message'],
  }}
/>
```

### Properties

| Prop            | Required | Default                                   | Type | Description |
| :-------------- | :------- | :---------------------------------------- | :--- | :---------- |
| `flashMessages` | false    | `` | Object | Contains the flash messages |
