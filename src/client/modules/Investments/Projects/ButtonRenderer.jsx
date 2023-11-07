// import { connect } from 'react-redux'
// import { BLACK, GREY_3 } from '../../../utils/colours'
// import Task from '../../../../client/components/Task'
// import { ID, TASK_PROPOSITION_COMPLETE, propositionState2props } from './state'
// import { PROPOSITION_COMPLETE } from '../../../../client/actions'
// import React from 'react'
// import { Button, Link } from 'govuk-react'
// import urls from '../../../../lib/urls'

// const buttonRenderer = ({ id, investment_project_id, status }) => {
//   // Define the Task and buttons in here and wire up to Redux
//   if (status === 'abandoned' || status === 'completed') {
//     return null
//   }
//   return (
//     <>
//       <Button
//         as={Link}
//         href={urls.investments.projects.proposition.abandon(
//           investment_project_id,
//           id
//         )}
//         data-test="abandon-button"
//         buttonColour={GREY_3}
//         buttonTextColour={BLACK}
//       >
//         Abandon
//       </Button>{' '}
//       <Task>
//         {(getTask) => {
//           const postCompleteTask = getTask(TASK_PROPOSITION_COMPLETE, ID)
//           return (
//             <Button
//               onClick={() =>
//                 postCompleteTask.start({
//                   payload: {
//                     investmentProjectId: investment_project_id,
//                     propositionId: id,
//                   },
//                   onSuccessDispatch: PROPOSITION_COMPLETE,
//                 })
//               }
//               data-test="complete-button"
//             >
//               Complete
//             </Button>
//           )
//         }}
//       </Task>
//     </>
//   )
// }

// // export default connect(propositionState2props)(buttonRenderer)
