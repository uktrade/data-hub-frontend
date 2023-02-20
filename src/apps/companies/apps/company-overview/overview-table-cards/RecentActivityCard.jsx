import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import { SummaryTable } from '../../../../../client/components'
// import { fetchAllActivityFeedEvents } from '../../activity-feed/controllers'

const BusinessDetailsCard = (props) => {
  const { queryString } = props

  return (
    <>
      <SummaryTable
        caption={
          <>
            Recent activities
            <Link href={`${queryString}/interactions/create`}>
              Add interaction
            </Link>
          </>
        }
        data-test="recentInteractionsContainer"
      >
        <SummaryTable.Row heading="Acitivites">TO DO</SummaryTable.Row>

        <Table.Row>
          <Table.Cell colSpan={2}>
            <Link href={`${queryString}/activity`}>View all activities</Link>
          </Table.Cell>
        </Table.Row>
      </SummaryTable>
    </>
  )
}

BusinessDetailsCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default BusinessDetailsCard
