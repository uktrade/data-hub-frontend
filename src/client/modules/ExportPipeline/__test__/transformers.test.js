import {
  transformFormValuesForAPI,
  transformAPIValuesForForm,
} from '../transformers'

describe('transformFormValuesForAPI', () => {
  context('When a values object is passed as a prop', () => {
    it('Should return the mapped value when the form field is present', () => {
      expect(
        transformFormValuesForAPI({
          company: 456,
          id: 1234,
          title: 'title',
          owner: { value: 'b', label: 'c' },
          team_members: [
            { value: 'd', label: 'e' },
            { value: 'f', label: 'g' },
          ],
        })
      ).to.be.deep.equal({
        company: 456,
        id: 1234,
        title: 'title',
        owner: 'b',
        team_members: ['d', 'f'],
      })
    })
  })
})

describe('transformAPIValuesForForm', () => {
  context('When an initialValues object is passed as a prop', () => {
    it('Should return the mapped value when the api field is present', () => {
      expect(
        transformAPIValuesForForm({
          id: 234,
          company: { id: 987 },
          title: 'a',
          owner: { id: 'b', name: 'c' },
          team_members: [{ id: 'd', name: 'e' }],
        })
      ).to.be.deep.equal({
        id: 234,
        company: 987,
        title: 'a',
        owner: { value: 'b', label: 'c' },
        team_members: [{ value: 'd', label: 'e' }],
      })
    })
  })
})
