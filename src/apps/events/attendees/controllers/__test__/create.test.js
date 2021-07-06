const config = require('../../../../../config')
const { createAttendee } = require('../create')

const attendeesData = require('../../../../../../test/unit/data/interactions/attendees.json')
const event = require('../../../../../../test/unit/data/events/event-data.json')
const contact = require('../../../../../../test/unit/data/contacts/contact.json')

describe('Create attendee controller', () => {
  let req, res, next
  beforeEach(() => {
    req = {
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

    res = {
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {
        features: {},
      },
    }

    next = sinon.spy()
  })

  context(
    'when the controller is called with a valid contact and event',
    () => {
      beforeEach(async () => {
        req.params.contactId = '59c815d1-91d0-4d1f-b980-1d04157a298f'
        res.locals.event = event

        nock(config.apiRoot)
          .get(
            '/v3/interaction?limit=10&offset=0&event_id=31a9f8bd-7796-4af4-8f8c-25450860e2d1&contacts__id=59c815d1-91d0-4d1f-b980-1d04157a298f'
          )
          .reply(200, {
            count: 0,
            results: [],
          })
          .get('/v3/contact/59c815d1-91d0-4d1f-b980-1d04157a298f')
          .reply(200, contact)
          .post('/v3/interaction', {
            contacts: ['59c815d1-91d0-4d1f-b980-1d04157a298f'],
            companies: ['0fb3379c-341c-4da4-b825-bf8d47b26baa'],
            date: '2017-11-10',
            dit_participants: [{ adviser: '999' }],
            event: '31a9f8bd-7796-4af4-8f8c-25450860e2d1',
            is_event: true,
            kind: 'service_delivery',
            theme: 'other',
            service: '9484b82b-3499-e211-a939-e4115bead28a',
            subject: 'Attended A United Kingdom Get together',
            was_policy_feedback_provided: false,
            were_countries_discussed: false,
          })
          .reply(200, {})

        await createAttendee(req, res, next)
      })

      it('should save an interaction', () => {
        expect(nock.isDone()).to.be.true
      })

      it('should set a flash message to tell the user that the record was created', () => {
        expect(req.flash).to.be.calledWith(
          'success',
          'Event attendee added - This has created a service delivery record. If required, you can view or edit the service delivery directly from the attendee record.'
        )
      })

      it('should redirect the user to the attendee list', () => {
        expect(res.redirect).to.be.calledWith(
          '/events/31a9f8bd-7796-4af4-8f8c-25450860e2d1/attendees'
        )
      })

      it('should not call next', () => {
        expect(next).to.not.be.called
      })
    }
  )

  context(
    'when the controller is called with a valid contact but no event',
    () => {
      it('should call next', async () => {
        req.params.contactId = '59c815d1-91d0-4d1f-b980-1d04157a298f'

        await createAttendee(req, res, next)

        expect(next).to.be.calledOnce
        expect(next).to.be.calledWith(
          sinon.match({
            message: 'Missing eventId or contactId',
          })
        )
      })
    }
  )

  context(
    'when the controller is called with a valid event but no contact',
    () => {
      it('should call next', async () => {
        res.locals.event = event

        await createAttendee(req, res, next)

        expect(next).to.be.calledOnce
        expect(next).to.be.calledWith(
          sinon.match({
            message: 'Missing eventId or contactId',
          })
        )
      })
    }
  )

  context(
    'when the controller is called with a valid event but an existing attendee',
    () => {
      it('should set a flash message to tell the user that the attendee already exists', async () => {
        req.params.contactId = '9b1138ab-ec7b-497f-b8c3-27fed21694ef'
        res.locals.event = event

        nock(config.apiRoot)
          .get(
            '/v3/interaction?limit=10&offset=0&event_id=31a9f8bd-7796-4af4-8f8c-25450860e2d1&contacts__id=9b1138ab-ec7b-497f-b8c3-27fed21694ef'
          )
          .reply(200, attendeesData)

        await createAttendee(req, res, next)

        expect(req.flash).to.be.calledWith(
          'failure',
          'Event attendee not added - This contact has already been added as an event attendee'
        )
      })
    }
  )
})
