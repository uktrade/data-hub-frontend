import React from 'react'
import styled from 'styled-components'
import { Details, Paragraph } from 'govuk-react'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import urls from '../../../../lib/urls'
import {
  nonFdiState2props,
  NON_FDI_LIST_ID,
  TASK_GET_NON_FDI_PROJECTS_LIST,
} from './state'
import {
  INVESTMENTS__PROJECTS_LOADED,
  INVESTMENTS__SET_PROJECTS_METADATA,
} from '../../../actions'
import { TASK_GET_INVESTMENTS_PROJECTS_METADATA } from '../../../../apps/investments/client/projects/state'
import { InvestmentResource } from '../../../components/Resource'
import { checkIfAssociatedProjectExists } from './transformers'

import {
  CollectionFilters,
  DefaultLayout,
  FilteredCollectionList,
  FilterToggleSection,
  Filters,
  Panel,
} from '../../../components'
import {
  listSkeletonPlaceholder,
  CheckboxPlaceholder,
  ToggleHeadingPlaceholder,
} from '../../../components/SkeletonPlaceholder'

const StyledParagraph = styled(Paragraph)`
  font-size: ${FONT_SIZE.SIZE_16};
`
const StyledDetails = styled(Details)`
  margin-bottom: 0;
  span {
    font-size: ${FONT_SIZE.SIZE_16};
  }
`

const StyledPanel = styled(Panel)`
  margin-bottom: ${SPACING.SCALE_3};
`

const FindAssociatedProject = ({
  payload,
  currentAdviserId,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const investmentProject = useParams()
  const collectionListTask = {
    name: TASK_GET_NON_FDI_PROJECTS_LIST,
    id: NON_FDI_LIST_ID,
    progressMessage: 'Loading Non-FDI projects',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload: {
        ...payload,
        projectId: investmentProject.projectId,
      },
      onSuccessDispatch: INVESTMENTS__PROJECTS_LOADED,
    },
  }
  const collectionListMetadataTask = {
    name: TASK_GET_INVESTMENTS_PROJECTS_METADATA,
    id: NON_FDI_LIST_ID,
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

  return (
    <InvestmentResource id={investmentProject.projectId}>
      {(project) => (
        <DefaultLayout
          heading={checkIfAssociatedProjectExists(
            project.associatedNonFdiRAndDProject
          )}
          pageTitle={`${checkIfAssociatedProjectExists(
            project.associatedNonFdiRAndDProject
          )} - ${project.name} - Projects - Investments`}
          breadcrumbs={[
            { link: urls.dashboard.index(), text: 'Home' },
            {
              link: urls.investments.index(),
              text: 'Investments',
            },
            {
              link: urls.investments.projects.index(),
              text: 'Projects',
            },
            {
              link: urls.investments.projects.details(project.id),
              text: project.name,
            },
            {
              text: checkIfAssociatedProjectExists(
                project.associatedNonFdiRAndDProject
              ),
            },
          ]}
          useReactRouter={false}
        >
          <StyledPanel data-test="help-panel">
            <p>Select a Non-FDI project to associate it with {project.name}.</p>
          </StyledPanel>
          <FilteredCollectionList
            {...props}
            collectionName="investment project"
            sortOptions={optionMetadata.sortOptions}
            taskProps={collectionListTask}
            selectedFilters={selectedFilters}
            entityName="project"
            defaultQueryParams={{
              page: 1,
              sortby: 'created_on:desc',
            }}
          >
            <CollectionFilters taskProps={collectionListMetadataTask}>
              <Filters.Input
                id="NonFDICollection.name"
                qsParam="name"
                name="name"
                label="Project name"
                placeholder="Search project name"
              />
              <Filters.Input
                id="NonFDICollection.project-code"
                qsParam="project_code"
                name="project_code"
                label="Project code"
                placeholder="Search project code"
              />
              <FilterToggleSection
                id="NonFDICollection.stage-and-status-filters"
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
                id="NonFDICollection.project-details-filters"
                label="Project details"
                isOpen={false}
              >
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
            </CollectionFilters>
          </FilteredCollectionList>
        </DefaultLayout>
      )}
    </InvestmentResource>
  )
}
export default connect(nonFdiState2props)(FindAssociatedProject)
