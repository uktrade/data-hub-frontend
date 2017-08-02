const investmentData = require('~/test/unit/data/investment/investment-data.json')

describe('Investment details controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()

    this.controller = require('~/src/apps/investment-projects/controllers/details')
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#detailsGetHandler', () => {
    it('should return investment details', (done) => {
      this.controller.detailsGetHandler({
        session: {
          token: 'abcd',
        },
      }, {
        locals: {
          investmentData,
        },
        render: (template, data) => {
          try {
            expect(template).to.equal('investment-projects/views/details')
            done()
          } catch (error) {
            done(error)
          }
        },
      }, this.next)
    })
  })
})
