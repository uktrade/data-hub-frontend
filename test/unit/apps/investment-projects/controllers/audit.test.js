const investmentProjectAuditData = require('~/test/unit/data/investment/audit-log.json')

const token = 'abcd'

describe('Investment audit controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()
    this.getInvestmentProjectAuditLog = this.sandbox.stub().resolves(investmentProjectAuditData.results)
    this.breadcrumbStub = function () { return this }

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/audit', {
      '../repos': {
        getInvestmentProjectAuditLog: this.getInvestmentProjectAuditLog,
      },
    })
  })

  it('should get the audit log from the API', (done) => {
    this.controller.getInvestmentAudit({
      session: {
        token,
      },
      params: {
        investmentId: '9999',
      },
    }, {
      locals: {
        investmentData: {},
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        try {
          expect(this.getInvestmentProjectAuditLog).to.be.calledWith(token, '9999')
          done()
        } catch (error) {
          done(error)
        }
      },
    }, this.next)
  })
  it('should send a parsed copy of audit data to the view', (done) => {
    const expected = [{
      name: 'Duke Ellington',
      timestamp: '2 June 2017',
      changes: 3,
    }, {
      name: 'Fred Smith',
      timestamp: '2 June 2017',
      changes: 4,
    }]

    this.controller.getInvestmentAudit({
      session: {
        token,
      },
      params: {
        investmentId: '9999',
      },
    }, {
      locals: {
        investmentData: {},
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        try {
          expect(data.auditLog).to.deep.equal(expected)
          done()
        } catch (error) {
          done(error)
        }
      },
    }, this.next)
  })
  it('should handle audit entry containing an empty timestamp', (done) => {
    const badDate = [{
      user: {
        id: '41212312312321',
        name: 'Fred Smith',
      },
      timestamp: '',
      comment: 'Optional changeset comment - we can stick anything here',
      changes: {
        fieldName1: [false, true],
      },
    }]

    this.getInvestmentProjectAuditLog = this.sandbox.stub().resolves(badDate)

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/audit', {
      '../repos': {
        getInvestmentProjectAuditLog: this.getInvestmentProjectAuditLog,
      },
    })

    const expected = [{
      name: 'Fred Smith',
      timestamp: null,
      changes: 1,
    }]

    this.controller.getInvestmentAudit({
      session: {
        token,
      },
      params: {
        investmentId: '9999',
      },
    }, {
      locals: {
        investmentData: {},
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        try {
          expect(data.auditLog).to.deep.equal(expected)
          done()
        } catch (error) {
          done(error)
        }
      },
    }, this.next)
  })
  it('should handle when changes is null', (done) => {
    const nullChangeSet = [{
      user: {
        id: '41212312312321',
        name: 'Fred Smith',
      },
      timestamp: '2017-02-14T14:49:17',
      comment: 'Optional changeset comment - we can stick anything here',
      changes: null,
    }]

    this.getInvestmentProjectAuditLog = this.sandbox.stub().resolves(nullChangeSet)

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/audit', {
      '../repos': {
        getInvestmentProjectAuditLog: this.getInvestmentProjectAuditLog,
      },
    })

    const expected = [{
      name: 'Fred Smith',
      timestamp: '14 February 2017',
      changes: 0,
    }]

    this.controller.getInvestmentAudit({
      session: {
        token,
      },
      params: {
        investmentId: '9999',
      },
    }, {
      locals: {
        investmentData: {},
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        try {
          expect(data.auditLog).to.deep.equal(expected)
          done()
        } catch (error) {
          done(error)
        }
      },
    }, this.next)
  })
  it('should handle when the changeset is empty', (done) => {
    const emptyChangeSet = [{
      user: {
        id: '41212312312321',
        name: 'Fred Smith',
      },
      timestamp: '2017-02-14T14:49:17',
      comment: 'Optional changeset comment - we can stick anything here',
      changes: {},
    }]

    this.getInvestmentProjectAuditLog = this.sandbox.stub().resolves(emptyChangeSet)

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/audit', {
      '../repos': {
        getInvestmentProjectAuditLog: this.getInvestmentProjectAuditLog,
      },
    })

    const expected = [{
      name: 'Fred Smith',
      timestamp: '14 February 2017',
      changes: 0,
    }]

    this.controller.getInvestmentAudit({
      session: {
        token,
      },
      params: {
        investmentId: '9999',
      },
    }, {
      locals: {
        investmentData: {},
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        try {
          expect(data.auditLog).to.deep.equal(expected)
          done()
        } catch (error) {
          done(error)
        }
      },
    }, this.next)
  })

  describe('formatAuditLog', () => {
    beforeEach(() => {
      this.timestamp = '2017-08-09T13:25:29.568665Z'
      this.formattedDate = '9 August 2017'
      this.changes = {
        'thing': 'a thing',
        'other thing': 'another thing',
      }
    })

    it('should return the user name', () => {
      const actual = this.controller.formatAuditLog({
        user: { name: 'James Example' },
        timestamp: this.timestamp,
        changes: this.changes,
      })
      expect(actual).to.deep.equal({
        name: 'James Example',
        timestamp: this.formattedDate,
        changes: 2,
      })
    })
    it('should handle absent users', () => {
      const actual = this.controller.formatAuditLog({
        timestamp: this.timestamp,
        changes: this.changes,
      })
      expect(actual).to.deep.equal({
        name: undefined,
        timestamp: this.formattedDate,
        changes: 2,
      })
    })
    it('should handle empty users', () => {
      const actual = this.controller.formatAuditLog({
        user: {},
        timestamp: this.timestamp,
        changes: this.changes,
      })
      expect(actual).to.deep.equal({
        name: undefined,
        timestamp: this.formattedDate,
        changes: 2,
      })
    })
  })
})
