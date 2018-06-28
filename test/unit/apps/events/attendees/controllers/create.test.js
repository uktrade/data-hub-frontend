const config = require('~/config')
const { createAttendee } = require('~/src/apps/events/attendees/controllers/create')
const event = require('~/test/unit/data/events/event-data.json')
const contact = require('~/test/unit/data/contacts/contact.json')

describe('Create attendee controller', () => {
  beforeEach(() => {
    this.req = {
      params: {},
      query: {},
      session: {
        token: '4321',
        user: {
          id: '999',
        },
      },
      flash: sinon.spy(),
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {},
    }

    this.nextSpy = sinon.spy()
  })

  context('when the controller is called with a valid contact and event', () => {
    beforeEach(async () => {
      this.req.params.contactId = '59c815d1-91d0-4d1f-b980-1d04157a298f'
      this.res.locals.event = event

      nock(config.apiRoot)
        .get('/v3/contact/59c815d1-91d0-4d1f-b980-1d04157a298f')
        .reply(200, contact)
        .post('/v3/interaction', {
          contact: '59c815d1-91d0-4d1f-b980-1d04157a298f',
          company: '0fb3379c-341c-4da4-b825-bf8d47b26baa',
          date: '2017-11-10',
          dit_adviser: '999',
          dit_team: '42f12898-9698-e211-a939-e4115bead28a',
          event: '31a9f8bd-7796-4af4-8f8c-25450860e2d1',
          is_event: true,
          kind: 'service_delivery',
          service: '9484b82b-3499-e211-a939-e4115bead28a',
          subject: 'Attended A United Kingdom Get together',
        })
        .reply(200, {})

      await createAttendee(this.req, this.res, this.nextSpy)
    })

    it('should save an interaction', () => {
      expect(nock.isDone()).to.be.true
    })

    it('should set a flash message to tell the user that the record was created', () => {
      expect(this.req.flash).to.be.calledWith('success', 'Event attendee added - This has created a service delivery record. If required, you can view or edit the service delivery directly from the attendee record.')
    })

    it('should redirect the user to the attendee list', () => {
      expect(this.res.redirect).to.be.calledWith('/events/31a9f8bd-7796-4af4-8f8c-25450860e2d1/attendees')
    })

    it('should not call next', () => {
      expect(this.nextSpy).to.not.be.called
    })
  })

  context('when the controller is called with a valid contact but no event', () => {
    beforeEach(async () => {
      this.req.params.contactId = '59c815d1-91d0-4d1f-b980-1d04157a298f'
      await createAttendee(this.req, this.res, this.nextSpy)
    })

    it('should call next', () => {
      expect(this.nextSpy).to.be.calledOnce
      expect(this.nextSpy).to.be.calledWith(sinon.match({
        message: 'Missing eventId or contactId',
      }))
    })
  })

  context('when the controller is called with a valid event but no contact', () => {
    beforeEach(async () => {
      this.res.locals.event = event
      await createAttendee(this.req, this.res, this.nextSpy)
    })

    it('should call next', () => {
      expect(this.nextSpy).to.be.calledOnce
      expect(this.nextSpy).to.be.calledWith(sinon.match({
        message: 'Missing eventId or contactId',
      }))
    })
  })
})
