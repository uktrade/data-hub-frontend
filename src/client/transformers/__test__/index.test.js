import {
  transformIdNameToValueLabel,
  transformArrayIdNameToValueLabel,
} from '../index'

describe('transformIdNameToValueLabel', () => {
  context('When value is missing', () => {
    it('should return null', () => {
      expect(transformIdNameToValueLabel()).to.be.null
    })
  })

  context('When value is a valid object', () => {
    it('should return expected transformed object', () => {
      expect(transformIdNameToValueLabel({ id: 1 })).to.deep.equal({
        value: 1,
        label: undefined,
      })
      expect(transformIdNameToValueLabel({ name: 'a' })).to.deep.equal({
        value: undefined,
        label: 'a',
      })
      expect(transformIdNameToValueLabel({ id: 2, name: 'b' })).to.deep.equal({
        value: 2,
        label: 'b',
      })
    })
  })
})

describe('transformArrayIdNameToValueLabel', () => {
  context('When value is missing', () => {
    it('should return an empty array', () => {
      expect(transformArrayIdNameToValueLabel()).to.be.empty
    })
  })
  context('When value is not a populated array', () => {
    it('should return an empty array', () => {
      expect(transformArrayIdNameToValueLabel([])).to.be.empty
    })
  })
  context('When value is a populated array', () => {
    it('should return an array with expected transformed object', () => {
      expect(transformArrayIdNameToValueLabel([{ id: 1 }])).to.deep.equal([
        { value: 1, label: undefined },
      ])
      expect(
        transformArrayIdNameToValueLabel([
          { id: 2, name: 'a' },
          { id: 3, name: 'd' },
        ])
      ).to.deep.equal([
        { value: 2, label: 'a' },
        { value: 3, label: 'd' },
      ])
    })
  })
})
