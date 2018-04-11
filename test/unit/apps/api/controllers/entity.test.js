const { assign } = require('lodash')

const config = require('~/config')
const { getEntityOptionsHandler } = require('~/src//apps/api/controllers/entity')

describe('Adviser options API controller', () => {
  beforeEach(() => {
    this.bertSmith = {
      id: '1',
      name: 'Bert Smith',
      is_active: false,
      last_login: null,
      first_name: 'Bert',
      last_name: 'Smith',
      email: 'bert.smith@mockexample.com',
      contact_email: '',
      telephone_number: '',
      dit_team: {
        id: 't1',
        name: 'Team E',
        role: 'r1',
        uk_region: null,
        country: 'c1',
      },
    }

    this.reqMock = {
      session: {
        token: '1234',
      },
      params: {
        entity: 'adviser',
      },
    }

    this.resMock = {
      json: sandbox.spy(),
    }

    this.nextSpy = sandbox.spy()
  })

  context('when called with a name for an adviser', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/adviser/?first_name__icontains=be')
        .reply(200, {
          results: [this.bertSmith],
        })

      const reqMock = assign({}, this.reqMock, {
        query: {
          term: 'be',
        },
      })

      await getEntityOptionsHandler(reqMock, this.resMock, this.nextSpy)
    })

    it('should return the advisers found, transformed', () => {
      expect(this.resMock.json).to.be.calledWith([{
        value: '1',
        label: 'Bert Smith',
        subLabel: 'Team E',
      }])
    })
  })
})

describe('Event options API controller', () => {
  beforeEach(() => {
    this.mockEvent = {
      id: '123',
      name: 'name',
      event_type: 'event_type',
      start_date: '2018-01-01',
      start_date_year: '2018',
      start_date_month: '01',
      start_date_day: '01',
      end_date: '2018-02-02',
      end_date_year: '2018',
      end_date_month: '02',
      end_date_day: '02',
      location_type: 'location_type',
      address_1: 'address 1',
      address_2: 'address 2',
      address_town: 'town',
      address_county: 'county',
      postcode: 'postcode',
      address_country: 'country',
      uk_region: 'uk_region',
      notes: 'notes',
      lead_team: {
        id: 2,
        name: 'lead_team',
      },
      organiser: 'organiser',
      related_programmes: [ 'programme1', 'programme2' ],
      teams: [
        {
          id: 0,
          name: 'team1',
        }, {
          id: 1,
          name: 'team2',
        }, {
          id: 2,
          name: 'lead_team',
        },
      ],
      services: 'services',
      service: '1783ae93-b78f-e611-8c55-e4115bed50dc',
    }

    this.reqMock = {
      session: {
        token: '1234',
      },
      params: {
        entity: 'event',
      },
    }

    this.resMock = {
      json: sandbox.spy(),
    }

    this.nextSpy = sandbox.spy()
  })

  context('when called with an id for an event', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/v3/event/123')
        .reply(200, this.mockEvent)

      const reqMock = assign({}, this.reqMock, {
        query: {
          term: '123',
        },
      })

      await getEntityOptionsHandler(reqMock, this.resMock, this.nextSpy)
    })

    it('should return the event found, transformed', () => {
      expect(this.resMock.json).to.be.calledWith({
        id: '123',
        name: 'name',
        details: [
          {
            key: 'service',
            value: '1783ae93-b78f-e611-8c55-e4115bed50dc',
            label: 'Service',
          },
          {
            key: 'lead_team',
            value: {
              id: 2,
              name: 'lead_team',
            },
            label: 'Team hosting the event',
          },
          {
            key: 'organiser',
            value: 'organiser',
            label: 'Organiser',
          },
          {
            key: 'related_programmes',
            value: [ 'programme1', 'programme2' ],
            label: 'Related programmes',
          },
          {
            key: 'teams_shared_with',
            value: [{
              id: 0,
              name: 'team1',
            }, {
              id: 1,
              name: 'team2',
            },
            ],
            label: 'Event shared with',
          },
        ],
      })
    })
  })
})
