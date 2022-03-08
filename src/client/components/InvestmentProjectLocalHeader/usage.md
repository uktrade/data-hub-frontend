# InvestmentProjectLocalHeader

### Description

The **InvestmentProjectLocalHeader** contains the following:
* A row of breadcrumbs (secondary navigation) that reveals the user's location in Data Hub 
* Investment metadata such as: Status (Ongoing, Delayed, Abandoned, Lost and Dormant), Project code, Valuation and a Created on date
* A list of five stages (Prospect', 'Assign PM', 'Active', 'Verify win' and 'Won') in chronological order where the current stage is clear to see

### Usage

```jsx
  <InvestmentProjectLocalHeader 
    investment={{
      id: '123',
      investor_company: {
        name: 'Alphabet Inc.',
        id: '456',
      }}
      project_code: 'DHP-00000356',
      value_complete: false,
      status: 'ongoing',
      created_on: '2022-02-25T15:37:23.331204Z',
    }}
    breadcrumbs={[
      { link: urls.dashboard(), text: 'Home' },
      {
        link: urls.investments.index(),
        text: 'Investments',
      },
      {
        link: urls.investments.index(),
        text: 'Projects',
      },
      {
        link: urls.investments.projects.details(investment.id),
        text: investment.investor_company.name,
      },
    ]} 
  />
```

### Properties

| Prop           | Required | Type   | Description             |
| :------------- | :------- | :----- | :---------------------- |
| `investment`   | true     | object | An investment project   |
| `breadcrumbs`  | true     | array  | An array of objects containing two fields (link and text) |
