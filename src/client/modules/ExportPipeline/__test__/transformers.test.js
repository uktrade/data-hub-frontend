import {
  transformFormValuesForAPI,
  transformAPIValuesForForm,
} from '../transformers'

describe('#transformFormValuesForAPI', () => {
  context('When values prop is not passed ', () => {
    it('Should return the same value', () => {
      expect(transformFormValuesForAPI()).to.be.undefined
    })
  })
  context('When a values object is passed as a prop', () => {
    it('Should return the mapped value when the form field is present', () => {
      expect(
        transformFormValuesForAPI({
          title: 'title',
          owner: { value: 'b', label: 'c' },
        })
      ).to.be.deep.equal({ title: 'title', owner: { id: 'b' } })
    })

    it('Should return the default value when the api field is missing', () => {
      expect(transformFormValuesForAPI({ title: 'title' })).to.be.deep.equal({
        title: 'title',
        owner: { id: undefined },
      })
    })
  })
})

describe('#transformAPIValuesForForm', () => {
  context('When initialValues prop is not passed ', () => {
    it('Should return the same value', () => {
      expect(transformAPIValuesForForm()).to.be.undefined
    })
  })
  context('When an initialValues object is passed as a prop', () => {
    it('Should return the mapped value when the api field is present', () => {
      expect(
        transformAPIValuesForForm({ name: 'a', owner: { id: 'b', name: 'c' } })
      ).to.be.deep.equal({ name: 'a', owner: { value: 'b', label: 'c' } })
    })

    it('Should return the default value when the api field is missing', () => {
      expect(transformAPIValuesForForm({ name: 'a' })).to.be.deep.equal({
        name: 'a',
        owner: {},
      })
    })
  })
})
