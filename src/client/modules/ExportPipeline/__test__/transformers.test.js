import {
  transformFormValuesForAPI,
  transformAPIValuesForForm,
} from '../transformers'

describe('transformFormValuesForAPI', () => {
  context('When a values object is passed as a prop', () => {
    it('Should return the mapped value when the form field is present', () => {
      expect(
        transformFormValuesForAPI({
          id: 1234,
          title: 'title',
          owner: { value: 'b', label: 'c' },
        })
      ).to.be.deep.equal({ id: 1234, title: 'title', owner: { id: 'b' } })
    })
  })
})

describe('transformAPIValuesForForm', () => {
  context('When an initialValues object is passed as a prop', () => {
    it('Should return the mapped value when the api field is present', () => {
      expect(
        transformAPIValuesForForm({
          id: 234,
          title: 'a',
          owner: { id: 'b', name: 'c' },
        })
      ).to.be.deep.equal({
        id: 234,
        title: 'a',
        owner: { value: 'b', label: 'c' },
      })
    })
  })
})
