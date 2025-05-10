import React from 'react'
import { connect } from 'react-redux'

import { LABELS } from './constants'

import { CONTACTS__LOADED, CONTACTS__METADATA_LOADED } from '../../../actions'

import {
  CollectionFilters,
  FilteredCollectionList,
  FilterToggleSection,
  DefaultLayout,
  Filters,
} from '../../../components'

import {
  listSkeletonPlaceholder,
  CheckboxPlaceholder,
  InputPlaceholder,
  ToggleHeadingPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import {
  CONTACTS_LIST_ID,
  contactsState2props,
  TASK_GET_CONTACTS_LIST,
  TASK_GET_CONTACTS_METADATA,
} from './state'

import { sanitizeFilter } from '../../../../client/filters'

const getContactLinkText = (item) =>
  item.headingText || 'Contact name not available'

const getContactAriaLabel = (item) => {
  const contactName = item.headingText || 'unknown'
  let companyName = 'unknown'
  let jobTitle = 'unknown'

  if (item.metadata) {
    const companyItem = item.metadata.find((meta) => meta.label === 'Company')
    if (companyItem && companyItem.value != null) {
      companyName = companyItem.value
    }
    const jobTitleItem = item.metadata.find(
      (meta) => meta.label === 'Job title'
    )
    if (jobTitleItem && jobTitleItem.value != null) {
      jobTitle = jobTitleItem.value
    }
  }
  return `Contact ${contactName}. Company ${companyName}. Job title ${jobTitle}.`
}

const ContactsCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_CONTACTS_LIST,
    id: CONTACTS_LIST_ID,
    progressMessage: 'Loading contacts',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload,
      onSuccessDispatch: CONTACTS__LOADED,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_CONTACTS_METADATA,
    id: CONTACTS_LIST_ID,
    progressMessage: 'Loading filters',
    renderProgress: () => (
      <>
        <ToggleHeadingPlaceholder />
        <InputPlaceholder count={3} />
        <CheckboxPlaceholder count={2} />
        <ToggleHeadingPlaceholder />
      </>
    ),
    startOnRender: {
      onSuccessDispatch: CONTACTS__METADATA_LOADED,
    },
  }

  return (
    <DefaultLayout heading="Contacts" pageTitle="Contacts">
      <FilteredCollectionList
        {...props}
        collectionName="contacts"
        sortOptions={optionMetadata.sortOptions}
        taskProps={collectionListTask}
        selectedFilters={selectedFilters}
        baseDownloadLink="/contacts/export"
        entityName="contact"
        sanitizeFiltersForAnalytics={({ name, companyName }) => ({
          ...sanitizeFilter(name),
          ...sanitizeFilter(companyName),
        })}
        getLinkTextForItem={getContactLinkText}
        getAriaLabelForItem={getContactAriaLabel}
      >
        <CollectionFilters taskProps={collectionListMetadataTask}>
          <FilterToggleSection
            id="ContactCollection.contact-details-filters"
            label="Contact details"
            isOpen={true}
          >
            <Filters.Input
              id="ContactsCollection.name"
              qsParam="name"
              name="name"
              label={LABELS.contactName}
              placeholder="Search contact name"
              data-test="contact-name-filter"
            />
            <Filters.Input
              id="ContactsCollection.company-name"
              qsParam="company_name"
              name="company_name"
              label={LABELS.companyName}
              placeholder="Search company name"
              data-test="company-name-filter"
            />
            <Filters.Typeahead
              isMulti={true}
              label={LABELS.sector}
              name="sector"
              qsParam="company_sector_descends"
              placeholder="Search sector"
              options={optionMetadata.sectorOptions}
              selectedOptions={selectedFilters.companySectors.options}
              data-test="sector-filter"
            />
            <Filters.CheckboxGroup
              legend={LABELS.status}
              name="archived"
              qsParam="archived"
              options={optionMetadata.statusOptions}
              selectedOptions={selectedFilters.statuses.options}
              data-test="status-filter"
              groupId="status-filter"
            />
          </FilterToggleSection>

          <FilterToggleSection
            id="ContactCollection.contact-location-details-filters"
            label="Contact location details"
            isOpen={false}
          >
            <Filters.Typeahead
              isMulti={true}
              label={LABELS.country}
              name="country"
              qsParam="address_country"
              placeholder="Search country"
              options={optionMetadata.countryOptions}
              selectedOptions={selectedFilters.addressCountries.options}
              data-test="country-filter"
            />
            <Filters.Typeahead
              isMulti={true}
              label={LABELS.ukRegion}
              name="uk_region"
              qsParam="company_uk_region"
              placeholder="Search UK region"
              options={optionMetadata.ukRegionOptions}
              selectedOptions={selectedFilters.companyUkRegions.options}
              data-test="uk-region-filter"
            />
          </FilterToggleSection>
        </CollectionFilters>
      </FilteredCollectionList>
    </DefaultLayout>
  )
}

export default connect(contactsState2props)(ContactsCollection)
