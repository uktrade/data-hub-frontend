import React from 'react'
import ActivityFeed from './ActivityFeed'
import PropTypes from 'prop-types'
import axios from 'axios'

export default class ActivityFeedApp extends React.Component {
  static propTypes = {
    actions: PropTypes.node,
    activityTypeFilter: PropTypes.string,
    activityTypeFilters: PropTypes.object,
    apiEndpoint: PropTypes.string.isRequired,
    isGlobalUltimate: PropTypes.bool,
    dnbHierarchyCount: PropTypes.number,
    companyIsArchived: PropTypes.bool,
  }

  static defaultProps = {
    activityTypeFilter: null,
    activityTypeFilters: {},
    actions: null,
    isGlobalUltimate: false,
    dnbHierarchyCount: null,
  }

  constructor(props) {
    super(props)

    const { activityTypeFilter } = props

    this.state = {
      activities: [],
      error: false,
      hasMore: true,
      isLoading: true,
      from: 0,
      total: 0,
      queryParams: {
        activityTypeFilter,
        showDnbHierarchy: false,
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
    const { activities, queryParams, from } = this.state
    const { apiEndpoint } = this.props
    const size = 20

    this.setState({
      isLoading: true,
    })

    try {
      const { activities: newActivities, total } =
        await ActivityFeedApp.fetchActivities(
          apiEndpoint,
          from,
          size,
          queryParams
        )

      const allActivities = activities.concat(newActivities)

      this.setState({
        activities: allActivities,
        isLoading: false,
        hasMore: total > allActivities.length,
        from: from + size,
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

  static async fetchActivities(apiEndpoint, from, size, queryParams) {
    const { activityTypeFilter, showDnbHierarchy } = queryParams

    const params = {
      from,
      size,
      activityTypeFilter,
      showDnbHierarchy,
    }

    const { data } = await axios.get(apiEndpoint, { params })

    const { total, activities } = data

    return {
      total,
      activities,
    }
  }

  render() {
    const { activities, isLoading, hasMore, error, total } = this.state
    const {
      activityTypeFilters,
      actions,
      isGlobalUltimate,
      dnbHierarchyCount,
      companyIsArchived,
    } = this.props

    const isEmptyFeed = activities.length === 0 && !hasMore

    return (
      <ActivityFeed
        activities={activities}
        activityTypeFilters={activityTypeFilters}
        actions={actions}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={this.onLoadMore}
        sendQueryParams={this.setQueryParams}
        totalActivities={total}
        isGlobalUltimate={isGlobalUltimate}
        dnbHierarchyCount={dnbHierarchyCount}
        companyIsArchived={companyIsArchived}
      >
        {isEmptyFeed && !error && <div>There are no activities to show.</div>}
        {error && <div>Error occurred while loading activities.</div>}
      </ActivityFeed>
    )
  }
}
