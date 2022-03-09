import React, { useEffect, useState } from 'react'
import axios from 'axios'
import urls from '../../../lib/urls'
import Activity from '../ActivityFeed/Activity'

export default function ContactInteractionsApp(props) {
  const [activityData, setActivityData] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    const fetchActivities = async () => {
      const { data } = await axios
        .get(urls.contacts.activity.data(props.contactId))
        .catch((e) => setError(e))

      setActivityData(data.activities)
    }
    fetchActivities()
  }, [])

  return (
    <>
      {error && <p>There's been a problem, please try again later</p>}
      {activityData &&
        activityData.map((activity, index) => (
          <div key={`activity-${index}`}>
            <Activity activity={activity} />
          </div>
        ))}
    </>
  )
}
