const { assign } = require('lodash')

const { buildIncompleteFormList } = require('~/src/apps/investment-projects/helpers')

const formOneMockLinkDetails = {
  url: 'mock-url-form-one',
  text: 'Mock text form one',
}
const formTwoMockLinkDetails = {
  url: 'mock-url-form-two',
  text: 'Mock text form two',
}

describe('buildIncompleteFormList', () => {
  beforeEach(() => {
    this.mockLinkDetails = {
      formOne: assign({}, formOneMockLinkDetails),
      formTwo: assign({}, formTwoMockLinkDetails),
    }
    this.mockFormFields = {
      formOne: [
        'exampleLink',
        'exampleLinkA',
        'exampleLinkB',
        'exampleLinkC',
      ],
      formTwo: [
        'exampleLinkOther',
        'exampleLinkOtherA',
        'exampleLinkOtherB',
        'exampleLinkOtherC',
      ],
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  context('without arguments ', () => {
    it('should provide an empty array', () => {
      const expectedLinkObjects = buildIncompleteFormList()

      expect(expectedLinkObjects).to.be.an('array')
      expect(expectedLinkObjects.length).to.equal(0)
    })
  })

  context('with arguments ', () => {
    it('should provide expected link object', () => {
      const expectedLinkObjects = buildIncompleteFormList(
        ['exampleLink'],
        this.mockFormFields,
        this.mockLinkDetails
      )

      expect(expectedLinkObjects).to.be.an('array')
      expect(expectedLinkObjects.length).to.equal(1)
      expect(expectedLinkObjects).to.deep.equal([
        formOneMockLinkDetails,
      ])
    })

    it('should provide expected link objects', () => {
      const expectedLinkObjects = buildIncompleteFormList(
        [
          'exampleLink',
          'exampleLinkOtherB',
        ],
        this.mockFormFields,
        this.mockLinkDetails
      )

      expect(expectedLinkObjects).to.be.an('array')
      expect(expectedLinkObjects.length).to.equal(2)
      expect(expectedLinkObjects).to.deep.equal([
        formOneMockLinkDetails,
        formTwoMockLinkDetails,
      ])
    })

    it('should not provide duplicate links when there are multiple fields in the same form', () => {
      const expectedLinkObjects = buildIncompleteFormList(
        [
          'exampleLink',
          'exampleLinkA',
          'exampleLinkB',
          'exampleLinkC',
          'exampleLinkOther',
          'exampleLinkOtherA',
          'exampleLinkOtherB',
          'exampleLinkOtherC',
        ],
        this.mockFormFields,
        this.mockLinkDetails
      )

      expect(expectedLinkObjects).to.be.an('array')
      expect(expectedLinkObjects.length).to.equal(2)
      expect(expectedLinkObjects).to.deep.equal([
        formOneMockLinkDetails,
        formTwoMockLinkDetails,
      ])
    })
  })
})
