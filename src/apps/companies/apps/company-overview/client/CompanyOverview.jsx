import React from 'react'
import { SummaryTable } from '../../../../../client/components'

const CompanyOverview = (props) => {
  const { company } = props
  return (
    <>
      <SummaryTable
        caption="Business Details"
        data-test="documentsDetailsContainer"
      >
        <SummaryTable.Row heading="Business Details">
          {company.company_number}
        </SummaryTable.Row>

        <SummaryTable.Row>Hello</SummaryTable.Row>
        <SummaryTable.Row>Hello</SummaryTable.Row>
        <SummaryTable.Row>Hello</SummaryTable.Row>
        <SummaryTable.Row>Hello</SummaryTable.Row>
        <SummaryTable.Row>Hello</SummaryTable.Row>
        <SummaryTable.Row>Hello</SummaryTable.Row>
      </SummaryTable>
    </>
  )
}

export default CompanyOverview
