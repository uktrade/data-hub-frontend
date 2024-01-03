import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import {
  CollectionFilters,
  DefaultLayout,
  FilteredCollectionList,
  FilterToggleSection,
  Filters,
} from '../../../../components'
import { CompanyResource } from '../../../../components/Resource'
import {
  buildCompanyBreadcrumbs,
  companyCollectionListTask,
  companyCollectionListMetadataTask,
} from '../../utils'
import { LABELS } from '../../CollectionList/constants'
import { ID, state2props, TASK_GET_SUBSIDIARY_LIST } from './state'

const LinkSubsidiary = ({
  payload,
  currentAdviserId,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const { companyId } = useParams()
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <>
          <DefaultLayout
            pageTitle={`Link subsidiary - ${company.name} - Companies`}
            heading="Search and select a subsidiary"
            breadcrumbs={buildCompanyBreadcrumbs(
              {
                text: 'Link subsidiary',
              },
              company.id,
              company.name
            )}
          >
            <FilteredCollectionList
              collectionName="company"
              sortOptions={optionMetadata.sortOptions}
              taskProps={companyCollectionListTask(
                TASK_GET_SUBSIDIARY_LIST,
                ID,
                {
                  ...payload,
                  parentCompanyId: companyId,
                }
              )}
              selectedFilters={selectedFilters}
              entityName="company"
              entityNamePlural="companies"
              {...props}
            >
              <CollectionFilters
                taskProps={companyCollectionListMetadataTask(ID)}
              >
                <FilterToggleSection
                  id="CompanyCollection.company-details-filters"
                  label="Company details"
                  isOpen={true}
                >
                  <Filters.Input
                    id="CompanyCollection.name"
                    qsParam="name"
                    name="name"
                    label={LABELS.companyName}
                    placeholder="Search company name"
                    data-test="company-name-filter"
                  />
                  <Filters.Input
                    id="CompanyCollection.company_number"
                    qsParam="company_number"
                    name="company_number"
                    label={LABELS.companyNumber}
                    placeholder="Search company number"
                    data-test="company-number-filter"
                  />
                  <Filters.Typeahead
                    isMulti={true}
                    label={LABELS.sector}
                    name="sector"
                    qsParam="sector_descends"
                    placeholder="Search sector"
                    options={optionMetadata.sectorOptions}
                    selectedOptions={selectedFilters.sectors.options}
                    data-test="sector-filter"
                  />
                </FilterToggleSection>

                <FilterToggleSection
                  id="CompanyCollection.location-details-filters"
                  label="Location details"
                  isOpen={false}
                >
                  <Filters.Typeahead
                    isMulti={true}
                    label={LABELS.country}
                    name="country"
                    qsParam="country"
                    placeholder="Search country"
                    options={optionMetadata.countryOptions}
                    selectedOptions={selectedFilters.countries.options}
                    data-test="country-filter"
                  />
                  <Filters.Input
                    id="CompanyCollection.postcode"
                    qsParam="uk_postcode"
                    name="uk_postcode"
                    label={LABELS.ukPostcode}
                    placeholder="Search UK postcode"
                    data-test="uk-postcode-filter"
                  />
                  <Filters.Typeahead
                    isMulti={true}
                    label={LABELS.ukRegion}
                    name="uk_region"
                    qsParam="uk_region"
                    placeholder="Search UK region"
                    options={optionMetadata.ukRegionOptions}
                    selectedOptions={selectedFilters.ukRegions.options}
                    data-test="uk-region-filter"
                  />
                  <Filters.Typeahead
                    isMulti={true}
                    label={LABELS.usState}
                    name="us_state"
                    qsParam="us_state"
                    placeholder="Search US state"
                    options={optionMetadata.usStateOptions}
                    selectedOptions={selectedFilters.usStates.options}
                    data-test="us-state-filter"
                  />
                  <Filters.Typeahead
                    isMulti={true}
                    label={LABELS.canadianProvince}
                    name="canadian_province"
                    qsParam="canadian_province"
                    placeholder="Search Canadian province"
                    options={optionMetadata.canadianProvinceOptions}
                    selectedOptions={selectedFilters.canadianProvinces.options}
                    data-test="canadian-province-filter"
                  />
                </FilterToggleSection>
              </CollectionFilters>
            </FilteredCollectionList>
          </DefaultLayout>
        </>
      )}
    </CompanyResource>
  )
}

export default connect(state2props)(LinkSubsidiary)
