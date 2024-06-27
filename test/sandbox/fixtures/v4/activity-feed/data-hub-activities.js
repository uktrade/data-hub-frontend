import { generateAventriEventHits } from './aventri-events.js'

export const generateInvestment = () => ({
  _index: 'activities__feed_id_datahub',
  _type: '_doc',
  _id: 'dit:DataHubInvestmentProject:d9e25847-6199-e211-a939-e4115bead28a:Add',
  _score: null,
  _source: {
    actor: {
      'dit:emailAddress': 'CDMS\\CDMSInstall',
      id: 'dit:DataHubAdviser:419fe8a8-3e95-e211-a939-e4115bead28a',
      name: 'CDMSInstall Last name',
      type: ['Person', 'dit:Adviser'],
    },
    generator: {
      name: 'dit:dataHub',
      type: 'Application',
    },
    id: 'dit:DataHubInvestmentProject:d9e25847-6199-e211-a939-e4115bead28a:Add',
    object: {
      attributedTo: [
        {
          'dit:companiesHouseNumber': null,
          'dit:dunsNumber': '656147733',
          id: 'dit:DataHubCompany:81ee3ac7-a098-e211-a939-e4115bead28a',
          name: 'ASUSTEK COMPUTER INCORPORATION',
          type: ['Organization', 'dit:Company'],
        },
      ],
      'dit:investmentType': {
        name: 'FDI',
      },
      'dit:numberNewJobs': 20,
      id: 'dit:DataHubInvestmentProject:d9e25847-6199-e211-a939-e4115bead28a',
      name: 'Asus UK expansion',
      startTime: '2011-11-23T00:00:00Z',
      type: ['dit:InvestmentProject'],
      url: 'https://www.datahub.trade.gov.uk/investments/projects/d9e25847-6199-e211-a939-e4115bead28a',
      published: new Date().toISOString(),
    },
    published: '2011-11-23T00:00:00Z',
    type: 'Add',
  },
})

export const generateInteraction = () => ({
  _index:
    'activities__feed_id_datahub-interactions__date_2019-06-20__timestamp_1561034480__batch_id_xputyeio__',
  _type: '_doc',
  _id: 'dit:DataHubInteraction:856b95f1-c221-4c41-9649-625e2a7d5262:Announce',
  _score: null,
  _source: {
    generator: {
      name: 'dit:dataHub',
      type: 'Application',
    },
    id: 'dit:DataHubInteraction:856b95f1-c221-4c41-9649-625e2a7d5262:Announce',
    object: {
      attributedTo: [
        {
          'dit:companiesHouseNumber': null,
          'dit:dunsNumber': null,
          id: 'dit:DataHubCompany:0fb3379c-341c-4da4-b825-bf8d47b26baa',
          name: 'Lambda plc',
          type: ['Organization', 'dit:Company'],
        },
        {
          'dit:emailAddress': 'Brendan.Smith@trade.gov.uk',
          'dit:team': {
            id: 'dit:DataHubTeam:3a48318c-9698-e211-a939-e4115bead28a',
            name: 'Digital Data Hub - Live Service',
            type: ['Group', 'dit:Team'],
          },
          id: 'dit:DataHubAdviser:8891ec72-b4ec-4977-9656-839346bc6011',
          name: 'Brendan Smith',
          type: ['Person', 'dit:Adviser'],
        },
        {
          'dit:emailAddress': 'Tyson.Morar@example.com',
          'dit:jobTitle': 'Product Metrics Associate',
          id: 'dit:DataHubContact:e2eee6cd-acf6-454a-a4a8-f6c8fa604fde',
          name: 'Tyson Morar',
          type: ['Person', 'dit:Contact'],
          url: 'https://dev.datahub.uktrade.digital/contacts/e2eee6cd-acf6-454a-a4a8-f6c8fa604fde',
        },
      ],
      'dit:archived': false,
      'dit:service': {
        name: 'Export introductions : Someone else in DBT',
      },
      'dit:status': 'draft',
      'dit:subject': 'Meeting between Brendan Smith and Tyson Morar',
      id: 'dit:DataHubInteraction:856b95f1-c221-4c41-9649-625e2a7d5262',
      startTime: '2019-06-10T16:00:00Z',
      type: ['dit:Event', 'dit:Interaction'],
      url: 'https://dev.datahub.uktrade.digital/interactions/856b95f1-c221-4c41-9649-625e2a7d5262',
      published: new Date().toISOString(),
    },
    published: '2019-06-17T16:02:28.796549Z',
    type: 'Announce',
  },
  sort: [1560787348796],
})

export const generateDataHubActivitiesESResponse = () => ({
  took: 15,
  timed_out: false,
  _shards: {
    total: 45,
    successful: 45,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 1233,
      relation: 'eq',
    },
    max_score: null,
    hits: [
      generateInteraction(),
      generateInvestment(),
      ...generateAventriEventHits(),
    ],
  },
})
