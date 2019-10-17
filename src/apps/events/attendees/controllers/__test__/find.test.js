const config = require('~/config')
const { renderFindAttendee, findAttendee } = require('~/src/apps/events/attendees/controllers/find')
const event = require('~/test/unit/data/events/event-data.json')
const attendeesData = require('~/test/unit/data/interactions/attendees.json')

const contacts = require('~/test/unit/data/contacts/contact-search-result.json')

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

      it('should set the first part of the breadcrumb to a link back to attendee list', () => {
        expect(this.res.breadcrumb.firstCall.args).to.deep.equal([
          'A United Kingdom Get together',
          '/events/31a9f8bd-7796-4af4-8f8c-25450860e2d1/attendees',
        ])
      })

      it('should set the last part of the breadcrumb to incidate the user is adding an attendee', () => {
        expect(this.res.breadcrumb.callCount).to.eq(2)
        expect(this.res.breadcrumb.secondCall.args).to.deep.equal(['Add attendee'])
      })

      it('should set the page title to the title of the event', () => {
        expect(this.res.title).to.be.calledOnce
        expect(this.res.title).to.be.calledWith('A United Kingdom Get together')
      })

      it('should render the correct template', () => {
        expect(this.res.render).to.be.calledWith('events/attendees/views/find')
      })

      it('should not call next', () => {
        expect(this.nextSpy).to.not.be.called
      })
    })

    context('when called without an event', () => {
      beforeEach(async () => {
        await renderFindAttendee(this.req, this.res, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
        expect(this.nextSpy).to.be.calledWith(sinon.match({
          message: 'Missing event',
        }))
      })
    })
  })

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
              .get('/v3/interaction?limit=9999&offset=0&event_id=31a9f8bd-7796-4af4-8f8c-25450860e2d1')
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
              url: '/events/31a9f8bd-7796-4af4-8f8c-25450860e2d1/attendees/create/12651151-2149-465e-871b-ac45bc568a62',
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
                { label: 'Contact type', type: 'badge', value: 'Primary', badgeModifier: 'secondary' },
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
            expect(this.res.locals.contacts).to.have.property('highlightTerm', 'Fred')
          })

          it('should call next to move to the next middleware', () => {
            expect(this.nextSpy).to.be.calledOnce
            expect(this.nextSpy).to.be.calledWithExactly()
          })

          it('should use the block link style for results', () => {
            expect(this.res.locals.contacts).to.have.property('listModifier', 'block-links')
          })

          it('should include the search term in the locals', () => {
            expect(this.res.locals.searchTerm).to.equal('Fred')
          })
        })

        context('with lots of results and asking for page 2', () => {
          beforeEach(async () => {
            this.req.query.page = '2'

            nock(config.apiRoot)
              .get('/v3/interaction?limit=9999&offset=0&event_id=31a9f8bd-7796-4af4-8f8c-25450860e2d1')
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

        context('when one of the results is an existing attendee', () => {
          beforeEach(async () => {
            this.req.query.page = '1'

            nock(config.apiRoot)
              .get('/v3/interaction?limit=9999&offset=0&event_id=31a9f8bd-7796-4af4-8f8c-25450860e2d1')
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
                results: [{
                  ...contacts,
                  id: '9b1138ab-ec7b-497f-b8c3-27fed21694ef',
                }],
              })

            await findAttendee(this.req, this.res, this.nextSpy)
          })

          it('should mark the contact result as an existing attendee', () => {
            const contact = this.res.locals.contacts.items[0]
            expect(contact).to.have.property('isLinkDisabled', true)
          })

          it('should include a badge to say it has previously been added', () => {
            const meta = this.res.locals.contacts.items[0].meta
            const badges = meta.filter(metaItem => metaItem.type === 'badge')

            expect(badges).to.have.length(1)
            expect(badges[0]).to.deep.equal({
              label: 'Existing',
              type: 'badge',
              value: 'Existing attendee',
            })
          })
        })

        context('when there is an error searching for contacts', () => {
          beforeEach(async () => {
            this.req.query.page = '1'

            nock(config.apiRoot)
              .get('/v3/interaction?limit=9999&offset=0&event_id=31a9f8bd-7796-4af4-8f8c-25450860e2d1')
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

            expect(this.nextSpy).to.be.calledWith(sinon.match({
              message: '500 - "Error message"',
            }))
          })
        })
      })
    })

    context('when no event is supplied', () => {
      beforeEach(async () => {
        await findAttendee(this.req, this.res, this.nextSpy)
      })

      it('should call next with the error', () => {
        expect(this.nextSpy.calledOnce).to.be.true

        expect(this.nextSpy).to.be.calledWith(sinon.match({
          message: 'No event supplied',
        }))
      })
    })
  })
})
