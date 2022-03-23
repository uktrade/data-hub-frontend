import React from 'react'
import { connect } from 'react-redux'
import { TASK_GET_CONTACT_INTERACTION_LIST, ID, state2props } from './state'
import { CONTACTS__INTERACTION_LIST_LOADED } from '../../../client/actions'
import Task from '../../../client/components/Task'

const ContactInteractionsApp = ({ contactId }) => {
  return (
    <Task.Status
      name={TASK_GET_CONTACT_INTERACTION_LIST}
      id={ID}
      progressMessage="loading contacts interaction list"
      startOnRender={{
        payload: contactId,
        onSuccessDispatch: CONTACTS__INTERACTION_LIST_LOADED,
      }}
    >
      {() => {
        return (
          <>
            <h2>Contact Interaction List Here</h2>
          </>
        )
      }}
    </Task.Status>
  )
}

// TODO: removed this comment later
// export default function ContactInteractionsApp(props) {
//   const [activityData, setActivityData] = useState()
//   const [error, setError] = useState()

//   useEffect(() => {
//     const fetchActivities = async () => {
//       const { data } = await axios
//         .get(urls.contacts.activity.data(props.contactId))
//         .catch((e) => setError(e))

//       setActivityData(data.activities)
//     }
//     fetchActivities()
//   }, [])

//   return (
//     <>
//       {error && <p>There's been a problem, please try again later</p>}
//       {activityData &&
//         activityData.map((activity, index) => (
//           <div key={`activity-${index}`}>
//             <Activity activity={activity} />
//           </div>
//         ))}
//     </>
//   )
// }

export default connect(state2props)(ContactInteractionsApp)
