import React from 'react'
import styled from 'styled-components'

import { SummaryTable, Tag } from '../../../../client/components/'

const StyledTag = styled(Tag)`
  float: right;
`

const OpportunityDetails = ({ details }) => (
  <SummaryTable>
    {details.map(({ label, value }, i) => (
      <SummaryTable.Row heading={label} key={`details-row-${i}`}>
        {/* TODO: Update with child components - JSON.stringify used here as proof of concept */}
        {value ? JSON.stringify(value) : <StyledTag>incomplete</StyledTag>}
      </SummaryTable.Row>
    ))}
  </SummaryTable>
)

export default OpportunityDetails
