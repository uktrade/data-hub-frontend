# UserDetails

### Description

Shows some details about the user when they go to the dashboard.

### Usage

```jsx
<UserDetails
  name={'User Name'}
  last_login={sampleDate}
  dit_team={sampleTeam}
  job_title={'Developer'}
/>
```

or

```jsx
<UserDetails {...adviser} />
```

### Properties

| Prop         | Required | Default | Type   | Description                                                                     |
| :----------- | :------- | :------ | :----- | :------------------------------------------------------------------------------ |
| `name`       | true     | ``````  | string | The user's name                                                                 |
| `last_login` | true     | ``````  | string | When the user last logged in                                                    |
| `dit_team`   | true     | ``````  | string | The user's team. The country field is also taken from here.                     |
| `job_title`  | false    | ``````  | string | The user's job title. Not required as we don't currently get this from the API. |
