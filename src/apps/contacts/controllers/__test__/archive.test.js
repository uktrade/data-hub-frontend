const proxyquire = require('proxyquire')

const next = function (error) {
  throw Error(error)
}

describe('Contact controller, archive', () => {
  let contactRepositoryUnArchiveContactStub
  let flashStub
  const token = '1234'
  const id = '999'

  let contactArchiveController

  beforeEach(() => {
    contactRepositoryUnArchiveContactStub = sinon.stub().resolves(null)
    contactArchiveController = proxyquire('../archive', {
      '../repos': {
        unarchiveContact: contactRepositoryUnArchiveContactStub,
      },
    })
    flashStub = sinon.stub()
  })
  it('should call unarchive', function (done) {
    const req = {
      session: { token },
      params: { id },
      flash: flashStub,
    }
    const res = {
      locals: {},
      redirect: () => {
        expect(contactRepositoryUnArchiveContactStub).to.be.calledWith(req, id)
        done()
      },
    }

    contactArchiveController.unarchiveContact(req, res, next)
  })
  it('should handle errors when you unarchive a contact', function (done) {
    const error = Error('error')
    contactRepositoryUnArchiveContactStub = sinon.stub().rejects(error)
    contactArchiveController = proxyquire('../archive', {
      '../repos': {
        unarchiveContact: contactRepositoryUnArchiveContactStub,
      },
    })

    const req = {
      session: { token },
      params: { id },
      body: { archived_reason: 'test' },
      flash: flashStub,
    }
    const res = {
      render: () => {
        throw Error('Should have called next')
      },
    }
    const next = function (_error) {
      expect(_error).to.deep.equal(error)
      done()
    }

    contactArchiveController.unarchiveContact(req, res, next)
  })
})
