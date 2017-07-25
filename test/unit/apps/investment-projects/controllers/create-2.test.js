describe('Investment create controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()
    this.resMock = {
      breadcrumb: {
        add: () => this.resMock,
        update: () => this.resMock,
        get: () => [],
      },
    }

    this.controller = require('~/src/apps/investment-projects/controllers/create-2')
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
        }, Object.assign(this.resMock, {
          locals: {},
          redirect: (url) => {
            try {
              expect(url).to.equal('/investment-projects/create/1')
              done()
            } catch (e) {
              done(e)
            }
          },
        }), this.next)
      })
    })

    describe('when a the company exists', () => {
      it('should render create investment view', (done) => {
        this.controller.createGetHandler({
          session: {
            token: 'abcd',
          },
        }, Object.assign(this.resMock, {
          locals: {
            equityCompany: {
              id: '12345',
            },
          },
          render: (template) => {
            try {
              expect(template).to.equal('investment-projects/views/create-2')
              done()
            } catch (e) {
              done(e)
            }
          },
        }), this.next)
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
        }, Object.assign(this.resMock, {
          locals: {
            resultId: '12345',
            form: {},
          },
          redirect: (url) => {
            try {
              expect(url).to.equal('/investment-projects/12345')
              done()
            } catch (e) {
              done(e)
            }
          },
        }), this.next)
      })
    })

    describe('when form errors exist', () => {
      it('should render create investment form', (done) => {
        this.controller.createPostHandler({
          session: {
            token: 'abcd',
          },
        }, Object.assign(this.resMock, {
          locals: {
            form: {
              errors: {},
            },
          },
          render: (template) => {
            try {
              expect(template).to.equal('investment-projects/views/create-2')
              done()
            } catch (e) {
              done(e)
            }
          },
        }), this.next)
      })
    })
  })
})
