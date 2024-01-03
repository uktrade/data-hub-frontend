import React from 'react'
import PropTypes from 'prop-types'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'
import styled from 'styled-components'

import { GREY_3 } from '../../../client/utils/colours'
import SelectFilter from './filters/SelectFilter'
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
  activityTypeFilter,
  onActivityTypeFilterChange,
}) => {
  return (
    <ActivityFeedFiltersRow>
      <StyledTitle>Filter by</StyledTitle>

      <Analytics>
        {(pushAnalytics) => (
          <SelectFilter
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
  activityTypeFilter: PropTypes.array.isRequired,
  onActivityTypeFilterChange: PropTypes.func.isRequired,
}

export default ActivityFeedFilters
