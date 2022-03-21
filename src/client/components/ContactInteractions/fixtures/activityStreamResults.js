const activityStreamResults = {
  hits: {
    hits: [
      {
        _index:
          'activities__feed_id_datahub-interactions__date_2022-03-11__timestamp_1646997999__batch_id_v5w4nmpr__',
        _type: '_doc',
        _id: 'dit:DataHubInteraction:cce5e0a4-0843-4ca2-80ad-20c9227f2a54:Announce',
        _score: null,
        _source: {
          generator: {
            name: 'dit:dataHub',
            type: 'Application',
          },
          id: 'dit:DataHubInteraction:cce5e0a4-0843-4ca2-80ad-20c9227f2a54:Announce',
          object: {
            attributedTo: [
              {
                'dit:companiesHouseNumber': null,
                'dit:dunsNumber': null,
                id: 'dit:DataHubCompany:9db75fa7-abb0-4acc-be25-2805e0142a56',
                name: "Lauren's Company",
                type: ['Organization', 'dit:Company'],
              },
              {
                'dit:emailAddress': 'lauren.qurashi@digital.trade.gov.uk',
                'dit:team': {
                  id: 'dit:DataHubTeam:76a9ed9f-c9ff-4569-8a9a-8f20b63c97ef',
                  name: 'Digital Data Hub - Live Service',
                  type: ['Group', 'dit:Team'],
                },
                id: 'dit:DataHubAdviser:818e49e9-b8d3-442e-b736-6707e19ec2fa',
                name: 'Lauren Qurashi',
                type: ['Person', 'dit:Adviser'],
              },
              {
                'dit:emailAddress': 'JimBob@yeehaw.com',
                'dit:jobTitle': '',
                id: 'dit:DataHubContact:992a3449-3a60-4e53-a39a-7702528ad617',
                name: 'Jim Bob',
                type: ['Person', 'dit:Contact'],
                url: 'https://www.datahub.dev.uktrade.io/contacts/992a3449-3a60-4e53-a39a-7702528ad617',
              },
            ],
            'dit:archived': false,
            'dit:communicationChannel': {
              name: 'Email/Website',
            },
            'dit:service': {
              name: 'Enquiry received : Commonwealth Games 2022 – GEP Programme',
            },
            'dit:status': 'complete',
            'dit:subject': 'ftyuio',
            id: 'dit:DataHubInteraction:cce5e0a4-0843-4ca2-80ad-20c9227f2a54',
            startTime: '2022-02-25T00:00:00Z',
            type: ['dit:Event', 'dit:Interaction'],
            url: 'https://www.datahub.dev.uktrade.io/interactions/cce5e0a4-0843-4ca2-80ad-20c9227f2a54',
          },
          published: '2022-03-01T12:38:43.818051Z',
          type: 'Announce',
        },
        sort: [1646138323818],
      },
      {
        _index:
          'activities__feed_id_dummy-data-feed__date_2022-03-11__timestamp_1646998003__batch_id_kc0ew8vl__',
        _type: '_doc',
        _id: 'dit:aventri:Event:1111:Attendee:1111:Create',
        _score: null,
        _source: {
          'dit:application': 'aventri',
          id: 'dit:aventri:Event:1111:Attendee:1111:Create',
          object: {
            attributedTo: {
              id: 'dit:aventri:Event:1111',
              type: 'dit:aventri:Event',
            },
            'dit:aventri:approvalstatus': '',
            'dit:aventri:approvalstatus': null,
            'dit:aventri:companyname': 'Acme Ltd',
            'dit:aventri:createdby': 'attendee',
            'dit:aventri:email': 'firstname1.lastname1@example.host',
            'dit:aventri:firstname': 'Firstname1',
            'dit:aventri:language': 'eng',
            'dit:aventri:lastmodified': '2022-01-24T11:12:13',
            'dit:aventri:lastname': 'Lastname1',
            'dit:aventri:modifiedby': 'attendee',
            'dit:aventri:registrationstatus': 'Confirmed',
            id: 'dit:aventri:Attendee:1234',
            published: '1970-01-01T00:00:00',
            type: ['dit:aventri:Attendee'],
          },
          published: '2022-02-24T11:28:57',
          type: 'dit:aventri:Attendee',
        },
        sort: [1645702137000],
      },
      {
        _index:
          'activities__feed_id_dummy-data-feed__date_2022-03-11__timestamp_1646998003__batch_id_kc0ew8vl__',
        _type: '_doc',
        _id: 'dit:aventri:Event:3333:Attendee:3333:Create',
        _score: null,
        _source: {
          'dit:application': 'aventri',
          id: 'dit:aventri:Event:3333:Attendee:3333:Create',
          object: {
            attributedTo: {
              id: 'dit:aventri:Event:3333',
              type: 'dit:aventri:Event',
            },
            'dit:aventri:approvalstatus': '',
            'dit:aventri:approvalstatus': null,
            'dit:aventri:companyname': 'Another Company Org',
            'dit:aventri:createdby': 'attendee',
            'dit:aventri:email': 'firstname3.lastname3@example.host',
            'dit:aventri:firstname': 'Firstname3',
            'dit:aventri:language': 'eng',
            'dit:aventri:lastmodified': '2022-02-14T11:12:13',
            'dit:aventri:lastname': 'Lastname3',
            'dit:aventri:modifiedby': 'attendee',
            'dit:aventri:registrationstatus': 'Confirmed',
            id: 'dit:aventri:Attendee:9012',
            published: '1970-01-01T00:00:00',
            type: ['dit:aventri:Attendee'],
          },
          published: '2022-02-14T11:12:13',
          type: 'dit:aventri:Attendee',
        },
        sort: [1644837133000],
      },
      {
        _index:
          'activities__feed_id_dummy-data-feed__date_2022-03-11__timestamp_1646998003__batch_id_kc0ew8vl__',
        _type: '_doc',
        _id: 'dit:aventri:Event:2222:Attendee:2222:Create',
        _score: null,
        _source: {
          'dit:application': 'aventri',
          id: 'dit:aventri:Event:2222:Attendee:2222:Create',
          object: {
            attributedTo: {
              id: 'dit:aventri:Event:2222',
              type: 'dit:aventri:Event',
            },
            'dit:aventri:approvalstatus': '',
            'dit:aventri:approvalstatus': null,
            'dit:aventri:companyname': 'Disney Corp',
            'dit:aventri:createdby': 'attendee',
            'dit:aventri:email': 'firstname2.lastname2@example.host',
            'dit:aventri:firstname': 'Firstname2',
            'dit:aventri:language': 'eng',
            'dit:aventri:lastmodified': '2022-02-04T11:12:13',
            'dit:aventri:lastname': 'Lastname2',
            'dit:aventri:modifiedby': 'attendee',
            'dit:aventri:registrationstatus': 'Confirmed',
            id: 'dit:aventri:Attendee:5678',
            published: '1970-01-01T00:00:00',
            type: ['dit:aventri:Attendee'],
          },
          published: '2022-02-04T11:12:13',
          type: 'dit:aventri:Attendee',
        },
        sort: [1643973133000],
      },
    ],
  },
}

