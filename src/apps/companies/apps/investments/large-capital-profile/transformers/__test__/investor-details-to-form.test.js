const { transformInvestorTypes, transformRequiredChecks } = require('../index')

describe('Large capital profile, Investor details API to form', () => {
  context('when translating Investor types', () => {
    beforeEach(() => {
      const investorTypes = [
        {
          text: 'Angel syndicate',
          value: '1',
        },
        {
          text: 'Asset manager',
          value: '2',
        },
      ]

      const investorDetails = {
        investorType: {
          value: '2', // Select Asset Manager
        },
      }

      this.transformed = transformInvestorTypes(investorTypes, investorDetails)
    })

    it('should transform the Investor types', () => {
      expect(this.transformed).to.deep.equal([
        {
          text: '-- Please select an investor type --',
          value: null,
        },
        {
          text: 'Angel syndicate',
          value: '1',
        },
        {
          selected: true,
          text: 'Asset manager',
          value: '2',
        },
      ])
    })
  })

  context('when translating required checks', () => {
    beforeEach(() => {
      this.requiredChecks = [
        {
          text: 'Cleared',
          value: '1',
        },
        {
          text: 'Issues identified',
          value: '2',
        },
        {
          text: 'Not yet checked',
          value: '4',
        },
        {
          text: 'Checks not required - See Investor Screening Report (ISR) guidance',
          value: '3',
        },
      ]
    })

    it('should transform the required checks when the user selects "Cleared"', () => {
      this.investorDetails = {
        requiredChecks: {
          type: {
            name: 'Cleared',
            id: '1',
          },
          date: '2019-05-01',
          adviser: {
            name: 'Holly',
            id: '123',
          },
        },
      }

      this.transformed = transformRequiredChecks(
        this.requiredChecks,
        this.investorDetails
      )

      expect(this.transformed).to.deep.equal({
        cleared: {
          checked: true,
          text: 'Cleared',
          value: '1',
          adviser: {
            name: 'Holly',
            id: '123',
          },
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
          type: {
            name: 'Issues identified',
            id: '2',
          },
          date: '2019-05-02',
          adviser: {
            name: 'Holly',
            id: '123',
          },
        },
      }

      this.transformed = transformRequiredChecks(
        this.requiredChecks,
        this.investorDetails
      )

      expect(this.transformed).to.deep.equal({
        cleared: {
          text: 'Cleared',
          value: '1',
        },
        issuesIdentified: {
          checked: true,
          text: 'Issues identified',
          value: '2',
          adviser: {
            id: '123',
            name: 'Holly',
          },
          date: {
            day: 2,
            month: 5,
            year: 2019,
          },
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
          type: {
            name: 'Checks not required - See Investor Screening Report (ISR) guidance',
            id: '3',
          },
        },
      }

      this.transformed = transformRequiredChecks(
        this.requiredChecks,
        this.investorDetails
      )

      expect(this.transformed).to.deep.equal({
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
          type: {
            name: 'Not yet checked',
            id: '4',
          },
        },
      }

      this.transformed = transformRequiredChecks(
        this.requiredChecks,
        this.investorDetails
      )

      expect(this.transformed).to.deep.equal({
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
