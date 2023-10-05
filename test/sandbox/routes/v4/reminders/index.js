export const getEstimatedLandDateSubscriptions = function (req, res) {
  res.json({
    reminder_days: [30, 60],
    email_reminders_enabled: true,
  })
};

export const saveEstimatedLandDateSubscriptions = function (req, res) {
  res.json({
    reminder_days: [30, 60],
    email_reminders_enabled: true,
  })
};

export const getNoRecentInteractionsSubscriptions = function (req, res) {
  res.json({
    reminder_days: [30],
    email_reminders_enabled: false,
  })
};

export const saveNoRecentInteractionsSubscriptions = function (req, res) {
  res.json({
    reminder_days: [30, 60],
    email_reminders_enabled: true,
  })
};

export const getReminderSubscriptionsSummary = function (req, res) {
  res.json({
    estimated_land_date: {
      email_reminders_enabled: true,
      reminder_days: [10, 20, 40],
    },
    no_recent_investment_interaction: {
      email_reminders_enabled: true,
      reminder_days: [10, 20, 40],
    },
    no_recent_export_interaction: {
      email_reminders_enabled: true,
      reminder_days: [10, 20, 40],
    },
    new_export_interaction: {
      email_reminders_enabled: true,
      reminder_days: [2, 4, 7],
    },
  })
};

export const getNoRecentExportInteractionsSubscriptions = function (req, res) {
  res.json({
    reminder_days: [20],
    email_reminders_enabled: false,
  })
};

export const saveNoRecentExportInteractionsSubscriptions = function (req, res) {
  res.json({
    reminder_days: [20, 40],
    email_reminders_enabled: true,
  })
};

export const getNewExportInteractionsSubscriptions = function (req, res) {
  res.json({
    reminder_days: [2],
    email_reminders_enabled: false,
  })
};

export const saveNewExportInteractionsSubscriptions = function (req, res) {
  res.json({
    reminder_days: [2, 4],
    email_reminders_enabled: true,
  })
};

export const getEstimatedLandDateReminders = function (req, res) {
  res.json({
    count: 14,
    next: null,
    previous: null,
    results: [
      {
        id: '4af1527e-ed3e-4af4-84fc-dc8bb19078bb',
        created_on: '2022-06-06T13:56:45.068248Z',
        event: '30 days left to estimated land date',
        project: {
          id: 'ea3a03ba-b239-4956-b2fb-f35c91109674',
          name: 'New fruit machine',
          project_code: 'DHP-00000009',
        },
      },
    ],
  })
};

export const getNoRecentExportInteractionReminders = function (req, res) {
  res.json({
    count: 15,
    next: null,
    previous: null,
    results: [
      {
        id: '4af1527e-ed3e-4af4-84fc-dc8bb19078bb',
        created_on: '2022-06-06T13:56:45.068248Z',
        last_interaction_date: '2021-08-14T08:49:23Z',
        event: '30 days since last interaction',
        company: {
          id: 'c79ba298-106e-4629-aa12-61ec6e2e47ce',
          name: 'Boring Company',
        },
        interaction: {
          created_by: {
            name: 'Shawn Cohen',
            first_name: 'Shawn',
            last_name: 'Cohen',
            id: '2c42c516-9898-e211-a939-e4115bead28a',
            dit_team: {
              id: '884ab43c-e3df-440a-b4af-419459035186',
              name: 'USA Exports',
            },
          },
          date: '2021-08-14T08:49:23Z',
          kind: 'interaction',
          subject: 'Telephone call with CEO',
        },
      },
      {
        id: 'c79ba298-9898-e211-a939-e4115bead28a',
        created_on: '2022-10-06T13:56:45.068248Z',
        last_interaction_date: '2021-02-09T08:49:23Z',
        event: '30 days since last interaction',
        company: {
          id: 'c79ba298-106e-4629-aa12-61ec6e2e47ce',
          name: 'Books Books Books',
        },
        interaction: {
          created_by: {
            name: 'Violet Roy',
            first_name: 'Violet',
            last_name: 'Roy',
            id: '3442c516-9898-e211-a939-e4115bead28a',
            dit_team: null,
          },
          date: '2021-02-09T08:49:23Z',
          kind: 'service_delivery',
          subject: 'Ran export event',
        },
      },
      {
        id: '4342c516-9898-e211-a939-e4115bead28a',
        created_on: '2022-10-06T13:56:45.068248Z',
        last_interaction_date: '2019-03-11T08:49:23Z',
        event: '30 days since last interaction',
        company: {
          id: 'b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
          name: 'Mars Exports Ltd',
        },
        interaction: null,
      },
    ],
  })
};

export const getNewExportInteractionReminders = function (req, res) {
  res.json({
    count: 15,
    next: null,
    previous: null,
    results: [
      {
        id: '4af1527e-ed3e-4af4-84fc-dc8bb19078bb',
        created_on: '2022-06-06T13:56:45.068248Z',
        last_interaction_date: '2021-08-14T08:49:23Z',
        event: '30 days since last interaction',
        company: {
          id: 'c79ba298-106e-4629-aa12-61ec6e2e47ce',
          name: 'Boring Company',
        },
        interaction: {
          created_by: {
            name: 'Shawn Cohen',
            first_name: 'Shawn',
            last_name: 'Cohen',
            id: '2c42c516-9898-e211-a939-e4115bead28a',
            dit_team: {
              id: '884ab43c-e3df-440a-b4af-419459035186',
              name: 'USA Exports',
            },
          },
          date: '2021-08-14T08:49:23Z',
          kind: 'interaction',
          subject: 'Telephone call with CEO',
        },
      },
      {
        id: 'c79ba298-9898-e211-a939-e4115bead28a',
        created_on: '2022-10-06T13:56:45.068248Z',
        last_interaction_date: '2021-02-09T08:49:23Z',
        event: '30 days since last interaction',
        company: {
          id: 'c79ba298-106e-4629-aa12-61ec6e2e47ce',
          name: 'Books Books Books',
        },
        interaction: {
          created_by: {
            name: 'Violet Roy',
            first_name: 'Violet',
            last_name: 'Roy',
            id: '3442c516-9898-e211-a939-e4115bead28a',
            dit_team: null,
          },
          date: '2021-02-09T08:49:23Z',
          kind: 'service_delivery',
          subject: 'Ran export event',
        },
      },
      {
        id: '4342c516-9898-e211-a939-e4115bead28a',
        created_on: '2022-10-06T13:56:45.068248Z',
        last_interaction_date: '2019-03-11T08:49:23Z',
        event: '30 days since last interaction',
        company: {
          id: 'b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
          name: 'Mars Exports Ltd',
        },
        interaction: null,
      },
    ],
  })
};

export const getNoRecentInvestmentInteractionReminders = function (req, res) {
  res.json({
    count: 15,
    next: null,
    previous: null,
    results: [
      {
        id: '4af1527e-ed3e-4af4-84fc-dc8bb19078bb',
        created_on: '2022-06-06T13:56:45.068248Z',
        event: '30 days since last interaction',
        project: {
          id: 'ea3a03ba-b239-4956-b2fb-f35c91109674',
          name: 'New fruit machine',
          project_code: 'DHP-00000009',
        },
      },
    ],
  })
};
