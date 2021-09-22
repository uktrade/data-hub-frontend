import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Link, Details } from 'govuk-react'
import { H3 } from '@govuk-react/heading'
import { HEADING_SIZES } from '@govuk-react/constants'
import VisuallyHidden from '@govuk-react/visually-hidden'

import { ORDERS__LOADED } from '../../../actions'

import { FilteredCollectionList } from '../../../components/index.jsx'

import {
  companyOrdersState2props,
  COMPANY_ORDERS_LIST_ID,
  TASK_GET_ORDERS_LIST,
} from './state'

const StyledHeader = styled(H3)`
  font-size: ${HEADING_SIZES.SMALL}px;
`

const StyledLinkHeader = styled(StyledHeader)`
  & > a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
  }
`

const CompanyOrdersCollection = ({
  company,
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_ORDERS_LIST,
    id: COMPANY_ORDERS_LIST_ID,
    progressMessage: 'Loading orders',
    startOnRender: {
      payload: {
        ...payload,
        companyId: company.id,
      },
      onSuccessDispatch: ORDERS__LOADED,
    },
  }

  const TitleRenderer = (title, url) => (
    <StyledLinkHeader>
      <Link href={url}>
        {title} <VisuallyHidden>(Order reference)</VisuallyHidden>
      </Link>
    </StyledLinkHeader>
  )

  return (
    <>
      {company.archived && (
        <Details
          summary="Why can I not add an order?"
          data-test="archived-details"
        >
          Orders cannot be added to an archived company.{' '}
          <Link href={`/companies/${company.id}/unarchive`}>
            Click here to unarchive
          </Link>
        </Details>
      )}
      <FilteredCollectionList
        {...props}
        collectionName="order"
        sortOptions={optionMetadata.sortOptions}
        taskProps={collectionListTask}
        selectedFilters={selectedFilters}
        addItemUrl={
          company.archived
            ? null
            : `/omis/create?company=${company.id}&skip-company=true`
        }
        entityName="order"
        entityNamePlural="orders"
        titleRenderer={TitleRenderer}
        defaultQueryParams={{
          page: 1,
          sortby: 'created_on:desc',
        }}
      ></FilteredCollectionList>
    </>
  )
}

export default connect(companyOrdersState2props)(CompanyOrdersCollection)
