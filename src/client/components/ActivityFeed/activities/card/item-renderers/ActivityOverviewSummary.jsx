import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import ActivityCardSubject from '../ActivityCardSubject'
import ActivityCardLabels from '../ActivityCardLabels'

export default class ActivityOverviewSummary extends React.PureComponent {
  static propTypes = {
    date: PropTypes.string,
    kind: PropTypes.string,
    subject: PropTypes.node,
    summary: PropTypes.string,
  }

  render() {
    const { date, kind, subject, summary } = this.props

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
      <>
        <Row>
          <LeftCol>{date}</LeftCol>
          <RightCol>
            <ActivityCardLabels kind={kind} isOverview={true} />
          </RightCol>
        </Row>
        <ActivityCardSubject dataTest="activity-summary-subject">
          {subject}
        </ActivityCardSubject>
        <Row>{summary}</Row>
      </>
    )
  }
}
