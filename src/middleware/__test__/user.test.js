const proxyquire = require('proxyquire')

const apiRoot = '/api-root'
const token = 'abcd1234'
const user = {
  id: 'a47e6441-d414-75e6-9dc9-d80b41e872e0',
  name: 'Joe Bloggs',
  email: 'joe.bloggs@trade.gov.uk',
  userId: 'd3dda5d2-b98f-41a6-9313-1e2c2d8db080',
}

describe('user middleware', () => {
  beforeEach(() => {
    this.authorisedRequestStub = sinon.stub()
    this.nextSpy = sinon.spy()

    this.userMiddleware = proxyquire('../user', {
      '../config': {
        apiRoot: apiRoot,
      },
      '../lib/authorised-request': {
        authorisedRequest: this.authorisedRequestStub,
      },
    })
  })

  context('if not token is set', () => {
    beforeEach(() => {
      this.reqMock = {
        session: {},
      }
      this.userMiddleware(this.reqMock, {}, this.nextSpy)
    })

    it('should call next with no arguments', () => {
      expect(this.nextSpy).to.be.calledWith()
    })
  })

  context('if user does not exist on session', () => {
    beforeEach(() => {
      this.reqMock = {
        session: {
          token,
          userProfile: {
            user_id: 'd3dda5d2-b98f-41a6-9313-1e2c2d8db080',
          },
        },
      }
      this.resMock = {
        locals: {},
      }
    })

    context('when request resolves', () => {
      beforeEach(async () => {
        this.authorisedRequestStub.resolves(user)
        await this.userMiddleware(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call authorised request', () => {
        expect(this.authorisedRequestStub).to.be.calledWith(
          this.reqMock,
          `${apiRoot}/whoami/`
        )
      })

      it('should add user property on session', () => {
        expect(this.reqMock.session).to.have.property('user')
      })

      it('should set session value to response', () => {
        expect(this.reqMock.session.user).to.deep.equal(user)
      })

      it('should add user property on locals', () => {
        expect(this.resMock.locals).to.have.property('user')
      })

      it('should set locals value to response', () => {
        expect(this.resMock.locals.user).to.deep.equal(user)
      })

      it('should call next with no arguments', () => {
        expect(this.nextSpy).to.be.calledWith()
      })
    })

    context('when request rejects', () => {
      beforeEach(async () => {
        this.error = {
          statusCode: 500,
        }
        this.authorisedRequestStub.rejects(this.error)
        await this.userMiddleware(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next with error as first argument', () => {
        expect(this.nextSpy).to.be.calledWith(this.error)
      })
    })
  })
})
