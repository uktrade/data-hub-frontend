SubTabNav
=========

### Description

Used as a child of a `TabNav` component to have sub tabs to further split the content

### Usage

#### Object for tabs
```jsx
  <SubTabNav
    id="test-sub-tabs"
    label="My tabs"
    tabs={{
      tab1: { label: 'Tab 1', href: '#', content: 'Tab 1 content' },
      tab2: { label: 'Tab 2', href: '#', content: 'Tab 2 content' },
      tab3: { label: 'Tab 3', href: '#', content: 'Tab 3 content' },
    }}
  />
```
#### Array for tabs
```jsx
  <SubTabNav
    id="test-array-sub-tabs"
    label="My tabs using an array"
    tabs={[
      { label: 'Tab 1', href: '#', content: 'Tab 1 content' },
      { label: 'Tab 2', href: '#', content: 'Tab 2 content' },
      { label: 'Tab 3', href: '#', content: 'Tab 3 content' },
    ]}
  />
```

### Properties
Prop        | Required | Default   | Type   | Description
:---------- | :------- | :-------- | :----- | :----------
 `id`       | true     |           | string | Used to generate ids for the sub components in the DOM
 `label`    | true     |           | string | A human description of the tabs used in the `aria-label`
 `tabs`     | true     |           | string | A object or array of tabs to show
 `selected` | false    | first tab | string | The key of the selected tab (if using an object for the tabs). Index of the array item (if using an array for the tabs)


