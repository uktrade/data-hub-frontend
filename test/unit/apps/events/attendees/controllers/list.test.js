const config = require('~/config')
const attendeesData = require('~/test/unit/data/interactions/attendees.json')

const { renderAttendees } = require('~/src/apps/events/attendees/controllers/list')

describe('event attendees', () => {
  beforeEach(() => {
    this.req = {
      params: {},
      query: {},
      session: {
        token: '4321',
      },
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      locals: {
        event: {
          id: '1234',
          name: 'Dance',
        },
      },
    }

    this.nextSpy = sinon.spy()
  })

  context('when there are no attendees', () => {
  })

  context('when there is an attendee', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/interaction?limit=10&offset=0&sortby=contact__last_name%2Ccontact__first_name&event_id=1234`)
        .reply(200, attendeesData)

      await renderAttendees(this.req, this.res, this.nextSpy)
      this.properties = this.res.render.firstCall.args[1]
    })

    it('should render the attendees layout', () => {
      const template = this.res.render.firstCall.args[0]
      expect(template).to.equal('events/attendees/views/list')
    })

    it('should fetch attendees from the API', () => {
      expect(nock.isDone()).to.be.true
    })

    it('should transform the results to a collection', () => {
      expect(this.properties).to.have.property('attendees')
      expect(this.properties.attendees).to.have.property('items').an('array')
      expect(this.properties.attendees).to.have.property('count', 1)
      expect(this.properties.attendees).to.have.property('pagination', null)
      expect(this.properties.attendees).to.have.property('countLabel', 'attendee')
    })

    it('should include transformed items in the returned collection', () => {
      const item = this.properties.attendees.items[0]
      expect(item).to.have.property('id')
      expect(item).to.have.property('type')
      expect(item).to.have.property('name')
      expect(item).to.have.property('meta')
    })

    it('calls next', () => {
      expect(this.nextSpy).to.not.be.called
    })
  })

  context('when there are many attendees', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/interaction?limit=10&offset=0&sortby=contact__last_name%2Ccontact__first_name&event_id=1234`)
        .reply(200, {
          ...attendeesData,
          count: 200,
        })

      await renderAttendees(this.req, this.res, this.nextSpy)
      this.properties = this.res.render.firstCall.args[1]
    })

    it('should include pagination information', () => {
      expect(this.properties.attendees.pagination).to.not.be.null
    })
  })

  context('when a specific page is requested', () => {
    beforeEach(async () => {
      this.req.query.page = 2

      nock(config.apiRoot)
        .get(`/v3/interaction?limit=10&offset=10&sortby=contact__last_name%2Ccontact__first_name&event_id=1234`)
        .reply(200, {
          ...attendeesData,
          count: 200,
        })

      await renderAttendees(this.req, this.res, this.nextSpy)
      this.properties = this.res.render.firstCall.args[1]
    })

    it('should fetch attendees from the API', () => {
      expect(nock.isDone()).to.be.true
    })
  })

  context('when there is an error fetching attendees', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/interaction?limit=10&offset=0&sortby=contact__last_name%2Ccontact__first_name&event_id=1234`)
        .reply(500, 'Error message')

      await renderAttendees(this.req, this.res, this.nextSpy)
    })

    it('should not call render', () => {
      expect(this.res.render).to.not.be.called
    })

    it('should call next', () => {
      expect(this.nextSpy).to.be.calledOnce
      expect(this.nextSpy).to.be.calledWith(sinon.match({
        message: '500 - "Error message"',
      }))
    })
  })
})
