import {
  convertEYBChoicesToLabels,
  formatProposedInvestmentCity,
} from '../utils'

describe('convertEYBChoicesToLabels', () => {
  const validCases = [
    { input: null, output: null },
    { input: 'UNDER_SIX_MONTHS', output: 'Under six months' },
    { input: 'SIX_TO_TWELVE_MONTHS', output: 'Six to twelve months' },
    { input: 'ONE_TO_TWO_YEARS', output: 'One to two years' },
    { input: 'MORE_THAN_TWO_YEARS', output: 'More than two years' },
    {
      input: [
        'SET_UP_NEW_PREMISES',
        'SET_UP_A_NEW_DISTRIBUTION_CENTRE',
        'ONWARD_SALES_AND_EXPORTS_FROM_THE_UK',
        'RESEARCH_DEVELOP_AND_COLLABORATE',
        'FIND_PEOPLE_WITH_SPECIALIST_SKILLS',
        'OTHER',
      ],
      output: [
        'Set up new premises',
        'Set up a new distribution centre',
        'Onward sales and exports from the UK',
        'Research develop and collaborate',
        'Find people with specialist skills',
        'Other',
      ],
    },
  ]
  validCases.forEach((validCase) => {
    it(`should output ${validCase.output} for the input ${validCase.input}`, () => {
      expect(convertEYBChoicesToLabels(validCase.input)).to.deep.equal(
        validCase.output
      )
    })
  })
  const errorCases = [{ input: undefined }, { input: 123 }]
  errorCases.forEach((errorCase) => {
    it(`should throw an error for the input ${errorCase.input}`, () => {
      expect(() => {
        convertEYBChoicesToLabels(errorCase.input)
      }).to.throw()
    })
  })
})

describe('formatProposedInvestmentCity', () => {
  const validCases = [
    { input: null, output: null },
    { input: 'MILTON_KEYNES', output: 'Milton Keynes' },
    { input: 'CITY_OF_EDINBURGH', output: 'City of Edinburgh' },
    { input: 'MANCHESTER', output: 'Manchester' },
    { input: 'ANTRIM_AND_NEWTONABBEY', output: 'Antrim and Newtonabbey' },
    { input: 'ALEXANDER_THE_GREAT', output: 'Alexander the Great' },
  ]
  validCases.forEach((validCase) => {
    it(`should output ${validCase.output} for the input ${validCase.input}`, () => {
      expect(formatProposedInvestmentCity(validCase.input)).to.deep.equal(
        validCase.output
      )
    })
  })
  const errorCases = [{ input: undefined }, { input: 123 }]
  errorCases.forEach((errorCase) => {
    it(`should throw an error for the input ${errorCase.input}`, () => {
      expect(() => {
        formatProposedInvestmentCity(errorCase.input)
      }).to.throw()
    })
  })
})
