import React from 'react'
import PropTypes from 'prop-types'

import BusinessDetailsCard from '../overview-table-cards/BusinessDetailsCard'
import RecentActivityCard from '../overview-table-cards/RecentActivityCard'
import { GridCol, GridRow } from 'govuk-react'

const CompanyOverview = (props) => {
  const { company } = props

  const queryString = `/companies/${company.id}`

  return (
    <>
      <GridRow>
        <GridCol>
          <BusinessDetailsCard {...props} queryString={queryString} />
        </GridCol>
        <GridCol>
          <RecentActivityCard {...props} queryString={queryString} />
        </GridCol>
      </GridRow>
    </>
  )
}

CompanyOverview.propTypes = {
  company: PropTypes.object.isRequired,
}

export default CompanyOverview
