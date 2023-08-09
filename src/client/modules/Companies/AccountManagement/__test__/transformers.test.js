import { transformFormValuesForAPI } from '../transformers'

describe('transformFormValuesForAPI', () => {
  context('When a values object is passed as a prop', () => {
    it('Should return the mapped value when the form field is present', () => {
      expect(
        transformFormValuesForAPI({
          subject: 'A subject',
          detail: 'The objective details',
          target_date: { day: '3', month: '3', year: '2030' },
          company: 123,
          has_blocker: 'Yes',
          blocker_description: 'A blocker description',
          progress: '50',
        })
      ).to.be.deep.equal({
        subject: 'A subject',
        detail: 'The objective details',
        target_date: '2030-03-03',
        company: 123,
        has_blocker: true,
        blocker_description: 'A blocker description',
        progress: 50,
      })
    })
  })
})
