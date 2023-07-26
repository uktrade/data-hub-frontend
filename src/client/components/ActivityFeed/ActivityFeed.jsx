import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import Activity from './Activity'
import ActivityFeedHeader from './ActivityFeedHeader'
import ActivityFeedFilters from './ActivityFeedFilters'
import ActivityFeedPagination from './ActivityFeedPagination'

const ActivityFeedContainer = styled('div')`
  margin: ${SPACING.SCALE_2} 0;
`

const ActivityFeedCardList = styled('ol')`
  list-style-type: none;
  padding: 0;
  margin-top: ${SPACING.SCALE_2};

  & > li {
    margin-bottom: ${SPACING.SCALE_2};
  }
`

export default class ActivityFeed extends React.Component {
  static propTypes = {
    onLoadMore: PropTypes.func,
    sendQueryParams: PropTypes.func,
    children: PropTypes.node,
    activities: PropTypes.arrayOf(PropTypes.object),
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    actions: PropTypes.node,
    totalActivities: PropTypes.number,
    isGlobalUltimate: PropTypes.bool,
    dnbHierarchyCount: PropTypes.number,
    companyIsArchived: PropTypes.bool,
    isOverview: PropTypes.bool,
  }

  static defaultProps = {
    onLoadMore: () => {},
    sendQueryParams: () => {},
    children: null,
    activities: [],
    hasMore: false,
    isLoading: false,
    actions: null,
    totalActivities: 0,
    isGlobalUltimate: false,
    dnbHierarchyCount: null,
  }

  constructor(props) {
    super(props)

    this.state = {}

    this.onActivityTypeFilterChange = this.onActivityTypeFilterChange.bind(this)
  }

  onActivityTypeFilterChange(e) {
    const activityTypeFilter = e.target.value
    const { sendQueryParams } = this.props

    sendQueryParams({
      activityTypeFilter,
    })

    this.setState({
      activityTypeFilter,
    })
  }

  render() {
    const {
      activities,
      onLoadMore,
      hasMore,
      isLoading,
      actions,
      children,
      totalActivities,
      companyIsArchived,
      isOverview,
      feedType,
    } = this.props

    const { activityTypeFilter } = this.state
    return (
      <ActivityFeedContainer data-test="activity-feed">
        {!isOverview && (
          <ActivityFeedHeader
            totalActivities={totalActivities}
            actions={actions}
          />
        )}
        {!companyIsArchived && !isOverview && (
          <ActivityFeedFilters
            activityTypeFilter={activityTypeFilter}
            onActivityTypeFilterChange={this.onActivityTypeFilterChange}
          />
        )}
        <ActivityFeedCardList>
          {activities.map((activity) => (
            <li key={activity.id}>
              <Activity activity={activity} isOverview={isOverview} />
            </li>
          ))}
        </ActivityFeedCardList>

        {hasMore && (
          <ActivityFeedPagination
            isLoading={isLoading}
            onLoadMore={onLoadMore}
            feedType={feedType}
            isOverview={isOverview}
          />
        )}

        {children}
      </ActivityFeedContainer>
    )
  }
}
