# Panel

### Description

The generic local header component.

### Usage

```jsx
<LocalHeader breadcrumbs={breadcrumbs} heading={heading} />
```

### Properties

The props where the type is set to `various` can take anything that can be rendered (strings, booleans, numbers or arrays).

| Prop            | Required | Default | Type    | Description                                                                               |
| :-------------- | :------- | :------ | :------ | :---------------------------------------------------------------------------------------- |
| `breadcrumbs`   | false    | ``      | array   | Contains the breadcrumbs                                                                  |
| `flashMessages` | false    | ``      | object  | Contains the flash messages                                                               |
| `heading`       | false    | ``      | string  | Contains the text to be displayed                                                         |
| `headingLink`   | false    | ``      | object  | Contains a link that appears above the heading                                            |
| `superheading`  | false    | ``      | various | Contains an item that renders above the heading (in the same position as the headingLink) |
| `children`      | false    | ``      | various | Contains an item that renders below the heading                                           |
