import React from 'react'
import PropTypes from 'prop-types'

import BusinessDetailsCard from '../overview-table-cards/BusinessDetailsCard'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'

const CardContainer = styled('div')`
  border: 1px solid #b1b4b6;
  padding: 20px;
  margin-bottom: 20px;
`

const CompanyOverview = (props) => {
  const { company } = props

  const queryString = `/companies/${company.id}`
  return (
    <>
      <GridRow>
        <GridCol columnOneHalf={true}>
          <CardContainer>
            <BusinessDetailsCard {...props} queryString={queryString} />
          </CardContainer>
        </GridCol>
        <GridCol columnOneHalf={true}></GridCol>
      </GridRow>
    </>
  )
}

CompanyOverview.propTypes = {
  company: PropTypes.object.isRequired,
}

export default CompanyOverview
