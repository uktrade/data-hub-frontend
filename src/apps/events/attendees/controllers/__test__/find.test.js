const config = require('../../../../../config')
const { renderFindAttendee, findAttendee } = require('../find')
const event = require('../../../../../../test/unit/data/events/event-data.json')
const attendeesData = require('../../../../../../test/unit/data/interactions/attendees.json')

const contacts = require('../../../../../../test/unit/data/contacts/contact-search-result.json')

describe('Find new event attendees controller', () => {
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
      title: sinon.stub().returnsThis(),
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {},
    }

    this.nextSpy = sinon.spy()
  })

  describe('#renderFindAttendee', () => {
    context('when called with an event', () => {
      beforeEach(async () => {
        this.res.locals.event = event
        await renderFindAttendee(this.req, this.res, this.nextSpy)
      })
      // TODO: add breadcrumb tests to: test/functional/cypress/specs/events/attendees-spec.js
      it('should set the first part of the breadcrumb to a link back to attendee list', () => {
        expect(this.res.breadcrumb.firstCall.args).to.deep.equal([
          'A United Kingdom Get together',
          '/events/31a9f8bd-7796-4af4-8f8c-25450860e2d1/attendees',
        ])
      })

      // TODO: add breadcrumb tests to: test/functional/cypress/specs/events/attendees-spec.js
      it('should set the last part of the breadcrumb to incidate the user is adding an attendee', () => {
        expect(this.res.breadcrumb.callCount).to.eq(2)
        expect(this.res.breadcrumb.secondCall.args).to.deep.equal([
          'Add attendee',
        ])
      })

      // TODO: add title check to: test/functional/cypress/specs/events/attendees-spec.js
      it('should set the page title to the title of the event', () => {
        expect(this.res.title).to.be.calledOnce
        expect(this.res.title).to.be.calledWith('A United Kingdom Get together')
      })

      // NOTE: covered by test/functional/cypress/specs/events/attendees-spec.js
      it('should render the correct template', () => {
        expect(this.res.render).to.be.calledWith('events/attendees/views/find')
      })

      // Not sure this is a necessary test if we're checking what is rendered in the functional test
      it('should not call next', () => {
        expect(this.nextSpy).to.not.be.called
      })
    })

    // NOTE: not sure this is a meaningful test of functionality
    context('when called without an event', () => {
      beforeEach(async () => {
        await renderFindAttendee(this.req, this.res, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
        expect(this.nextSpy).to.be.calledWith(
          sinon.match({
            message: 'Missing event',
          })
        )
      })
    })
  })

  // NOTE: some of this is exercised by the event-spec.js DIT e2e test, line 135 onwards - except where noted. Given that there are a few different scenarios, it may be worth rolling the missing scenarios into an updated and more thorough attendees-spec functional test
  describe('#findAttendee', () => {
    context('when called with an event', () => {
      beforeEach(() => {
        this.res.locals.event = event
      })

      context('and a search term', () => {
        beforeEach(() => {
          this.req.query.term = 'Fred '
        })

        context('with a couple of results', () => {
          beforeEach(async () => {
            this.req.query.page = '1'

            nock(config.apiRoot)
              .get(
                '/v3/interaction?limit=9999&offset=0&event_id=31a9f8bd-7796-4af4-8f8c-25450860e2d1'
              )
              .reply(200, attendeesData)
              .post('/v3/search/contact', {
                archived: false,
                original_query: 'Fred',
                term: '',
                limit: 10,
                offset: 0,
              })
              .reply(200, {
                count: 1,
                results: [contacts],
              })

            await findAttendee(this.req, this.res, this.nextSpy)
          })

          it('should call the search API', () => {
            expect(nock.isDone()).to.be.true
          })

          it('should include contacts', () => {
            expect(this.res.locals).to.have.property('contacts')
          })

          it('should transform the contacts for display with a link to add to event', () => {
            const firstContact = this.res.locals.contacts.items[0]

            expect(firstContact).to.deep.equal({
              id: '12651151-2149-465e-871b-ac45bc568a62',
              url:
                '/events/31a9f8bd-7796-4af4-8f8c-25450860e2d1/attendees/create/12651151-2149-465e-871b-ac45bc568a62',
              type: 'contact',
              name: 'Fred Smith',
              subTitle: {
                label: 'Updated on',
                type: 'datetime',
                value: '2017-02-14T14:49:17',
              },
              isArchived: false,
              meta: [
                { label: 'Company', value: 'Fred ltd' },
                { label: 'Job title', value: 'Director' },
                { label: 'Sector', value: 'Aerospace' },
                { label: 'Country', value: 'United Kingdom' },
                { label: 'Phone number', value: '(+44) 07814 333 777' },
                { label: 'Email', value: 'fred@test.com' },
                {
                  label: 'Contact type',
                  type: 'badge',
                  value: 'Primary',
                  badgeModifier: 'secondary',
                },
              ],
            })
          })

          it('should include the original query in the result', () => {
            expect(this.res.locals.contacts).to.have.property('query')
            expect(this.res.locals.contacts.query).to.deep.equal({
              term: 'Fred ',
              page: '1',
            })
          })

          it('should include collection count information', () => {
            expect(this.res.locals.contacts).to.have.property('count', 1)
          })

          it('should not include pagination information', () => {
            expect(this.res.locals.contacts.pagination).to.be.null
          })

          it('should include the search term, trimmed', () => {
            expect(this.res.locals).to.have.property('searchTerm', 'Fred')
          })

          it('should highlight the search term', () => {
            expect(this.res.locals.contacts).to.have.property(
              'highlightTerm',
              'Fred'
            )
          })

          it('should call next to move to the next middleware', () => {
            expect(this.nextSpy).to.be.calledOnce
            expect(this.nextSpy).to.be.calledWithExactly()
          })

          it('should use the block link style for results', () => {
            expect(this.res.locals.contacts).to.have.property(
              'listModifier',
              'block-links'
            )
          })
          // TODO: add checks to test/functional/cypress/specs/events/attendees-spec.js that check search term displayed to user
          it('should include the search term in the locals', () => {
            expect(this.res.locals.searchTerm).to.equal('Fred')
          })
        })
        // TODO: add check to test/functional/cypress/specs/events/attendees-spec.js for paginated results
        context('with lots of results and asking for page 2', () => {
          beforeEach(async () => {
            this.req.query.page = '2'

            nock(config.apiRoot)
              .get(
                '/v3/interaction?limit=9999&offset=0&event_id=31a9f8bd-7796-4af4-8f8c-25450860e2d1'
              )
              .reply(200, attendeesData)
              .post('/v3/search/contact', {
                archived: false,
                original_query: 'Fred',
                term: '',
                limit: 10,
                offset: 10,
              })
              .reply(200, {
                count: 50,
                results: [contacts],
              })

            await findAttendee(this.req, this.res, this.nextSpy)
          })

          it('should call the search API', () => {
            expect(nock.isDone()).to.be.true
          })

          it('should include contacts', () => {
            expect(this.res.locals).to.have.property('contacts')
          })

          it('should include the original query in the result', () => {
            expect(this.res.locals.contacts).to.have.property('query')
            expect(this.res.locals.contacts.query).to.deep.equal({
              page: '2',
              term: 'Fred ',
            })
          })

          it('should include collection count information', () => {
            expect(this.res.locals.contacts).to.have.property('count', 50)
          })

          it('should return pagination data', () => {
            const pagination = this.res.locals.contacts.pagination

            expect(pagination).to.have.property('currentPage', 2)
            expect(pagination).to.have.property('totalPages', 5)
            expect(pagination.pages).to.have.length(5)
          })
        })
        // TODO: add a duplicate attendee fixture to the attendees-spec test
        context('when one of the results is an existing attendee', () => {
          beforeEach(async () => {
            this.req.query.page = '1'

            nock(config.apiRoot)
              .get(
                '/v3/interaction?limit=9999&offset=0&event_id=31a9f8bd-7796-4af4-8f8c-25450860e2d1'
              )
              .reply(200, attendeesData)
              .post('/v3/search/contact', {
                archived: false,
                original_query: 'Fred',
                term: '',
                limit: 10,
                offset: 0,
              })
              .reply(200, {
                count: 1,
                results: [
                  {
                    ...contacts,
                    id: '9b1138ab-ec7b-497f-b8c3-27fed21694ef',
                  },
                ],
              })

            await findAttendee(this.req, this.res, this.nextSpy)
          })

          it('should mark the contact result as an existing attendee', () => {
            const contact = this.res.locals.contacts.items[0]
            expect(contact).to.have.property('isLinkDisabled', true)
          })

          it('should include a badge to say it has previously been added', () => {
            const meta = this.res.locals.contacts.items[0].meta
            const badges = meta.filter((metaItem) => metaItem.type === 'badge')

            expect(badges).to.have.length(1)
            expect(badges[0]).to.deep.equal({
              label: 'Existing',
              type: 'badge',
              value: 'Existing attendee',
            })
          })
        })
        // TODO: add a search failure context test case to the attendees-spec functional test
        context('when there is an error searching for contacts', () => {
          beforeEach(async () => {
            this.req.query.page = '1'

            nock(config.apiRoot)
              .get(
                '/v3/interaction?limit=9999&offset=0&event_id=31a9f8bd-7796-4af4-8f8c-25450860e2d1'
              )
              .reply(200, attendeesData)
              .post('/v3/search/contact', {
                archived: false,
                original_query: 'Fred',
                term: '',
                limit: 10,
                offset: 0,
              })
              .reply(500, 'Error message')

            await findAttendee(this.req, this.res, this.nextSpy)
          })

          it('should call next with the error', () => {
            expect(this.nextSpy.calledOnce).to.be.true

            expect(this.nextSpy).to.be.calledWith(
              sinon.match({
                message: '500 - "Error message"',
              })
            )
          })
        })
      })
    })
    // NOTE: as above, I'm not sure this is a helpful test
    context('when no event is supplied', () => {
      beforeEach(async () => {
        await findAttendee(this.req, this.res, this.nextSpy)
      })

      it('should call next with the error', () => {
        expect(this.nextSpy.calledOnce).to.be.true

        expect(this.nextSpy).to.be.calledWith(
          sinon.match({
            message: 'No event supplied',
          })
        )
      })
    })
  })
})
