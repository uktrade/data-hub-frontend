const {
  transformInvestorDetails,
} = require('~/src/apps/companies/apps/investments/large-capital-profile/transformers')

describe('Large capital profile, Investor details form to API', () => {
  context('when translating Investor details', () => {
    it('should transform an empty POST', () => {
      this.transformed = transformInvestorDetails({
        investorType: '',
        globalAssetsUnderManagement: '',
        investableCapital: '',
        investorDescription: '',
        conducted: '',
      })
      expect(this.transformed).to.deep.equal({
        investor_type: '',
        global_assets_under_management: null,
        investable_capital: null,
        investor_description: '',
        required_checks_conducted: '',
        required_checks_conducted_by: 'a80ff5fd-8904-4940-bf96-fe8047e34be5', // Hard-coded Adviser id.
      })
    })

    it('should transform the POST when the user selects "Cleared" and saves', () => {
      this.transformed = transformInvestorDetails({
        investorType: 'assetManagerId',
        globalAssetsUnderManagement: '1000000',
        investableCapital: '100000',
        investorDescription: 'Lorem ipsum dolor sit amet',
        conducted: '1', // Cleared id
        '1-day': '02',
        '1-month': '05',
        '1-year': '2019',
      })
      expect(this.transformed).to.deep.equal({
        investor_type: 'assetManagerId',
        global_assets_under_management: '1000000',
        investable_capital: '100000',
        investor_description: 'Lorem ipsum dolor sit amet',
        required_checks_conducted: '1', // Cleared id
        required_checks_conducted_by: 'a80ff5fd-8904-4940-bf96-fe8047e34be5', // Hard-coded Adviser id.
        required_checks_conducted_on: '2019-05-02', // Date the checks were conducted on
      })
    })

    it('should transform the POST when the user selects "Issues identified" and saves', () => {
      this.transformed = transformInvestorDetails({
        investorType: 'assetManagerId',
        globalAssetsUnderManagement: '1000000',
        investableCapital: '100000',
        investorDescription: 'Lorem ipsum dolor sit amet',
        conducted: '2', // Issues identified id
        '2-day': '03',
        '2-month': '05',
        '2-year': '2019',
      })
      expect(this.transformed).to.deep.equal({
        investor_type: 'assetManagerId',
        global_assets_under_management: '1000000',
        investable_capital: '100000',
        investor_description: 'Lorem ipsum dolor sit amet',
        required_checks_conducted: '2', // Issues identified id
        required_checks_conducted_by: 'a80ff5fd-8904-4940-bf96-fe8047e34be5', // Hard-coded Adviser id.
        required_checks_conducted_on: '2019-05-03', // Date the checks were conducted on
      })
    })

    it('should transform the POST when the user selects "Not yet checked" and saves', () => {
      this.transformed = transformInvestorDetails({
        investorType: 'assetManagerId',
        globalAssetsUnderManagement: '1000000',
        investableCapital: '100000',
        investorDescription: 'Lorem ipsum dolor sit amet',
        conducted: '3', // Not yet checked id
      })
      expect(this.transformed).to.deep.equal({
        investor_type: 'assetManagerId',
        global_assets_under_management: '1000000',
        investable_capital: '100000',
        investor_description: 'Lorem ipsum dolor sit amet',
        required_checks_conducted: '3', // Not yet checked id
        required_checks_conducted_by: 'a80ff5fd-8904-4940-bf96-fe8047e34be5', // Hard-coded Adviser id.
      })
    })

    it('should transform the POST when the user selects "Checks not required" and saves', () => {
      this.transformed = transformInvestorDetails({
        investorType: 'assetManagerId',
        globalAssetsUnderManagement: '1000000',
        investableCapital: '100000',
        investorDescription: 'Lorem ipsum dolor sit amet',
        conducted: '4', // Checks not required id
      })
      expect(this.transformed).to.deep.equal({
        investor_type: 'assetManagerId',
        global_assets_under_management: '1000000',
        investable_capital: '100000',
        investor_description: 'Lorem ipsum dolor sit amet',
        required_checks_conducted: '4', // Checks not required id
        required_checks_conducted_by: 'a80ff5fd-8904-4940-bf96-fe8047e34be5', // Hard-coded Adviser id.
      })
    })
  })
})
