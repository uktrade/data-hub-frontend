import React from 'react'
import PropTypes from 'prop-types'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import styled from 'styled-components'

import { GREY_3, GREY_4 } from '../../../client/utils/colours'
import SelectFilter from './filters/SelectFilter'
import ActivityFeedCheckbox from './ActivityFeedCheckbox'
import Analytics from '../Analytics'

const ActivityFeedFiltersRow = styled('div')`
  padding: ${SPACING.SCALE_2};
  background: ${GREY_3};
  display: block;
  align-items: center;

  ${MEDIA_QUERIES.DESKTOP} {
    display: flex;
  }
`

const StyledCheckboxContainer = styled('div')`
  background: ${GREY_4};
  align-items: center;
  padding: 11px;

  ${MEDIA_QUERIES.DESKTOP} {
    margin-right: ${SPACING.SCALE_5};
  }
`

const StyledTitle = styled('div')`
  margin-right: ${SPACING.SCALE_4};
  white-space: nowrap;
`

const trackAnalytics = (e, pushAnalytics) => {
  const { options, selectedIndex } = e.target
  const dropDownOptionSelected = options[selectedIndex].text
  pushAnalytics({
    event: 'activityTypeDropDown',
    extra: {
      dropDownOptionSelected,
    },
  })
}

const ActivityFeedFilters = ({
  activityTypeFilters,
  activityTypeFilter,
  onActivityTypeFilterChange,
  showActivitiesFromAllCompanies,
  isGlobalUltimate,
  dnbHierarchyCount,
}) => {
  const showDnbHierarchyFilter = isGlobalUltimate && dnbHierarchyCount > 1
  return (
    <ActivityFeedFiltersRow>
      <StyledTitle>Filter by</StyledTitle>
      {showDnbHierarchyFilter && (
        <StyledCheckboxContainer>
          <ActivityFeedCheckbox
            name="ultimateHQSubsidiariesFilter"
            onChange={showActivitiesFromAllCompanies}
          >
            Activity across all {dnbHierarchyCount} companies
          </ActivityFeedCheckbox>
        </StyledCheckboxContainer>
      )}
      <Analytics>
        {(pushAnalytics) => (
          <SelectFilter
            filters={activityTypeFilters}
            onActivityTypeFilterChange={(e) => {
              onActivityTypeFilterChange(e)
              trackAnalytics(e, pushAnalytics)
            }}
            value={activityTypeFilter}
          />
        )}
      </Analytics>
    </ActivityFeedFiltersRow>
  )
}

ActivityFeedFilters.propTypes = {
  activityTypeFilters: PropTypes.array.isRequired,
  activityTypeFilter: PropTypes.string.isRequired,
  onActivityTypeFilterChange: PropTypes.func.isRequired,
  showActivitiesFromAllCompanies: PropTypes.func.isRequired,
  dnbHierarchyCount: PropTypes.number,
  isGlobalUltimate: PropTypes.bool.isRequired,
}

ActivityFeedFilters.defaultProps = {
  dnbHierarchyCount: null,
}

export default ActivityFeedFilters
