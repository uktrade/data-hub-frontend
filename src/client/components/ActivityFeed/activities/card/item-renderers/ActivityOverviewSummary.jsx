import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ACTIVITY_TYPE } from '../../../constants'

import CardUtils from '../CardUtils'

import ActivityCardSubject from '../ActivityCardSubject'
import ActivityCardWrapper from '../ActivityCardWrapper'
import ActivityCardLabels from '../ActivityCardLabels'

export default class ActivitySummary extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    date: PropTypes.string,
    kind: PropTypes.string,
    subject: PropTypes.string,
    summary: PropTypes.string,
    url: PropTypes.string,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.ActivitySummary)
  }

  render() {
    const { date, kind, subject, summary, url } = this.props

    const Row = styled('div')`
      display: flex;
    `

    const LeftCol = styled('div')`
      flex: 75%;
    `

    const RightCol = styled('div')`
      flex: 25%;
    `

    return (
      <ActivityCardWrapper dataTest="activity-summary">
        <Row>
          <LeftCol>{date}</LeftCol>
          <RightCol>
            <ActivityCardLabels kind={kind} isOverview={true} />
          </RightCol>
        </Row>
        <ActivityCardSubject linkDataTest={'activity-summary'} url={url}>
          {subject}
        </ActivityCardSubject>
        <Row>{summary}</Row>
      </ActivityCardWrapper>
    )
  }
}
