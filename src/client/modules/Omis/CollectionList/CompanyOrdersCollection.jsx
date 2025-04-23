import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Details } from 'govuk-react'
import { H3 } from '@govuk-react/heading'
import { HEADING_SIZES } from '@govuk-react/constants'
import VisuallyHidden from '@govuk-react/visually-hidden'
import { useParams } from 'react-router-dom'

import { ORDERS__LOADED } from '../../../actions'

import { FilteredCollectionList } from '../../../components'
import { listSkeletonPlaceholder } from '../../../components/SkeletonPlaceholder'
import { CompanyResource } from '../../../components/Resource'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'

import {
  companyOrdersState2props,
  COMPANY_ORDERS_LIST_ID,
  TASK_GET_ORDERS_LIST,
} from './state'
import urls from '../../../../lib/urls'
import AccessibleLink from '../../../components/Link'

const StyledHeader = styled(H3)`
  font-size: ${HEADING_SIZES.SMALL}px;
`

const CompanyOrdersCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const { companyId } = useParams()

  const collectionListTask = {
    name: TASK_GET_ORDERS_LIST,
    id: COMPANY_ORDERS_LIST_ID,
    progressMessage: 'Loading orders',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload: {
        ...payload,
        companyId: companyId,
      },
      onSuccessDispatch: ORDERS__LOADED,
    },
  }

  const TitleRenderer = (title, url) => (
    <StyledHeader>
      <AccessibleLink href={url} showUnderline={false}>
        {title} <VisuallyHidden>(Order reference)</VisuallyHidden>
      </AccessibleLink>
    </StyledHeader>
  )

  return (
    <DefaultLayoutBase>
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayout
            company={company}
            breadcrumbs={[{ text: 'Orders (OMIS)' }]}
            pageTitle="Orders"
          >
            {company.archived ? (
              <Details
                summary="Why can I not add an order?"
                data-test="archived-details"
              >
                Orders cannot be added to an archived company.{' '}
                <AccessibleLink href={`/companies/${company.id}/unarchive`}>
                  Click here to unarchive
                </AccessibleLink>
              </Details>
            ) : null}
            <FilteredCollectionList
              {...props}
              collectionName="order"
              sortOptions={optionMetadata.sortOptions}
              taskProps={collectionListTask}
              selectedFilters={selectedFilters}
              addItemUrl={
                company.archived ? null : urls.omis.create.form(company.id)
              }
              entityName="order"
              entityNamePlural="orders"
              titleRenderer={TitleRenderer}
              defaultQueryParams={{
                page: 1,
                sortby: 'created_on:desc',
              }}
            />
          </CompanyLayout>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

export default connect(companyOrdersState2props)(CompanyOrdersCollection)
