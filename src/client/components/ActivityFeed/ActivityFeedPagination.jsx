import React from 'react'
import Button from '@govuk-react/button'
import LoadingBox from '@govuk-react/loading-box'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { SPACING } from '@govuk-react/constants'

import { FILTER_FEED_TYPE } from '../../../apps/companies/apps/activity-feed/constants'

const Pagination = styled('div')`
  text-align: center;
  margin-top: ${SPACING.SCALE_5};
  margin-bottom: ${SPACING.SCALE_6};
`

export default class ActivityFeedPagination extends React.Component {
  static propTypes = {
    onLoadMore: PropTypes.func,
    isLoading: PropTypes.bool,
    isOverview: PropTypes.bool,
  }

  static defaultProps = {
    onLoadMore: () => {},
    isLoading: false,
    isOverview: false,
  }

  render() {
    const { onLoadMore, isLoading, isOverview, feedType } = this.props
    return (
      (!isOverview || isLoading) && (
        <Pagination>
          <LoadingBox
            loading={isLoading}
            backgroundColorOpacity={1}
            timeOut={0}
          >
            {feedType === FILTER_FEED_TYPE.ALL && (
              <Button
                disabled={isLoading}
                onClick={onLoadMore}
                buttonColour="#dee0e2"
                buttonTextColour="#000"
              >
                Show more activity
              </Button>
            )}
          </LoadingBox>
        </Pagination>
      )
    )
  }
}
