import React from 'react'

import FieldInvestmentProjectTypeahead from '../FieldInvestmentProjectTypeahead'
import Form from '../../../Form'

const options = [
  {
    value: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
    label: 'Project A',
  },
  {
    value: '8dcd2bb8-dc73-4a42-8655-4ae42d4d3c5a',
    label: 'Project B',
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
  title: 'Form/Form Elements/FieldInvestmentProjectTypeahead',
  excludeStories: ['mockLoadOptions'],
  parameters: {
    component: FieldInvestmentProjectTypeahead,
  },
}

export const Default = () => (
  <Form
    id="fieldInvestmentProjectTypeaheadExample"
    analyticsFormName="fieldInvestmentProjectTypeaheadExample"
    submissionTaskName="Submit Form example"
  >
    {() => (
      <>
        <FieldInvestmentProjectTypeahead
          name="investmentProject"
          loadOptions={mockLoadOptions}
        />
      </>
    )}
  </Form>
)
