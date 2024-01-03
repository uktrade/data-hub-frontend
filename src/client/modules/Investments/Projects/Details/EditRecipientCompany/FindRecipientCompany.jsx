import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { SPACING } from '@govuk-react/constants'

import {
  CollectionFilters,
  FilteredCollectionList,
  FilterToggleSection,
  DefaultLayout,
  Filters,
  Panel,
} from '../../../../../components'
import { LABELS } from '../../../../Companies/CollectionList/constants'
import {
  state2props,
  RECIPIENT_COMPANY_LIST_ID,
  TASK_GET_UK_COMPANIES,
} from './state'
import {
  export_segments,
  export_sub_segments,
} from '../../../../../../apps/companies/apps/edit-company/client/constants'
import {
  companyCollectionListTask,
  companyCollectionListMetadataTask,
} from '../../../../Companies/utils'
import { InvestmentResource } from '../../../../../components/Resource'
import urls from '../../../../../../lib/urls'
import { checkIfRecipientCompanyExists } from './transformers'
import { buildProjectBreadcrumbs } from '../../../utils'

const StyledPanel = styled(Panel)`
  margin-bottom: ${SPACING.SCALE_3};
`

const FindRecipientCompany = ({
  payload,
  currentAdviserId,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const { projectId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(project) => (
        <DefaultLayout
          heading={checkIfRecipientCompanyExists(project.ukCompany)}
          pageTitle={`${checkIfRecipientCompanyExists(project.ukCompany)} - ${
            project.name
          } - Projects - Investments`}
          breadcrumbs={buildProjectBreadcrumbs([
            {
              link: urls.investments.projects.details(project.id),
              text: project.name,
            },
            {
              text: checkIfRecipientCompanyExists(project.ukCompany),
            },
          ])}
        >
          <StyledPanel>
            <p>Select a company to associate it with {project.name}.</p>
          </StyledPanel>
          <FilteredCollectionList
            {...props}
            collectionName="company"
            sortOptions={optionMetadata.sortOptions}
            taskProps={companyCollectionListTask(
              TASK_GET_UK_COMPANIES,
              RECIPIENT_COMPANY_LIST_ID,
              {
                projectId: projectId,
                ...payload,
              }
            )}
            selectedFilters={selectedFilters}
            entityName="company"
            entityNamePlural="companies"
          >
            <CollectionFilters
              taskProps={companyCollectionListMetadataTask(
                RECIPIENT_COMPANY_LIST_ID
              )}
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
                <Filters.CheckboxGroup
                  legend={LABELS.headquarterType}
                  name="headquarter_type"
                  qsParam="headquarter_type"
                  options={optionMetadata.headquarterTypeOptions}
                  selectedOptions={selectedFilters.headquarterTypes.options}
                  data-test="headquarter-type-filter"
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
              </FilterToggleSection>

              <FilterToggleSection
                id="CompanyCollection.company-activity-details-filters"
                label="Company activity details"
                isOpen={false}
              >
                <Filters.Date
                  label={LABELS.lastInteractionAfter}
                  name="latest_interaction_date_after"
                  qsParamName="latest_interaction_date_after"
                  data-test="last-interaction-after-filter"
                />
                <Filters.Date
                  label={LABELS.lastInteractionBefore}
                  name="latest_interaction_date_before"
                  qsParamName="latest_interaction_date_before"
                  data-test="last-interaction-before-filter"
                />
                <Filters.Typeahead
                  isMulti={true}
                  label={LABELS.currentlyExportingTo}
                  name="export_to_countries"
                  qsParam="export_to_countries"
                  placeholder="Search country"
                  options={optionMetadata.countryOptions}
                  selectedOptions={selectedFilters.exportToCountries.options}
                  data-test="currently-exporting-to-country-filter"
                />
                <Filters.Typeahead
                  isMulti={true}
                  label={LABELS.futureCountriesOfInterest}
                  name="future_interest_countries"
                  qsParam="future_interest_countries"
                  placeholder="Search country"
                  options={optionMetadata.countryOptions}
                  selectedOptions={
                    selectedFilters.futureCountriesOfInterest.options
                  }
                  data-test="future-countries-of-interest-filter"
                />
                <Filters.Typeahead
                  isMulti={true}
                  label={LABELS.exportSegment}
                  name="export_segment"
                  qsParam="export_segment"
                  placeholder="Search export segment"
                  options={export_segments}
                  selectedOptions={selectedFilters.exportSegment.options}
                  data-test="export-segment-filter"
                />
                <Filters.Typeahead
                  isMulti={true}
                  label={LABELS.exportSubsegment}
                  name="export_sub_segment"
                  qsParam="export_sub_segment"
                  placeholder="Search export subsegment"
                  options={export_sub_segments}
                  selectedOptions={selectedFilters.exportSubsegment.options}
                  data-test="export-sub-segment-filter"
                />
              </FilterToggleSection>
            </CollectionFilters>
          </FilteredCollectionList>
        </DefaultLayout>
      )}
    </InvestmentResource>
  )
}

export default connect(state2props)(FindRecipientCompany)
