# CompanyLocalHeader

### Description

Implementation of the company local header in React, extending the LocalHeader component.

### Usage

```jsx
<CompanyLocalHeader
  breadcrumbs={[
    { link: dashboard(), text: 'Home' },
    { link: companies.index(), text: 'Companies' },
    {
      link: companies.detail(dnBGlobalUltimate.id),
      text: dnBGlobalUltimate.name,
    },
    { text: 'Activity Feed' },
  ]}
  flashMessages={{
    'success:with-body': [
      {
        heading: 'Business details verified.',
        body:
          'Thanks for helping to improve the quality of records on Data Hub!',
        id: 'message-company-matched',
      },
    ],
  }}
  company={{
    ...dnBGlobalUltimate,
    ...{
      hasManagedAccountDetails: true,
      archived: true,
      pending_dnb_investigation: true,
      isUltimate: true,
      archived_on: '2019-06-12T14:19:05.473413Z',
      archived_reason: 'Client cancelled',
    },
  }}
  dnbRelatedCompaniesCount={3}
/>
```

### Properties

| Prop                       | Required | Default                                                                                                                                                                                                                                                                            | Type   | Description                                                                                                        |
| :------------------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----- | :----------------------------------------------------------------------------------------------------------------- |
| `breadcrumbs`              | true     | `` | Array | Array of breadcrumbs                                                                                                                                                                                                                                                  |
| `flashMessages`            | false    | null                                                                                                                                                                                                                                                                               | Object | Contains the flash messages. Will show none if null.                                                               |
| `company`                  | true     | `` | Object | Contains all of the company information provided by `res.locals`. The component will conditionally show the badge, details dropdown, parts of the description, the archive message and the pending investigation message depending on the information provided here. |
| `dnbRelatedCompaniesCount` | false    | null                                                                                                                                                                                                                                                                               | Number | Number of related companies. If provided it shows that information in the description section.                     |
| `returnUrl`                | false    | null                                                                                                                                                                                                                                                                               | String | Provides the return url for the `Add to or remove from lists` pages. Not needed on the default activity feed page. |
