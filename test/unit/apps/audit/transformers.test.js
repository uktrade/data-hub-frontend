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

    this.transformer = this.transformers.transformAuditLogToListItem(contactDetailsLabels)
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('should return a formatted audit history item when there are changes', () => {
    const transformedItem = this.transformer(auditLog.results[0])

    expect(transformedItem.type).to.equal('audit')
    expect(transformedItem.name).to.equal('9 Jun 2017, 4:11pm')
    expect(transformedItem.contentMetaModifier).to.equal('stacked')
    expect(transformedItem.meta[0].label).to.equal('Adviser')
    expect(transformedItem.meta[0].value).to.equal('Reupen Shah')
  })

  it('should transform the list of changes to a list of fields and use the labels', () => {
    const transformedItem = this.transformer(auditLog.results[1])

    expect(transformedItem.meta[2]).to.deep.equal({
      label: 'Fields',
      value: 'Address same as company, Address line 1, Address line 2, Town, County, Country, Postcode',
    })
  })

  describe('change count', () => {
    it('should describe multiple of changes', () => {
      const transformedItem = this.transformer(auditLog.results[1])

      expect(transformedItem.meta[1]).to.deep.equal({
        label: 'Change count',
        type: 'badge',
        value: '7 changes',
      })
    })

    it('should describe a single change', () => {
      const transformedItem = this.transformer(auditLog.results[2])
      expect(transformedItem.meta[1]).to.deep.equal({
        label: 'Change count',
        type: 'badge',
        value: '1 change',
      })
    })

    it('should describe a zero changes', () => {
      const transformedItem = this.transformer(auditLog.results[0])

      expect(transformedItem.meta[1]).to.deep.equal({
        label: 'Change count',
        type: 'badge',
        value: 'No changes saved',
      })
    })
  })
})
