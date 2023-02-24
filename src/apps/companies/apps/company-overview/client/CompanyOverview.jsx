import React from 'react'
import PropTypes from 'prop-types'

import BusinessDetailsCard from '../overview-table-cards/BusinessDetailsCard'
import RecentActivityCard from '../overview-table-cards/RecentActivityCard'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'

const StyledGridCol = styled(GridCol)`
  border: 1px solid #454a4c;
  margin: 15px;
`

const CompanyOverview = (props) => {
  const { company } = props

  const queryString = `/companies/${company.id}`

  return (
    <>
      <GridRow>
        <StyledGridCol columnOneHalf={true}>
          <BusinessDetailsCard {...props} queryString={queryString} />
        </StyledGridCol>
        <StyledGridCol columnOneHalf={true}>
          <RecentActivityCard {...props} queryString={queryString} />
        </StyledGridCol>
      </GridRow>
    </>
  )
}

CompanyOverview.propTypes = {
  company: PropTypes.object.isRequired,
}

export default CompanyOverview
