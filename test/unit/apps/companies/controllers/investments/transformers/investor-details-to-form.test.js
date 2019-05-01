const {
  transformInvestorTypes,
  transformRequiredChecks,
} = require('~/src/apps/companies/apps/investments/large-capital-profile/transformers')

describe('Large capital profile, Investor details API to form', () => {
  context('when translating Investor types', () => {
    beforeEach(() => {
      const investorTypes = [ {
        label: 'Angel syndicate',
        value: '1',
      }, {
        label: 'Asset manager',
        value: '2',
      }]

      const investorDetails = {
        investorType: {
          value: '2', // Select Asset Manager
        },
      }

      this.transformed = transformInvestorTypes(investorTypes, investorDetails)
    })

    it('should transform the Investor types', () => {
      expect(this.transformed).to.deep.equal([ {
        text: '-- Please select an investor type --',
        value: null,
      }, {
        text: 'Angel syndicate',
        value: '1',

      }, {
        selected: true,
        text: 'Asset manager',
        value: '2',
      }])
    })
  })

  context('when translating required checks', () => {
    beforeEach(() => {
      this.requiredChecks = [ {
        label: 'Cleared',
        value: '1',
      }, {
        label: 'Issues identified',
        value: '2',
      }, {
        label: 'Not yet checked',
        value: '4',
      }, {
        label: 'Checks not required - See Investor Screening Report (ISR) guidance',
        value: '3',
      }]
    })

    it('should transform the required checks when the user selects "Cleared"', () => {
      this.investorDetails = {
        requiredChecks: {
          conducted: {
            name: 'Cleared',
            id: '1',
          },
          conductedOn: '2019-05-01',
        },
      }

      this.transformed = transformRequiredChecks(this.requiredChecks, this.investorDetails)

      expect(this.transformed).to.deep.equal({
        conducted: {
          name: 'Cleared',
          id: '1',
        },
        conductedOn: '2019-05-01',
        cleared: {
          checked: true,
          text: 'Cleared',
          value: '1',
          date: {
            day: 1,
            month: 5,
            year: 2019,
          },
        },
        issuesIdentified: {
          text: 'Issues identified',
          value: '2',
        },
        notRequired: {
          text: 'Checks not required - See Investor Screening Report (ISR) guidance',
          value: '3',
        },
        notYetChecked: {
          text: 'Not yet checked',
          value: '4',
        },
      })
    })

    it('should transform the required checks when the user selects "Issues identified"', () => {
      this.investorDetails = {
        requiredChecks: {
          conducted: {
            name: 'Issues identified',
            id: '2',
          },
          conductedOn: '2019-05-02',
        },
      }

      this.transformed = transformRequiredChecks(this.requiredChecks, this.investorDetails)

      expect(this.transformed).to.deep.equal({
        conducted: {
          name: 'Issues identified',
          id: '2',
        },
        conductedOn: '2019-05-02',
        cleared: {
          text: 'Cleared',
          value: '1',
        },
        issuesIdentified: {
          checked: true,
          date: {
            day: 2,
            month: 5,
            year: 2019,
          },
          text: 'Issues identified',
          value: '2',
        },
        notRequired: {
          text: 'Checks not required - See Investor Screening Report (ISR) guidance',
          value: '3',
        },
        notYetChecked: {
          text: 'Not yet checked',
          value: '4',
        },
      })
    })

    it('should transform the required checks when the user selects "Checks not required..."', () => {
      this.investorDetails = {
        requiredChecks: {
          conducted: {
            name: 'Checks not required - See Investor Screening Report (ISR) guidance',
            id: '3',
          },
        },
      }

      this.transformed = transformRequiredChecks(this.requiredChecks, this.investorDetails)

      expect(this.transformed).to.deep.equal({
        conducted: {
          name: 'Checks not required - See Investor Screening Report (ISR) guidance',
          id: '3',
        },
        cleared: {
          text: 'Cleared',
          value: '1',
        },
        issuesIdentified: {
          text: 'Issues identified',
          value: '2',
        },
        notRequired: {
          checked: true,
          text: 'Checks not required - See Investor Screening Report (ISR) guidance',
          value: '3',
        },
        notYetChecked: {
          text: 'Not yet checked',
          value: '4',
        },
      })
    })

    it('should transform the required checks when the user selects "Not yet checked"', () => {
      this.investorDetails = {
        requiredChecks: {
          conducted: {
            name: 'Not yet checked',
            id: '4',
          },
        },
      }

      this.transformed = transformRequiredChecks(this.requiredChecks, this.investorDetails)

      expect(this.transformed).to.deep.equal({
        conducted: {
          name: 'Not yet checked',
          id: '4',
        },
        cleared: {
          text: 'Cleared',
          value: '1',
        },
        issuesIdentified: {
          text: 'Issues identified',
          value: '2',
        },
        notRequired: {
          text: 'Checks not required - See Investor Screening Report (ISR) guidance',
          value: '3',
        },
        notYetChecked: {
          checked: true,
          text: 'Not yet checked',
          value: '4',
        },
      })
    })
  })
})
