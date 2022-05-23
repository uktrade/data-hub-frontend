import React from 'react'
import Table from '@govuk-react/table'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import { isEmpty } from 'lodash'

import { investments } from '../../../../../lib/urls'

import { TASK_GET_NOTIFICATION_SETTINGS } from './state'
import Resource from '../../../../../client/components/Resource'

const LABELS = {
  30: '30 days before',
  60: '60 days before',
}

const transformEstimatedLandDate = (estimatedLandDate) =>
  isEmpty(estimatedLandDate)
    ? ['None']
    : estimatedLandDate.map((value) => LABELS[value])

const InvestmentNotificationSettings = ({ investment }) => (
  <Resource
    name={TASK_GET_NOTIFICATION_SETTINGS}
    id={TASK_GET_NOTIFICATION_SETTINGS}
    payload={investment}
  >
    {({ estimatedLandDate }) => (
      <>
        <p data-test="notification-preferences">
          Change your email notification preferences for: {investment.name}
        </p>
        <Table
          head={
            <Table.Row>
              <Table.CellHeader>Notification type</Table.CellHeader>
              <Table.CellHeader>Subscriptions</Table.CellHeader>
              <Table.CellHeader>&nbsp;</Table.CellHeader>
            </Table.Row>
          }
        >
          <Table.Row>
            <Table.Cell>Estimated land date</Table.Cell>
            <Table.Cell data-test="notifications-estimated-land-date">
              {estimatedLandDate &&
                transformEstimatedLandDate(estimatedLandDate).map(
                  (item, index) => <div key={index}>{item}</div>
                )}
            </Table.Cell>
            <Table.Cell>
              <Link
                href={investments.notificationSettings.estimatedLandDate(
                  investment.id
                )}
                data-test="notifications-estimated-land-date-link"
              >
                Edit settings
              </Link>
            </Table.Cell>
          </Table.Row>
        </Table>
      </>
    )}
  </Resource>
)

InvestmentNotificationSettings.propTypes = {
  investment: PropTypes.object.isRequired,
}

export default InvestmentNotificationSettings
