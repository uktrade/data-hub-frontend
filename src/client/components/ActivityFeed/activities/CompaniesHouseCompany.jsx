import React from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'

import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityOverviewSummary from './card/item-renderers/ActivityOverviewSummary'
import OverviewActivityCardWrapper from './card/OverviewActivityCardWrapper'

const { format } = require('../../../utils/date')

export default class CompaniesHouseCompany extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(
      activity,
      ACTIVITY_TYPE.CompaniesHouseCompany
    )
  }

  render() {
    const { activity, isOverview } = this.props

    const startTime = get(activity, 'object.startTime')
    const reference = get(activity, 'object.name')

    const subject = get(activity, 'summary')
    const address = get(activity, 'object.location:dit:address')
    const postcode = get(activity, 'object.location:dit:postcode')
    const confStmtLastMadeUpDate = format(
      get(activity, 'object.dit:confStmtLastMadeUpDate')
    )
    const confStmtNextDueDate = format(
      get(activity, 'object.dit:confStmtNextDueDate')
    )
    const incorporationDate = format(
      get(activity, 'object.dit:incorporationDate')
    )
    const nextDueDate = format(get(activity, 'object.dit:nextDueDate'))
    const returnsLastMadeUpDate = format(
      get(activity, 'object.dit:returnsLastMadeUpDate')
    )
    const returnsNextDueDate = format(
      get(activity, 'object.dit:returnsNextDueDate')
    )
    const sicCodes = get(activity, 'object.dit:sicCodes')

    const sicCodesList = sicCodes.map((value) => (
      <span key={value}>
        {value}
        <br />
      </span>
    ))

    const date = format(startTime)

    const metadata = [
      { label: 'Date', value: date },
      { label: 'Company name', value: reference },
      { label: 'Address', value: address },
      { label: 'Postcode', value: postcode },
      {
        label: 'Confirmation Statement last made up date',
        value: confStmtLastMadeUpDate,
      },
      {
        label: 'Confirmation Statement next due date',
        value: confStmtNextDueDate,
      },
      {
        label: 'Incorporation date',
        value: incorporationDate,
      },
      { label: 'Next due date', value: nextDueDate },
      {
        label: 'Returns last made up date',
        value: returnsLastMadeUpDate,
      },
      {
        label: 'Returns next due date',
        value: returnsNextDueDate,
      },
      {
        label: 'SIC code(s)',
        value: sicCodesList,
      },
    ]

    return isOverview ? (
      <OverviewActivityCardWrapper dataTest="companies-house-company-activity">
        <ActivityOverviewSummary
          activity={activity}
          date={date}
          kind="Company Record"
          subject={subject}
          summary="Companies House Updated"
        ></ActivityOverviewSummary>
      </OverviewActivityCardWrapper>
    ) : (
      <ActivityCardWrapper dataTest="companies-house-company-activity">
        <ActivityCardSubject>{subject}</ActivityCardSubject>
        <ActivityCardLabels
          isExternalActivity={true}
          theme="Companies House"
          service="Company Record"
          kind="Companies House Update"
        ></ActivityCardLabels>
        <ActivityCardMetadata metadata={metadata} />
      </ActivityCardWrapper>
    )
  }
}
