# TabNav

### Description

Accessible, optionally routed tab navigation.

### Usage

```jsx
<TabNav
  id="tab-nav"
  label="Tab navigation"
  selectedIndex={1}
  tabs={[
    { label: 'Foo', content: <h1>Foo</h1> },
    { label: 'Bar', content: <h2>Bar</h2> },
    { label: 'Baz', content: <h3>Baz</h3> },
  ]}
/>

<TabNav
  id="routed-tab-nav"
  label="Routed tab navigation"
  routed
  selectedIndex="bar"
  tabs={{
    foo: { label: 'Foo', content: <h1>Foo</h1> },
    bar: { label: 'Bar', content: <h2>Bar</h2> },
    baz: { label: 'Baz', content: <h3>Baz</h3> },
  }}
/>
```

### Properties

#### Label

| Prop            | Required | Default                                   | Type | Description |
| :-------------- | :------- | :---------------------------------------- | :--- | :---------- |
| `label`| Yes | `undefined`| `String`  | A label required for accessibility |
| `routed`| No | `false` | `Boolean` | If `true` the component will set the current path of the route to the value of the selected index and vice versa |
| `tabs`| Yes | `undefined` | An object or array of `{label: string, content: ReactNode}` objects | If `true` the component will set the current path of the route to the value of the selected index |
