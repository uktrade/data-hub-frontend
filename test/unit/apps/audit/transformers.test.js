const { contactDetailsLabels } = require('~/src/apps/contacts/labels')
const auditLog = require('~/test/unit/data/audit/contact-audit.json')

describe('Audit transformers', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.buildPaginationStub = sinon.sandbox.stub()
    this.transformers = proxyquire('~/src/apps/audit/transformers', {
      '../../lib/pagination': {
        buildPagination: this.buildPaginationStub,
      },
    })
    this.options = {
      query: {},
    }

    this.transformedLog = this.transformers.transformAuditLogToCollection(auditLog, contactDetailsLabels, this.options)
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('should return an object for use in collections', () => {
    expect(this.transformedLog).to.have.property('items')
    expect(this.transformedLog.count).to.equal(7)
    expect(this.transformedLog.countLabel).to.equal('log entry')
  })

  it('should return a formatted audit log item when there are changes', () => {
    const item = this.transformedLog.items[0]

    expect(item.type).to.equal('audit')
    expect(item.name).to.equal('9 Jun 2017, 4:06pm')
    expect(item.contentMetaModifier).to.equal('stacked')
    expect(item.meta[0].label).to.equal('Adviser')
    expect(item.meta[0].value).to.equal('Reupen Shah')
  })

  it('should transform the list of changes to a list of fields and use the labels', () => {
    expect(this.transformedLog.items[1].meta[2]).to.deep.equal({
      label: 'Fields',
      value: 'Address same as company, Address line 1, Address line 2, Town, County, Country, Postcode',
    })
  })

  it('should include a badge to describe number of changes', () => {
    expect(this.transformedLog.items[1].meta[1]).to.deep.equal({
      label: 'Change count',
      type: 'badge',
      value: '7 changes',
    })
  })

  it('should include a badge to describe a badge with zero changes', () => {
    expect(this.transformedLog.items[0].meta[1]).to.deep.equal({
      label: 'Change count',
      type: 'badge',
      value: 'No changes saved',
    })
  })

  it('should build pagination information in the collection', () => {
    expect(this.buildPaginationStub).to.be.calledWith(this.options.query, auditLog)
  })
})
