import React from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'qs'

import Resource from '../../components/Resource'

import RemindersCollection from './RemindersCollection'
import { TASK_GET_ESTIMATED_LAND_DATE_REMINDERS } from './state'

const EstimatedLandDateReminders = () => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10)
  return (
    <Resource
      name={TASK_GET_ESTIMATED_LAND_DATE_REMINDERS}
      id={TASK_GET_ESTIMATED_LAND_DATE_REMINDERS}
      payload={{ page, sortby: qsParams.sortby }}
    >
      {({ results, count }) => (
        <RemindersCollection
          subject="approaching estimated land dates"
          results={results}
          count={count}
          page={page}
        />
      )}
    </Resource>
  )
}

export default EstimatedLandDateReminders
