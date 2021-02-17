ErrorSummary
=========

### Description

Use this component at the top of a page to summarise any errors a user has made.

When a user makes an error, you must show both an error summary and an error message next to each answer that contains an error. More information can be found on the [GDS Design system](https://design-system.service.gov.uk/components/error-summary/)

### Usage

```jsx
    <ErrorSummary
      heading="Message to alert the user to a problem goes here"
      description="Optional description of the errors and how to correct them"
      errors={[
            {
              targetName: 'national-insurance-number',
              text: 'National Insurance number error',
            },
            {
              targetName: 'description',
              text: 'Description of what you saw error',
            },
        ]}
    />
```

### Properties
Prop | Required | Default | Type | Description
:--- | :------- | :------ | :--- | :----------
  `heading` | false | "There is a problem" | string | Text for heading
  `description` | false | null | string | Text for description
  `errors` | true | `````` | array | The list of error descriptions and their target id's


