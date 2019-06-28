const transformInteractionFormBodyToApiRequest = require('~/src/apps/interactions/transformers/interaction-form-body-to-api')
const serviceOptions = require('~/test/unit/data/interactions/service-options-data.json')
const { transformServicesOptions } = require('~/src/apps/transformers.js')
const transformedServices = transformServicesOptions(serviceOptions)

describe('#transformInteractionFormBodyToApiRequest', () => {
  context('when all fields are populated', () => {
    beforeEach(() => {
      this.transformed = transformInteractionFormBodyToApiRequest({
        date_year: '2018',
        date_month: '01',
        date_day: '02',
        grant_amount_offered: '1000',
        net_company_receipt: '500',
        policy_areas: '4444',
        policy_issue_types: '5555',
      }, transformedServices)
    })

    it('should set the date', () => {
      expect(this.transformed.date).to.equal('2018-01-02')
    })

    it('should set the grant amount offered', () => {
      expect(this.transformed.grant_amount_offered).to.equal('1000')
    })

    it('should set the net company receipt', () => {
      expect(this.transformed.net_company_receipt).to.equal('500')
    })

    it('converts policy areas to an array', () => {
      expect(this.transformed.policy_areas).to.deep.equal(['4444'])
    })

    it('converts policy issue types to an array', () => {
      expect(this.transformed.policy_issue_types).to.deep.equal(['5555'])
    })
  })

  context('when the optional fields have not been entered', () => {
    beforeEach(() => {
      this.transformed = transformInteractionFormBodyToApiRequest({
        grant_amount_offered: '',
        net_company_receipt: '',
      }, transformedServices)
    })

    it('should set the grant amount offered to null', () => {
      expect(this.transformed.grant_amount_offered).to.be.null
    })

    it('should set the net company receipt to null', () => {
      expect(this.transformed.net_company_receipt).to.be.null
    })
  })
})
