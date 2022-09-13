import React from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'

import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardSubject from './card/ActivityCardSubject'

const { format } = require('../../../utils/date')

export default class CompaniesHouseCompany extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
    showDnbHierarchy: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(
      activity,
      ACTIVITY_TYPE.CompaniesHouseCompany
    )
  }

  render() {
    const { activity } = this.props

    const startTime = get(activity, 'object.startTime')
    const reference = get(activity, 'object.name')

    const summary = get(activity, 'summary')
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

    const metadata = [
      { label: 'Date', value: format(startTime) },
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

    return (
      <ActivityCardWrapper dataTest="companies-house-company-activity">
        <ActivityCardLabels
          isExternalActivity={true}
          theme="Companies House"
          service="Company Record"
          kind="Companies House Update"
        ></ActivityCardLabels>
        <ActivityCardSubject>{summary}</ActivityCardSubject>
        <ActivityCardMetadata metadata={metadata} />
      </ActivityCardWrapper>
    )
  }
}
