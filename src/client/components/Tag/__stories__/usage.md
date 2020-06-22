# Tag

### Description

The is a implementation of the [Tag](https://design-system.service.gov.uk/components/tag/) component from the GovUK Design System.

Use the tag component when it’s possible for something to have more than one status and it’s useful for the user to know about that status. For example, you can use a tag to show whether an item in a [task list](https://design-system.service.gov.uk/patterns/task-list-pages) has been ‘completed’.

### Usage

If no colour is specified the tag will default to a blue background and white text.

```jsx
<Tag colour="green">NEW</Tag>
```

### Properties

| Prop       | Required | Default                                                   | Type | Description |
| :--------- | :------- | :-------------------------------------------------------- | :--- | :---------- |
| `children` | true     | 'default'                                                 | node | Text of tag |
| `colour`   | false    | `` | string | Dictates the `background-color` and `color` |
