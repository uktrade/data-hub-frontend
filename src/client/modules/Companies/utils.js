import React from 'react'

import urls from '../../../lib/urls'
import { TASK_GET_COMPANIES_METADATA } from './CollectionList/state'
import { COMPANIES__LOADED, COMPANIES__METADATA_LOADED } from '../../actions'
import {
  listSkeletonPlaceholder,
  ToggleHeadingPlaceholder,
  InputPlaceholder,
  CheckboxPlaceholder,
} from '../../components/SkeletonPlaceholder'

/**
 * Checks if a company is in the D tier on the one list.
 */
export const isItaTierDAccount = (oneListGroupTier) =>
  oneListGroupTier &&
  oneListGroupTier.id === '1929c808-99b4-4abf-a891-45f2e187b410'

/**
 * Generates the breadcrumbs for company pages
 */
export const buildCompanyBreadcrumbs = (
  pageBreadcrumbs,
  companyId,
  companyName
) => {
  const initialBreadcrumbs = [
    { link: urls.dashboard.index(), text: 'Home' },
    {
      link: urls.companies.index(),
      text: 'Companies',
    },
    { link: urls.companies.detail(companyId), text: companyName },
  ]
  return initialBreadcrumbs.concat(pageBreadcrumbs)
}

/**
 * Generic task for retrieving companies shared across multiple CollectionLists
 */

export const companyCollectionListTask = (taskName, ID, payload) => {
  return {
    name: taskName,
    id: ID,
    progressMessage: 'Loading companies',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload: payload,
      onSuccessDispatch: COMPANIES__LOADED,
    },
  }
}

/**
 * Generic task for retrieving metadata shared across multiple CollectionLists
 */

export const companyCollectionListMetadataTask = (ID) => {
  return {
    name: TASK_GET_COMPANIES_METADATA,
    id: ID,
    progressMessage: 'Loading filters',
    renderProgress: () => (
      <>
        <ToggleHeadingPlaceholder />
        <InputPlaceholder />
        <CheckboxPlaceholder count={3} />
        <InputPlaceholder />
        <CheckboxPlaceholder count={2} />
        <InputPlaceholder />
        <ToggleHeadingPlaceholder count={2} />
      </>
    ),
    startOnRender: {
      onSuccessDispatch: COMPANIES__METADATA_LOADED,
    },
  }
}

export const truncateData = (enquiry, maxLength = 200) =>
  enquiry.length < maxLength
    ? enquiry
    : enquiry.slice(0, maxLength).split(' ').slice(0, -1).join(' ') + ' ...'
