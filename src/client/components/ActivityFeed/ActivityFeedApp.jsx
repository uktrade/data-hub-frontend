import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import ActivityFeed from './ActivityFeed'
import { FILTER_FEED_TYPE } from '../../../apps/companies/apps/activity-feed/constants'

export default class ActivityFeedApp extends React.Component {
  static propTypes = {
    actions: PropTypes.node,
    activityType: PropTypes.array.isRequired,
    apiEndpoint: PropTypes.string.isRequired,
    isGlobalUltimate: PropTypes.bool,
    dnbHierarchyCount: PropTypes.number,
    companyIsArchived: PropTypes.bool,
    numberOfItems: PropTypes.number,
    feedType: PropTypes.string,
  }

  static defaultProps = {
    activityType: [],
    actions: null,
    isGlobalUltimate: false,
    dnbHierarchyCount: null,
    numberOfItems: 20,
    feedType: FILTER_FEED_TYPE.ALL,
  }

  constructor(props) {
    super(props)

    const { activityType, feedType } = props

    this.state = {
      activities: [],
      error: false,
      hasMore: true,
      isLoading: true,
      from: 0,
      total: 0,
      queryParams: {
        activityType,
        feedType: feedType,
      },
    }

    this.onLoadMore = this.onLoadMore.bind(this)
    this.setQueryParams = this.setQueryParams.bind(this)
  }

  async componentDidMount() {
    await this.onLoadMore()
  }

  setQueryParams(queryParams) {
    this.setState(
      {
        from: 0,
        activities: [],
        queryParams,
      },
      this.onLoadMore
    )
  }

  async onLoadMore() {
    const { activities, from } = this.state
    const { numberOfItems } = this.props

    this.setState({
      isLoading: true,
    })

    try {
      const { activities: newActivities, total } =
        await ActivityFeedApp.fetchActivitiesEmpty()

      const allActivities = activities.concat(newActivities)

      this.setState({
        activities: allActivities,
        isLoading: false,
        hasMore: total > allActivities.length,
        from: from + numberOfItems,
        total,
      })
    } catch (e) {
      this.setState({
        isLoading: false,
        hasMore: false,
        error: true,
      })
    }
  }

  static async fetchActivities(
    apiEndpoint,
    from,
    numberOfItems,
    queryParams,
    isOverview
  ) {
    const { activityType, feedType } = queryParams

    const params = {
      from,
      size: numberOfItems,
      activityType,
      feedType,
    }

    const { data } = await axios.get(apiEndpoint, { params })

    if (isOverview && data.activities && data.activities.length) {
      data.activities = data.activities.filter(
        (activity) => activity['dit:application'] !== 'maxemail'
      )
    }

    const { total, activities } = data

    return {
      total,
      activities,
    }
  }

  static async fetchActivitiesEmpty() {
    return {
      total: 0,
      activities: [],
    }
  }

  render() {
    const { activities, isLoading, hasMore, error, total } = this.state
    const {
      actions,
      isGlobalUltimate,
      dnbHierarchyCount,
      companyIsArchived,
      isOverview,
      feedType,
      activityType,
    } = this.props

    const isEmptyFeed = activities.length === 0 && !hasMore

    return (
      <ActivityFeed
        activities={activities}
        actions={actions}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={this.onLoadMore}
        sendQueryParams={this.setQueryParams}
        totalActivities={total}
        isGlobalUltimate={isGlobalUltimate}
        dnbHierarchyCount={dnbHierarchyCount}
        companyIsArchived={companyIsArchived}
        isOverview={isOverview}
        feedType={feedType}
        activityType={activityType}
      >
        {isEmptyFeed && !error && (
          <div data-test="noActivities">There are no activities to show.</div>
        )}
        {error && <div>Error occurred while loading activities.</div>}
      </ActivityFeed>
    )
  }
}
