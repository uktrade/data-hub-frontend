const proxyquire = require('proxyquire')
const { faker } = require('@faker-js/faker')

const words = faker.lorem.words
const modulePath = '../user-locals'

describe('user-locals middleware', () => {
  let req, res, next
  beforeEach(() => {
    res = {
      locals: {},
    }
    next = sinon.spy()
  })

  describe('#getMessages', () => {
    afterEach(() => {
      expect(next).to.have.been.called
    })

    context('With no messages in the flash', () => {
      it('returns the values', () => {
        const userLocals = require(modulePath)
        const flash = sinon.stub().returns({})
        req = {
          path: '',
          flash,
        }
        userLocals(req, res, next)

        const messages = res.locals.getMessages()

        expect(flash).to.have.been.calledWith()
        expect(messages).to.deep.equal({})
      })
    })

    context('With valid messages in the flash', () => {
      it('returns the values', () => {
        const userLocals = require(modulePath)
        const flashData = {
          success: [words(5), '{"test":1}'],
          error: [words(5), words(5)],
          'success:with-body': [
            JSON.stringify({ heading: words(2), body: words(10) }),
          ],
        }
        const flash = sinon.stub().returns(flashData)
        req = {
          path: '',
          flash,
        }

        userLocals(req, res, next)

        const messages = res.locals.getMessages()

        expect(messages).to.equal(flashData)
        expect(typeof messages['success:with-body'][0]).to.equal('object')
        expect(typeof messages.success[1]).to.equal('string')
        expect(flash).to.have.been.calledWith()
      })
    })

    context('With invalid JSON messages in the flash', () => {
      it('returns the string and reports the error', () => {
        const captureException = sinon.spy()
        const userLocals = proxyquire(modulePath, {
          '../lib/reporter': {
            captureException,
          },
        })
        const flashData = {
          'success:with-body': [`heading: ${words(2)}`],
        }
        const flash = sinon.stub().returns(flashData)
        req = {
          path: '',
          flash,
        }

        userLocals(req, res, next)

        const messages = res.locals.getMessages()

        expect(messages).to.equal(flashData)
        expect(typeof messages['success:with-body'][0]).to.equal('string')
        expect(flash).to.have.been.calledWith()
        expect(captureException).to.have.been.called
      })
    })
  })
})
