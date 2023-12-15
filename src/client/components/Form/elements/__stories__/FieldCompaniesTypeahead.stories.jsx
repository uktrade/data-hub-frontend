import React from 'react'

import FieldCompaniesTypeahead from '../FieldCompaniesTypeahead'
import Form from '../../../Form'

const options = [
  {
    value: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
    label: 'Company A',
    isInList: true,
    uk_region: { name: 'Bristol' },
  },
  {
    value: '8dcd2bb8-dc73-4a42-8655-4ae42d4d3c5a',
    label: 'Company B',
    uk_region: { name: 'Cardiff' },
  },
  {
    value: 'a6f39399-5bf4-46cb-a686-826f73e9f0ca',
    label: 'Company C',
    address: { country: { name: 'France' } },
  },
]

export const mockLoadOptions = (query = '') =>
  new Promise((resolve) =>
    query && query.length
      ? setTimeout(
          resolve,
          200,
          options.filter(({ label }) =>
            label.toLowerCase().includes(query.toLowerCase())
          )
        )
      : resolve([])
  )

export default {
  title: 'Form/Form Elements/FieldCompaniesTypeahead',
  excludeStories: ['mockLoadOptions'],
  parameters: {
    component: FieldCompaniesTypeahead,
  },
}

export const Default = () => (
  <Form
    id="fieldCompaniesTypeaheadExample"
    analyticsFormName="fieldCompaniesTypeaheadExample"
    submissionTaskName="Submit Form example"
  >
    {() => (
      <>
        <FieldCompaniesTypeahead name="company" loadOptions={mockLoadOptions} />
      </>
    )}
  </Form>
)
