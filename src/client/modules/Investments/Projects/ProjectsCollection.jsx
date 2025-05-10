import React from 'react'
import { Details, Paragraph } from 'govuk-react'
import { FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import { connect } from 'react-redux'

import urls from '../../../../lib/urls'
import {
  CollectionFilters,
  FilteredCollectionList,
  FilterToggleSection,
  Filters,
} from '../../../components'

import {
  listSkeletonPlaceholder,
  CheckboxPlaceholder,
  ToggleHeadingPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import {
  TASK_GET_PROJECTS_LIST,
  TASK_GET_INVESTMENTS_PROJECTS_ADVISER_NAME,
  TASK_GET_INVESTMENTS_PROJECTS_METADATA,
  INVESTMENT_PROJECTS_ID,
  state2props,
} from './state'

import {
  INVESTMENTS__PROJECTS_LOADED,
  INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
  INVESTMENTS__SET_PROJECTS_METADATA,
} from '../../../actions'

import { sanitizeFilter } from '../../../filters'
import AccessibleLink from '../../../components/Link'

const StyledParagraph = styled(Paragraph)`
  font-size: ${FONT_SIZE.SIZE_16};
`

const getProjectLinkText = (item) =>
  item.headingText || 'Project name not available'

const getProjectAriaLabel = (item) => {
  const projectName = item.headingText || 'unknown'
  let investor = 'unknown'
  let sector = 'unknown'
  let landDate = 'unknown'

  if (item.metadata) {
    const investorItem = item.metadata.find((meta) => meta.label === 'Investor')
    if (investorItem && investorItem.value) {
      investor = investorItem.value
    }
    const sectorItem = item.metadata.find((meta) => meta.label === 'Sector')
    if (sectorItem && sectorItem.value) {
      sector = sectorItem.value
    }
    const landDateItem = item.metadata.find(
      (meta) => meta.label === 'Estimated land date'
    )
    if (landDateItem && landDateItem.value) {
      landDate = landDateItem.value
    }
  }
  return `Project ${projectName}. Investor ${investor}. Sector ${sector}. Estimated land date ${landDate}.`
}

const StyledDetails = styled(Details)`
  margin-bottom: 0;
  span {
    font-size: ${FONT_SIZE.SIZE_16};
  }
`

const ProjectsCollection = ({
  company,
  payload,
  currentAdviserId,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_PROJECTS_LIST,
    id: INVESTMENT_PROJECTS_ID,
    progressMessage: 'Loading projects',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload: {
        ...payload,
        companyId: company?.id,
      },
      onSuccessDispatch: INVESTMENTS__PROJECTS_LOADED,
    },
  }
  const adviserListTask = {
    name: TASK_GET_INVESTMENTS_PROJECTS_ADVISER_NAME,
    id: INVESTMENT_PROJECTS_ID,
    startOnRender: {
      payload: payload.adviser,
      onSuccessDispatch: INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
    },
  }
  const collectionListMetadataTask = {
    name: TASK_GET_INVESTMENTS_PROJECTS_METADATA,
    id: INVESTMENT_PROJECTS_ID,
    progressMessage: 'Loading filters',
    renderProgress: () => (
      <>
        <ToggleHeadingPlaceholder />
        <CheckboxPlaceholder count={5} />
        <CheckboxPlaceholder count={5} />
        <ToggleHeadingPlaceholder count={4} />
      </>
    ),
    startOnRender: {
      payload: {
        projectStageOptions: urls.metadata.investmentProjectStage(),
        sectorOptions: urls.metadata.sector(),
        countryOptions: urls.metadata.country(),
        ukRegionOptions: urls.metadata.ukRegion(),
        investmentTypeOptions: urls.metadata.investmentType(),
        likelihoodToLandOptions: urls.metadata.likelihoodToLand(),
      },
      onSuccessDispatch: INVESTMENTS__SET_PROJECTS_METADATA,
    },
  }
  const myProjectsSelected = selectedFilters.advisers.options
    .map(({ value }) => value)
    .includes(currentAdviserId)
  const myProjectsOption = { label: 'My projects', value: currentAdviserId }

  return (
    <>
      {company?.archived && (
        <Details
          summary="Why can I not add an investment project?"
          data-test="archived-details"
        >
          Investment projects cannot be added to an archived company.{' '}
          <AccessibleLink href={`/companies/${company.id}/unarchive`}>
            Click here to unarchive
          </AccessibleLink>
        </Details>
      )}
      <FilteredCollectionList
        {...props}
        collectionName="investment project"
        sortOptions={optionMetadata.sortOptions}
        taskProps={collectionListTask}
        selectedFilters={selectedFilters}
        baseDownloadLink={!company ? '/investments/projects/export' : null}
        entityName="project"
        addItemUrl={
          !company
            ? `/investments/projects/create`
            : company.archived || company.ukBased || !company.address
              ? null
              : `/investments/projects/create/${company.id}`
        }
        sanitizeFiltersForAnalytics={({ advisers, countries }) => ({
          ...sanitizeFilter(advisers),
          ...sanitizeFilter(countries),
        })}
        defaultQueryParams={{
          page: 1,
          sortby: 'created_on:desc',
        }}
        getLinkTextForItem={getProjectLinkText}
        getAriaLabelForItem={getProjectAriaLabel}
      >
        <CollectionFilters taskProps={collectionListMetadataTask}>
          {company && (
            <Filters.RelatedCompaniesCheckboxGroup
              company={company}
              selectedOptions={selectedFilters.includeRelatedCompanies.options}
            />
          )}
          <FilterToggleSection
            id="ProjectCollection.stage-and-status-filters"
            label="Stage and status"
            isOpen={true}
          >
            <Filters.CheckboxGroup
              legend="Stage"
              name="stage"
              qsParam="stage"
              options={optionMetadata.projectStageOptions}
              selectedOptions={selectedFilters.stages.options}
              data-test="stage-filter"
              groupId="stage-filter"
            />
            <Filters.CheckboxGroup
              legend="Status"
              name="project_status"
              qsParam="status"
              options={optionMetadata.projectStatusOptions}
              selectedOptions={selectedFilters.statuses.options}
              data-test="project-status-filter"
              groupId="status-filter"
            />
          </FilterToggleSection>
          <FilterToggleSection
            id="ProjectCollection.project-details-filters"
            label="Project details"
            isOpen={false}
          >
            <Filters.CheckboxGroup
              legend="My projects"
              name="my_projects"
              qsParam="adviser"
              options={[myProjectsOption]}
              selectedOptions={myProjectsSelected ? [myProjectsOption] : []}
              data-test="my-projects-filter"
            />
            <Filters.AdvisersTypeahead
              closeMenuOnSelect={false}
              taskProps={adviserListTask}
              isMulti={true}
              onlyShowActiveAdvisers={false}
              label="Adviser"
              name="adviser"
              qsParam="adviser"
              placeholder="Search adviser"
              noOptionsMessage="No advisers found"
              selectedOptions={selectedFilters.advisers.options}
              data-test="adviser-filter"
            />
            <Filters.Typeahead
              isMulti={true}
              label="Sector"
              name="sector"
              qsParam="sector_descends"
              placeholder="Search sector"
              options={optionMetadata.sectorOptions}
              selectedOptions={selectedFilters.sectors.options}
              data-test="sector-filter"
            />
            <Filters.CheckboxGroup
              legend="Land date"
              name="land_date_financial_year_start"
              qsParam="land_date_financial_year_start"
              options={optionMetadata.financialYearOptions}
              selectedOptions={selectedFilters.financialYears.options}
              data-test="financial-year-filter"
            />
            <StyledDetails summary="What do these options mean?">
              <StyledParagraph>
                Options show financial year. They filter by land date if
                available, then by estimated land date.
              </StyledParagraph>
            </StyledDetails>
          </FilterToggleSection>
          <FilterToggleSection
            id="ProjectCollection.land-date-details-filters"
            label="Land date details"
            isOpen={false}
          >
            <Filters.Date
              type="month"
              label="Actual land date from"
              hint="Date format month as text and year as four digits"
              name="actual_land_date_after"
              qsParamName="actual_land_date_after"
              data-test="actual-land-date-after-filter"
            />
            <Filters.Date
              type="month"
              label="Actual land date to"
              hint="Date format month as text and year as four digits"
              name="actual_land_date_before"
              qsParamName="actual_land_date_before"
              data-test="actual-land-date-before-filter"
            />
            <Filters.Date
              type="month"
              label="Estimated land date from"
              hint="Date format month as text and year as four digits"
              name="estimated_land_date_after"
              qsParamName="estimated_land_date_after"
              data-test="estimated-land-date-after-filter"
            />
            <Filters.Date
              type="month"
              label="Estimated land date to"
              hint="Date format month as text and year as four digits"
              name="estimated_land_date_before"
              qsParamName="estimated_land_date_before"
              data-test="estimated-land-date-before-filter"
            />
            <Filters.CheckboxGroup
              legend="Likelihood to land"
              name="likelihood_to_land"
              qsParam="likelihood_to_land"
              options={optionMetadata.likelihoodToLandOptions}
              selectedOptions={selectedFilters.likelihoodToLand.options}
              data-test="likelihood-to-land-filter"
              groupId="likelihood-to-land-filter"
            />
          </FilterToggleSection>
          <FilterToggleSection
            id="ProjectCollection.investment-and-involvement-details-filters"
            label="Investment and involvement details"
            isOpen={false}
          >
            <Filters.CheckboxGroup
              legend="Investment type"
              name="investment_type"
              qsParam="investment_type"
              options={optionMetadata.investmentTypeOptions}
              selectedOptions={selectedFilters.investmentTypes.options}
              data-test="investment-type-filter"
              groupId="investment-type-filter"
            />
            <Filters.CheckboxGroup
              legend="Involvement level"
              name="involvement_level"
              qsParam="level_of_involvement_simplified"
              options={optionMetadata.involvementLevelOptions}
              selectedOptions={selectedFilters.involvementLevels.options}
              data-test="involvement-level-filter"
              groupId="involvement-level-filter"
            />
          </FilterToggleSection>
          <FilterToggleSection
            id="ProjectCollection.location-details-filters"
            label="Location details"
            isOpen={false}
          >
            <Filters.Typeahead
              isMulti={true}
              label="Country of company origin"
              name="country"
              qsParam="country_investment_originates_from"
              placeholder="Search country"
              options={optionMetadata.countryOptions}
              selectedOptions={selectedFilters.countries.options}
              data-test="country-filter"
            />
            <Filters.Typeahead
              isMulti={true}
              label="UK region"
              name="uk_region"
              qsParam="uk_region_location"
              placeholder="Search UK region"
              options={optionMetadata.ukRegionOptions}
              selectedOptions={selectedFilters.ukRegions.options}
              data-test="uk-region-filter"
            />
          </FilterToggleSection>
        </CollectionFilters>
      </FilteredCollectionList>
    </>
  )
}
export default connect(state2props)(ProjectsCollection)
