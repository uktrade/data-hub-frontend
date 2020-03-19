module.exports = function(req, res) {
  return res.json({
    count: 3,
    results: [
      {
        id: 'foo',
        status: 'complete',
        subject: 'Andy to Lou',
        created_on: '2021-11-25',
        completed_on: '2021-11-25',
        company: {
          name: 'Andy & Lou',
        },
        created_by: {
          name: 'Andy Pipkin',
          contact_email: 'andy.pipkin@gov.uk',
          dit_team: {
            name: 'Little Britain',
          },
        },
        recipient: {
          name: 'Lou Todd',
          contact_email: 'lou.todd@gov.uk',
          dit_team: {
            name: 'Little Britain',
          },
        },
      },
      {
        id: 'bar',
        status: 'outstanding',
        subject: 'Lou to Andy',
        created_on: '2021-11-25',
        company: {
          name: 'Andy & Lou',
        },
        created_by: {
          name: 'Lou Todd',
          contact_email: 'lou.todd@gov.uk',
          dit_team: {
            name: 'Little Britain',
          },
        },
        recipient: {
          name: 'Andy Pipkin',
          contact_email: 'andy.pipkin@gov.uk',
          dit_team: {
            name: 'Little Britain',
          },
        },
      },
      {
        id: 'baz',
        status: 'complete',
        completed_on: '2021-11-25',
        subject: 'Have you got a bandage?',
        created_on: '2021-11-25',
        company: {
          name: 'Andy & Lou',
        },
        created_by: {
          name: 'Andy Pipkin',
          dit_team: {
            name: 'Little Britain',
          },
        },
        recipient: {
          name: 'Lou Todd',
        },
      },
    ],
  })
}
