exports.getEstimatedLandDateSubscriptions = function (req, res) {
  res.json({
    reminder_days: [60, 30],
    email_reminders_enabled: false,
  })
}

exports.getNoRecentInteractionsSubscriptions = function (req, res) {
  res.json({
    reminder_days: [30, 50, 70],
    email_reminders_enabled: false,
  })
}

exports.getEstimatedLandDateReminders = function (req, res) {
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
}

exports.getNoRecentInvestmentInteractionReminders = function (req, res) {
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
}
