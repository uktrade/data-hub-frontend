const {
  transformInvestorDetails,
} = require('../index')

const getClearedPOSTData = ({
  day = '01',
  month = '01',
  year = '2019',
  adviserId = 'adviserId',
}) => {
  return {
    'clearedId-day': day,
    'clearedId-month': month,
    'clearedId-year': year,
    'clearedId-adviser': adviserId,
  }
}

const getIssuesIdentifiedPOSTData = ({
  day = '02',
  month = '02',
  year = '2019',
  adviserId = 'adviserId2',
}) => {
  return {
    'issuesIdentifiedId-day': day,
    'issuesIdentifiedId-month': month,
    'issuesIdentifiedId-year': year,
    'issuesIdentifiedId-adviser': adviserId,
  }
}

describe('Large capital profile, Investor details form to API', () => {
  context('when translating Investor details', () => {
    it('should transform an empty POST', () => {
      this.transformed = transformInvestorDetails({
        investorType: '',
        globalAssetsUnderManagement: '',
        investableCapital: '',
        investorDescription: '',
        requiredChecks: undefined,
        ...getClearedPOSTData({ date: '', month: '', year: '' }),
        ...getIssuesIdentifiedPOSTData({ date: '', month: '', year: '' }),
      })
      expect(this.transformed).to.deep.equal({
        investor_type: null,
        global_assets_under_management: null,
        investable_capital: null,
        investor_description: '',
        required_checks_conducted: undefined,
        required_checks_conducted_by: null,
        required_checks_conducted_on: null,
      })
    })

    it('should transform the POST when the user selects "Cleared" and saves', () => {
      this.transformed = transformInvestorDetails({
        investorType: 'assetManagerId',
        globalAssetsUnderManagement: '1000000',
        investableCapital: '100000',
        investorDescription: 'Lorem ipsum dolor sit amet',
        requiredChecks: 'clearedId',
        ...getClearedPOSTData({}),
        ...getIssuesIdentifiedPOSTData({}),
      })
      expect(this.transformed).to.deep.equal({
        investor_type: 'assetManagerId',
        global_assets_under_management: '1000000',
        investable_capital: '100000',
        investor_description: 'Lorem ipsum dolor sit amet',
        required_checks_conducted: 'clearedId',
        required_checks_conducted_on: '2019-01-01',
        required_checks_conducted_by: 'adviserId',
      })
    })

    it('should transform the POST when the user selects "Issues identified" and saves', () => {
      this.transformed = transformInvestorDetails({
        investorType: 'assetManagerId',
        globalAssetsUnderManagement: '1000000',
        investableCapital: '100000',
        investorDescription: 'Lorem ipsum dolor sit amet',
        requiredChecks: 'issuesIdentifiedId',
        ...getClearedPOSTData({}),
        ...getIssuesIdentifiedPOSTData({}),
      })
      expect(this.transformed).to.deep.equal({
        investor_type: 'assetManagerId',
        global_assets_under_management: '1000000',
        investable_capital: '100000',
        investor_description: 'Lorem ipsum dolor sit amet',
        required_checks_conducted: 'issuesIdentifiedId',
        required_checks_conducted_on: '2019-02-02',
        required_checks_conducted_by: 'adviserId2',
      })
    })

    it('should transform the POST when the user selects "Not yet checked" and saves', () => {
      this.transformed = transformInvestorDetails({
        investorType: 'assetManagerId',
        globalAssetsUnderManagement: '1000000',
        investableCapital: '100000',
        investorDescription: 'Lorem ipsum dolor sit amet',
        requiredChecks: 'notYetCheckedId',
        ...getClearedPOSTData({}),
        ...getIssuesIdentifiedPOSTData({}),
      })
      expect(this.transformed).to.deep.equal({
        investor_type: 'assetManagerId',
        global_assets_under_management: '1000000',
        investable_capital: '100000',
        investor_description: 'Lorem ipsum dolor sit amet',
        required_checks_conducted: 'notYetCheckedId',
        required_checks_conducted_on: null,
        required_checks_conducted_by: null,
      })
    })

    it('should transform the POST when the user selects "Checks not required" and saves', () => {
      this.transformed = transformInvestorDetails({
        investorType: 'assetManagerId',
        globalAssetsUnderManagement: '1000000',
        investableCapital: '100000',
        investorDescription: 'Lorem ipsum dolor sit amet',
        requiredChecks: 'checksNotRequiredId',
        ...getClearedPOSTData({}),
        ...getIssuesIdentifiedPOSTData({}),
      })
      expect(this.transformed).to.deep.equal({
        investor_type: 'assetManagerId',
        global_assets_under_management: '1000000',
        investable_capital: '100000',
        investor_description: 'Lorem ipsum dolor sit amet',
        required_checks_conducted: 'checksNotRequiredId',
        required_checks_conducted_on: null,
        required_checks_conducted_by: null,
      })
    })
  })
})
