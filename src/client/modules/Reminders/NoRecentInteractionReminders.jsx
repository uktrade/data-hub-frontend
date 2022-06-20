import React from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'qs'

import Resource from '../../components/Resource'

import RemindersCollection from './RemindersCollection'
import { TASK_GET_NO_RECENT_INTERACTION_REMINDERS } from './state'

const NoRecentInteractionReminders = () => {
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10)
  return (
    <Resource
      name={TASK_GET_NO_RECENT_INTERACTION_REMINDERS}
      id={TASK_GET_NO_RECENT_INTERACTION_REMINDERS}
      payload={{ page }}
    >
      {({ results, count }) => (
        <RemindersCollection
          subject="projects with no recent interaction"
          results={results}
          count={count}
          page={page}
        />
      )}
    </Resource>
  )
}

export default NoRecentInteractionReminders
