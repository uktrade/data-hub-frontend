Accessible, optionally routed tab navigation. Based on https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role

### Properties

| Prop            | Required | Default                                   | Type | Description |
| :-------------- | :------- | :---------------------------------------- | :--- | :---------- |
| `label`| Yes | `undefined`| `String`  | A label required for accessibility |
| `routed`| No | `false` | `Boolean` | If `true` the component will set the current path of the route to the value of the selected index and vice versa |
| `tabs`| Yes | `undefined` | An object or array of `{label: string, content: ReactNode}` objects | If `true` the component will set the current path of the route to the value of the selected index |
| `keepQueryParams` | No | `false` | `Boolean` | If `true`, clicking through the navigation will keep any query params in the url.
