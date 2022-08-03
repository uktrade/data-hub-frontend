
This is a form field component which enables rendering of multiple instances of the same field(s). The component takes as its children a function which returns the field(s) to be repeated. The argument to this function is the `{groupIndex}`, where:

- ***groupIndex*** is the the index of FieldAddAnother component item

The ***initialValues*** is an array of grouped items. The ***transformArrayToObject*** function that will flatten this for the ***form*** component to deliver the values to the relative Field type components. 

The **initialChildGroupCount** is an attribute informing the component of how many instances of the child components need to be rendered within the *FieldAddAnother* children and is primarily used in edit mode when showing values within the *FieldAddAnother* component. So in the example below there are two groups of adviser roles [adviser_0, role_0] and (adviser_1, role_1) and so the *initialChildGroupCount* should be ***2***. By default this is ***1*** and when no data is being assigned will show no component details until the *"Add another"* button is clicked.

The **limitChildGroupCount** limits the number of child components a user can add by removing the *"Add another"* button at the limit

### Properties

| Prop               | Required | Default | Type                           | Description                                                                                                                                            |
| :----------------- | :------- | :------ | :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | true     |   | string                         | Text for name attribute value                                                                                                                          |
| `label`            | false    | null    | string                         | Text for the label element                                                                                                                             |
| `children`         | true     |   | function                       | Function that returns components to be rendered for each item in the list                                                                              |
| `dataTestPrefix` | false    |                                                                            |string|Allows children to be selected via `[data-test='<data-test-prefix><index>']`|
| `initialChildGroupCount` | false    | 1                                                            | number   | Number of child items groups that need to be repeated or added as a children from form on initial load |
| `itemName` | true |  | string | For screen readers; What this field is a list of, for example if this were set to 'trade agreements' screen readers would read 'first trade agreement' |
|                     |          |                                                              |          |                                                              |
