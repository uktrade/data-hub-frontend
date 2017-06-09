describe('Investment create controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()

    this.controller = require('~/src/controllers/investment/create.controller')
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#createGetHandler', () => {
    describe('when no company ID is provided', () => {
      it('should redirect to the start', (done) => {
        this.controller.createGetHandler({
          session: {
            token: 'abcd',
          },
        }, {
          locals: {},
          redirect: (url) => {
            expect(url).to.equal('/investment/start')
            done()
          },
        }, this.next)
      })
    })

    describe('when a the company exists', () => {
      it('should render create investment view', (done) => {
        this.controller.createGetHandler({
          session: {
            token: 'abcd',
          },
        }, {
          locals: {
            equityCompany: {
              id: '12345',
            },
          },
          render: (template) => {
            try {
              expect(template).to.equal('investment/create')
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.next)
      })
    })
  })

  describe('#createPostHandler', () => {
    describe('when resultId is set', () => {
      it('should redirect to the investment project', (done) => {
        this.controller.createPostHandler({
          session: {
            token: 'abcd',
          },
        }, {
          locals: {
            resultId: '12345',
            form: {},
          },
          redirect: (url) => {
            try {
              expect(url).to.equal('/investment/12345')
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.next)
      })
    })

    describe('when form errors exist', () => {
      it('should render create investment form', (done) => {
        this.controller.createPostHandler({
          session: {
            token: 'abcd',
          },
        }, {
          locals: {
            form: {
              errors: {},
            },
          },
          render: (template) => {
            try {
              expect(template).to.equal('investment/create')
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.next)
      })
    })
  })
})
