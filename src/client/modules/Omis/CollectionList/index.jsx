import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Link from '@govuk-react/link'
import { H3 } from '@govuk-react/heading'
import { HEADING_SIZES } from '@govuk-react/constants'
import VisuallyHidden from '@govuk-react/visually-hidden'

import { LABELS } from './constants'

import { ORDERS__LOADED, ORDERS__METADATA_LOADED } from '../../../actions'

import {
  RoutedDateField,
  RoutedTypeahead,
  RoutedInputField,
  CollectionFilters,
  FilteredCollectionList,
  RoutedCheckboxGroupField,
  DefaultLayout,
} from '../../../components'

import {
  listSkeletonPlaceholder,
  filterSkeletonPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import {
  ORDERS_LIST_ID,
  ordersState2props,
  TASK_GET_ORDERS_LIST,
  TASK_GET_ORDERS_METADATA,
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

const OrdersCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_ORDERS_LIST,
    id: ORDERS_LIST_ID,
    progressMessage: 'Loading orders',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload,
      onSuccessDispatch: ORDERS__LOADED,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_ORDERS_METADATA,
    id: ORDERS_LIST_ID,
    progressMessage: 'Loading filters',
    renderProgress: filterSkeletonPlaceholder(),
    startOnRender: {
      payload: {},
      onSuccessDispatch: ORDERS__METADATA_LOADED,
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
    <DefaultLayout heading="Orders (OMIS)" pageTitle="Orders (OMIS)">
      <FilteredCollectionList
        {...props}
        collectionName="order"
        sortOptions={optionMetadata.sortOptions}
        taskProps={collectionListTask}
        selectedFilters={selectedFilters}
        addItemUrl="/omis/create"
        entityName="order"
        entityNamePlural="orders"
        baseDownloadLink="/omis/export"
        titleRenderer={TitleRenderer}
      >
        <CollectionFilters taskProps={collectionListMetadataTask}>
          <RoutedCheckboxGroupField
            legend={LABELS.status}
            name="status"
            qsParam="status"
            options={optionMetadata.statusOptions}
            selectedOptions={selectedFilters.statuses.options}
            data-test="status-filter"
            groupId="status-filter"
          />
          <RoutedInputField
            id="OrdersCollection.reference"
            qsParam="reference"
            name="reference"
            label={LABELS.reference}
            placeholder="Search order reference"
            data-test="reference-filter"
          />
          <RoutedDateField
            label={LABELS.completedOnAfter}
            name="completed_on_after"
            qsParamName="completed_on_after"
            data-test="completed-on-after-filter"
          />
          <RoutedDateField
            label={LABELS.completedOnBefore}
            name="completed_on_before"
            qsParamName="completed_on_before"
            data-test="completed-on-before-filter"
          />
          <RoutedDateField
            label={LABELS.deliveryDateAfter}
            name="delivery_date_after"
            qsParamName="delivery_date_after"
            data-test="delivery-date-after-filter"
          />
          <RoutedDateField
            label={LABELS.deliveryDateBefore}
            name="delivery_date_before"
            qsParamName="delivery_date_before"
            data-test="delivery-date-before-filter"
          />
          <RoutedInputField
            id="OrdersCollection.company-name"
            qsParam="company_name"
            name="company_name"
            label={LABELS.companyName}
            placeholder="Search company name"
            data-test="company-name-filter"
          />
          <RoutedInputField
            id="OrdersCollection.contact_name"
            qsParam="contact_name"
            name="contact_name"
            label={LABELS.contactName}
            placeholder="Search contact name"
            data-test="contact-name-filter"
          />
          <RoutedTypeahead
            isMulti={true}
            label={LABELS.sector}
            name="sector_descends"
            qsParam="sector_descends"
            placeholder="Search sector"
            options={optionMetadata.sectorOptions}
            selectedOptions={selectedFilters.sectors.options}
            data-test="sector-filter"
          />
          <RoutedTypeahead
            isMulti={true}
            label={LABELS.primaryMarket}
            name="primary_market"
            qsParam="primary_market"
            placeholder="Search country"
            options={optionMetadata.omisMarketOptions}
            selectedOptions={selectedFilters.omisMarkets.options}
            data-test="country-filter"
          />
          <RoutedTypeahead
            isMulti={true}
            label={LABELS.ukRegion}
            name="uk_region"
            qsParam="uk_region"
            placeholder="Search UK region"
            options={optionMetadata.ukRegionOptions}
            selectedOptions={selectedFilters.ukRegions.options}
            data-test="uk-region-filter"
          />
        </CollectionFilters>
      </FilteredCollectionList>
    </DefaultLayout>
  )
}

export default connect(ordersState2props)(OrdersCollection)
