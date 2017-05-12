/* globals expect: true, describe: true, it: true, beforeEach: true, sinon: true */
/* eslint no-unused-expressions: 0 */

const proxyquire = require('proxyquire')

const next = function (error) {
  throw Error(error)
}

describe('Contact controller, archive', function () {
  let contactRepositoryArchiveContactStub
  let contactRepositoryUnArchiveContactStub
  let flashStub
  const token = '1234'
  const id = '999'

  let contactArchiveController

  beforeEach(function () {
    contactRepositoryArchiveContactStub = sinon.stub().resolves(null)
    contactRepositoryUnArchiveContactStub = sinon.stub().resolves(null)
    contactArchiveController = proxyquire('../../src/controllers/contact-archive.controller', {
      '../repos/contact.repo': {
        archiveContact: contactRepositoryArchiveContactStub,
        unarchiveContact: contactRepositoryUnArchiveContactStub
      },
      'winston': {
        error: sinon.stub()
      }
    })
    flashStub = sinon.stub()
  })
  it('should call the archive contact method for the id and reason', function (done) {
    const req = {
      session: { token },
      body: { archived_reason: 'test', archived_reason_other: '' },
      params: { id },
      flash: flashStub
    }
    const res = {
      locals: {},
      redirect: function () {
        expect(contactRepositoryArchiveContactStub).to.be.calledWith(token, id, req.body.archived_reason)
        done()
      }
    }

    contactArchiveController.archiveContact(req, res, next)
  })
  it('should call the archive contact method for the id and other reason', function (done) {
    const req = {
      session: { token },
      body: { archived_reason: 'Other', archived_reason_other: 'otherreason' },
      params: { id },
      flash: flashStub
    }
    const res = {
      locals: {},
      redirect: function () {
        expect(contactRepositoryArchiveContactStub).to.be.calledWith(token, id, req.body.archived_reason_other)
        done()
      }
    }

    contactArchiveController.archiveContact(req, res, next)
  })

  it('should send a flash message that all went well', function (done) {
    const req = {
      session: { token },
      body: { archived_reason: 'Other', archived_reason_other: 'otherreason' },
      params: { id },
      flash: flashStub
    }
    const res = {
      locals: {},
      redirect: function (url) {
        expect(flashStub).to.be.calledWith('success-message', 'Updated contact record')
        done()
      }
    }

    contactArchiveController.archiveContact(req, res, next)
  })
  it('should sent a flash message if there was a problem', function (done) {
    const req = {
      session: { token },
      body: { archived_reason: 'Other', archived_reason_other: '' },
      params: { id },
      flash: flashStub
    }
    const res = {
      locals: {},
      redirect: function (url) {
        expect(flashStub).to.be.calledWith('error-message', 'Unable to archive contact, no reason given')
        done()
      }
    }

    contactArchiveController.archiveContact(req, res, next)
  })
  it('should call unarchive', function (done) {
    const req = {
      session: { token },
      params: { id },
      flash: flashStub
    }
    const res = {
      locals: {},
      redirect: function () {
        expect(contactRepositoryUnArchiveContactStub).to.be.calledWith(token, id)
        done()
      }
    }

    contactArchiveController.unarchiveContact(req, res, next)
  })
  it('should handle errors when you archive a contact', function (done) {
    const error = Error('error')
    contactRepositoryArchiveContactStub = sinon.stub().rejects(error)
    contactArchiveController = proxyquire('../../src/controllers/contact-archive.controller', {
      '../repos/contact.repo': {
        archiveContact: contactRepositoryArchiveContactStub,
        unarchiveContact: contactRepositoryUnArchiveContactStub
      },
      'winston': {
        error: sinon.stub()
      }
    })

    const req = {
      session: { token },
      params: { id },
      body: { archived_reason: 'test' },
      flash: flashStub
    }
    const res = {
      render: function () { throw Error('Should have called next') }
    }
    const next = function (_error) {
      expect(_error).to.deep.equal(error)
      done()
    }

    contactArchiveController.archiveContact(req, res, next)
  })
  it('should handle errors when you unarchive a contact', function (done) {
    const error = Error('error')
    contactRepositoryUnArchiveContactStub = sinon.stub().rejects(error)
    contactArchiveController = proxyquire('../../src/controllers/contact-archive.controller', {
      '../repos/contact.repo': {
        archiveContact: contactRepositoryArchiveContactStub,
        unarchiveContact: contactRepositoryUnArchiveContactStub
      },
      'winston': {
        error: sinon.stub()
      }
    })

    const req = {
      session: { token },
      params: { id },
      body: { archived_reason: 'test' },
      flash: flashStub
    }
    const res = {
      render: function () { throw Error('Should have called next') }
    }
    const next = function (_error) {
      expect(_error).to.deep.equal(error)
      done()
    }

    contactArchiveController.unarchiveContact(req, res, next)
  })
})
