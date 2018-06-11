const transformInteractionFormBodyToApiRequest = require('~/src/apps/interactions/transformers/interaction-form-body-to-api')

describe('#transformInteractionFormBodyToApiRequest', () => {
  context('when all fields are populated', () => {
    beforeEach(() => {
      this.transformed = transformInteractionFormBodyToApiRequest({
        date_year: '2018',
        date_month: '01',
        date_day: '02',
        grant_amount_offered: '1000',
        net_company_receipt: '500',
      })
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
  })

  context('when the optional fields have not been entered', () => {
    beforeEach(() => {
      this.transformed = transformInteractionFormBodyToApiRequest({
        grant_amount_offered: '',
        net_company_receipt: '',
      })
    })

    it('should set the grant amount offered to null', () => {
      expect(this.transformed.grant_amount_offered).to.be.null
    })

    it('should set the net company receipt to null', () => {
      expect(this.transformed.net_company_receipt).to.be.null
    })
  })

  context('when posting a new policy feedback', () => {
    beforeEach(() => {
      this.transformed = transformInteractionFormBodyToApiRequest({
        company: '0000',
        kind: 'policy_feedback',
        service: 'ba6c666e-4ccd-4fdc-8209-2ab9aec6748c',
        contact: '1111',
        dit_team: '2222',
        policy_issue_type: '3333',
        policy_area: '4444',
        subject: 'sub',
        notes: 'some notes',
        date_year: '2018',
        date_month: '01',
        date_day: '02',
        dit_adviser: '5555',
        communication_channel: '6666',
      })
    })

    it('should transform the form into the correct API format', () => {
      expect(this.transformed).to.deep.equal({
        company: '0000',
        kind: 'policy_feedback',
        service: 'ba6c666e-4ccd-4fdc-8209-2ab9aec6748c',
        contact: '1111',
        dit_team: '2222',
        policy_issue_type: '3333',
        policy_area: '4444',
        subject: 'sub',
        notes: 'some notes',
        date: '2018-01-02',
        dit_adviser: '5555',
        communication_channel: '6666',
        grant_amount_offered: null,
        net_company_receipt: null,
      })
    })
  })

  context('when posting a policy feedback edit', () => {
    beforeEach(() => {
      this.transformed = transformInteractionFormBodyToApiRequest({
        id: '101010',
        company: '0000',
        kind: 'policy_feedback',
        service: 'ba6c666e-4ccd-4fdc-8209-2ab9aec6748c',
        contact: '1111',
        dit_team: '2222',
        policy_issue_type: '3333',
        policy_area: '4444',
        subject: 'sub',
        notes: 'some notes',
        date_year: '2018',
        date_month: '01',
        date_day: '02',
        dit_adviser: '5555',
        communication_channel: '6666',
      })
    })

    it('should transform the form into the correct API format', () => {
      expect(this.transformed).to.deep.equal({
        id: '101010',
        company: '0000',
        kind: 'policy_feedback',
        service: 'ba6c666e-4ccd-4fdc-8209-2ab9aec6748c',
        contact: '1111',
        dit_team: '2222',
        policy_issue_type: '3333',
        policy_area: '4444',
        subject: 'sub',
        notes: 'some notes',
        date: '2018-01-02',
        dit_adviser: '5555',
        communication_channel: '6666',
        grant_amount_offered: null,
        net_company_receipt: null,
      })
    })
  })
})
