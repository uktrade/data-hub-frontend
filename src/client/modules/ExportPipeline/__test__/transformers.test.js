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
          estimated_export_value_years: 2,
          estimated_export_value_amount: 676,
          estimated_win_date: { month: 6, year: 2030 },
          destination_country: { value: 'h', label: 'i' },
          sector: { value: 'j', label: 'k' },
          status: 'won',
          export_potential: 'high',
          exporter_experience: 'never',
          notes: 'large amount of text',
        })
      ).to.be.deep.equal({
        company: 456,
        id: 1234,
        title: 'title',
        owner: 'b',
        team_members: ['d', 'f'],
        estimated_export_value_years: 2,
        estimated_export_value_amount: 676,
        estimated_win_date: '2030-6-01T00:00:00',
        destination_country: 'h',
        sector: 'j',
        status: 'won',
        export_potential: 'high',
        exporter_experience: 'never',
        notes: 'large amount of text',
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
          estimated_win_date: '2039-09-24T03:43:58',
          estimated_export_value_years: { id: 1, name: '1 year' },
          estimated_export_value_amount: 34,
          destination_country: { id: 'f', name: 'g' },
          sector: { id: 'h', name: 'i' },
          status: 'won',
          export_potential: 'high',
          exporter_experience: { id: 'never', name: 'Never' },
          notes: 'large amount of text',
        })
      ).to.be.deep.equal({
        id: 234,
        company: 987,
        title: 'a',
        owner: { value: 'b', label: 'c' },
        team_members: [{ value: 'd', label: 'e' }],
        estimated_win_date: { month: 9, year: 2039 },
        estimated_export_value_years: 1,
        estimated_export_value_amount: 34,
        destination_country: { value: 'f', label: 'g' },
        sector: { value: 'h', label: 'i' },
        status: 'won',
        export_potential: 'high',
        exporter_experience: 'never',
        notes: 'large amount of text',
      })
    })
  })
})
