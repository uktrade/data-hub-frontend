const currentJourney = require('~/src/modules/form/current-journey.js')

describe('Addresses create middleware', () => {
  describe('#setAddresses', () => {
    beforeEach(async () => {
      this.middleware = proxyquire('~/src/apps/addresses/apps/create/middleware.js', {
        '../../services/lookup': {
          getAddresses () {
            return [
              {
                postcode: 'postcode',
                county: 'six',
                city: 'five',
                address1: 'zero - one',
                address2: 'two',
                id: 'zero, one, two, , , five, six',
                name: 'zero - one, two, five, six',
              },
            ]
          },
        },
      })

      this.req = {
        session: {
          'multi-step': {
            '/base/step-1': {
              steps: {
                '/step-1': {
                  data: {
                    postcode: 'postcode',
                  },
                },
              },
            },
          },
        },
      }
      this.res = {
        locals: {
          journey: {
            key: '/base/step-1',
          },
        },
      }
      this.nextSpy = sinon.spy()

      currentJourney()(this.req, this.res, () => {})

      await this.middleware.setAddresses(this.req, this.res, this.nextSpy)
    })

    it('should set the postcode', () => {
      expect(this.res.locals.postcode).to.equal('POSTCODE')
    })

    it('should set the addresses', () => {
      expect(this.res.locals.addresses).to.deep.equal([
        {
          value: 'zero, one, two, , , five, six',
          label: 'zero - one, two, five, six',
        },
      ])
    })

    it('should call next once', () => {
      expect(this.nextSpy).to.be.calledWithExactly()
      expect(this.nextSpy).to.have.been.calledOnce
    })
  })
})
