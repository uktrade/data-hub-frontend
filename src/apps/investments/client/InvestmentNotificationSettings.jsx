import React from 'react'
import Table from '@govuk-react/table'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import { investments } from '../../../lib/urls'

import { TASK_GET_NOTIFICATION_SETTINGS } from './state'
import Resource from '../../../client/components/Resource'

const NotificationSettings = ({ investment }) => {
  return (
    <Resource
      name={TASK_GET_NOTIFICATION_SETTINGS}
      id={TASK_GET_NOTIFICATION_SETTINGS}
      payload={investment}
    >
      {(data) => (
        <>
          <p>Change your email preferences for: {investment.name}</p>
          <Table>
            <Table.Row>
              <Table.Header>Notification type</Table.Header>
              <Table.Header>Subscriptions</Table.Header>
              <Table.Header>&nbsp;</Table.Header>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Estimated land date</Table.Cell>
              <Table.Cell data-test="notifications-estimated-land-date">
                {data.estimatedLandDate &&
                  data.estimatedLandDate.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
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
}

NotificationSettings.propTypes = {
  investment: PropTypes.object.isRequired,
}

export default NotificationSettings
