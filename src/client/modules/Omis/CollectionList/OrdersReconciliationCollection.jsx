import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { H3 } from '@govuk-react/heading'
import { HEADING_SIZES } from '@govuk-react/constants'
import VisuallyHidden from '@govuk-react/visually-hidden'

import { LABELS } from './constants'

import { ORDERS__LOADED, ORDERS__METADATA_LOADED } from '../../../actions'

import {
  CollectionFilters,
  DefaultLayout,
  FilteredCollectionList,
  Filters,
} from '../../../components'

import {
  CheckboxPlaceholder,
  InputPlaceholder,
  listSkeletonPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import {
  ORDERS_RECONCILIATION_LIST_ID,
  reconciliationOrdersState2props,
  TASK_GET_ORDERS_RECONCILIATION,
  TASK_GET_ORDERS_RECONCILIATION_METADATA,
} from './state'
import AccessibleLink from '../../../components/Link'

const StyledHeader = styled(H3)`
  font-size: ${HEADING_SIZES.SMALL}px;
`

const OrdersReconciliationCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_ORDERS_RECONCILIATION,
    id: ORDERS_RECONCILIATION_LIST_ID,
    progressMessage: 'Loading orders',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload,
      onSuccessDispatch: ORDERS__LOADED,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_ORDERS_RECONCILIATION_METADATA,
    id: ORDERS_RECONCILIATION_LIST_ID,
    progressMessage: 'Loading filters',
    renderProgress: () => (
      <>
        <CheckboxPlaceholder count={6} />
        <InputPlaceholder count={10} />
      </>
    ),
    startOnRender: {
      payload: {},
      onSuccessDispatch: ORDERS__METADATA_LOADED,
    },
  }

  const TitleRenderer = (title, url) => (
    <StyledHeader>
      <AccessibleLink showUnderline={false} href={url}>
        {title} <VisuallyHidden>(Order reference)</VisuallyHidden>
      </AccessibleLink>
    </StyledHeader>
  )

  return (
    <DefaultLayout heading="Orders (OMIS)" pageTitle="Orders (OMIS)">
      <FilteredCollectionList
        {...props}
        collectionName="order"
        sortOptions={optionMetadata.sortOptions}
        taskProps={collectionListTask}
        selectedFilters={selectedFilters}
        entityName="order"
        entityNamePlural="orders"
        titleRenderer={TitleRenderer}
      >
        <CollectionFilters taskProps={collectionListMetadataTask}>
          <Filters.CheckboxGroup
            legend={LABELS.status}
            name="status"
            qsParam="status"
            options={optionMetadata.statusOptions}
            selectedOptions={selectedFilters.statuses.options}
            data-test="status-filter"
            groupId="status-filter"
          />
          <Filters.Input
            id="OrdersReconciliationCollection.reference"
            qsParam="reference"
            name="reference"
            label={LABELS.reference}
            placeholder="Search order reference"
            data-test="reference-filter"
          />
          <Filters.Input
            id="OrdersReconciliationCollection.company-name"
            qsParam="company_name"
            name="company_name"
            label={LABELS.companyName}
            placeholder="Search company name"
            data-test="company-name-filter"
          />
          <Filters.Input
            id="OrdersReconciliationCollection.net-amount"
            qsParam="subtotal_cost"
            name="subtotal_cost"
            label={LABELS.netAmount}
            placeholder="Search net amount"
            data-test="net-amount-filter"
          />
          <Filters.Input
            id="OrdersReconciliationCollection.gross-amount"
            qsParam="total_cost"
            name="total_cost"
            label={LABELS.grossAmount}
            placeholder="Search gross amount"
            data-test="gross-amount-filter"
          />
        </CollectionFilters>
      </FilteredCollectionList>
    </DefaultLayout>
  )
}
export default connect(reconciliationOrdersState2props)(
  OrdersReconciliationCollection
)