const activitiesResult = {
  activities: [
    {
      generator: {
        name: 'dit:dataHub',
        type: 'Application',
      },
      id: 'dit:DataHubInteraction:cce5e0a4-0843-4ca2-80ad-20c9227f2a54:Announce',
      object: {
        attributedTo: [
          {
            'dit:companiesHouseNumber': null,
            'dit:dunsNumber': null,
            id: 'dit:DataHubCompany:9db75fa7-abb0-4acc-be25-2805e0142a56',
            name: "Lauren's Company",
            type: ['Organization', 'dit:Company'],
          },
          {
            'dit:emailAddress': 'lauren.qurashi@digital.trade.gov.uk',
            'dit:team': {
              id: 'dit:DataHubTeam:76a9ed9f-c9ff-4569-8a9a-8f20b63c97ef',
              name: 'Digital Data Hub - Live Service',
              type: ['Group', 'dit:Team'],
            },
            id: 'dit:DataHubAdviser:818e49e9-b8d3-442e-b736-6707e19ec2fa',
            name: 'Lauren Qurashi',
            type: ['Person', 'dit:Adviser'],
          },
          {
            'dit:emailAddress': 'JimBob@yeehaw.com',
            'dit:jobTitle': '',
            id: 'dit:DataHubContact:992a3449-3a60-4e53-a39a-7702528ad617',
            name: 'Jim Bob',
            type: ['Person', 'dit:Contact'],
            url: 'https://www.datahub.dev.uktrade.io/contacts/992a3449-3a60-4e53-a39a-7702528ad617',
          },
        ],
        'dit:archived': false,
        'dit:communicationChannel': {
          name: 'Email/Website',
        },
        'dit:service': {
          name: 'Enquiry received : Commonwealth Games 2022 – GEP Programme',
        },
        'dit:status': 'complete',
        'dit:subject': 'ftyuio',
        id: 'dit:DataHubInteraction:cce5e0a4-0843-4ca2-80ad-20c9227f2a54',
        startTime: '2022-02-25T00:00:00Z',
        type: ['dit:Event', 'dit:Interaction'],
        url: 'https://www.datahub.dev.uktrade.io/interactions/cce5e0a4-0843-4ca2-80ad-20c9227f2a54',
      },
      published: '2022-03-01T12:38:43.818051Z',
      type: 'Announce',
    },
    {
      'dit:application': 'aventri',
      id: 'dit:aventri:Event:2222:Attendee:2222:Create',
      object: {
        attributedTo: {
          id: 'dit:aventri:Event:2222',
          type: 'dit:aventri:Event',
        },
        'dit:aventri:approvalstatus': '',
        'dit:aventri:approvalstatus': null,
        'dit:aventri:companyname': 'Acme Ltd',
        'dit:aventri:createdby': 'attendee',
        'dit:aventri:email': 'firstname2.lastname2@example.host',
        'dit:aventri:firstname': 'Firstname2',
        'dit:aventri:language': 'eng',
        'dit:aventri:lastmodified': '2022-02-04T11:12:13',
        'dit:aventri:lastname': 'Lastname2',
        'dit:aventri:modifiedby': 'attendee',
        'dit:aventri:registrationstatus': 'Confirmed',
        id: 'dit:aventri:Attendee:5678',
        published: '1970-01-01T00:00:00',
        type: ['dit:aventri:Attendee'],
      },
      published: '2022-02-04T11:12:13',
      type: 'dit:aventri:Attendee',
    },
  ],
}

module.exports = {
  activitiesResult,
  activityStreamResults,
}
