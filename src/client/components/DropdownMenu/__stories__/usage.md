ButtonDropdown
=========

### Description

DropdownMenu displays contextual overlays for menus.

In Desktop view the menu will "float" over the content in mobile view the menu is in flow and will push the content down.

### DropdownButton
Dropdown button is extending styles of Button for usage please visit the button docs [here](https://govuk-react.github.io/govuk-react/?path=/story/form-buttons--component-default).
### Usage

```jsx
  <DropdownMenu label="View options" closedLabel="Hide options" {...props}>
    <DropdownButton buttonColour={GREY_3} buttonTextColour={BLACK}>
      Add to or remove from list
    </DropdownButton>
    <DropdownButton buttonColour={GREY_3} buttonTextColour={BLACK}>
      Add to pipeline
    </DropdownButton>
  </DropdownMenu>
```

### Properties
Prop | Required | Default | Type | Description
:--- | :------- | :------ | :--- | :----------
 `label` | true | `````` | string | Text for button
 `children` | false | null | node | Buttons for dropdown group
 `closedLabel` | false | `````` | string | Close text for button
 `active` | false | `````` | boolean | Set the open and close state of the dropdown
 `onClick` | true | `````` | function | Signature: function(nextOpenState: boolean) => void


