import React from 'react'
import PropTypes from 'prop-types'
import { DefaultLayout } from '../../../components'

const TaskDetails = ({ taskId }) => {
  return (
    <DefaultLayout
      heading={'Task details'}
      pageTitle={'Task details'}
      breadcrumbs={[]}
      useReactRouter={false}
    >
      <h1 id={taskId}>Task details [{taskId}]</h1>
    </DefaultLayout>
  )
}

TaskDetails.propTypes = {
  taskId: PropTypes.string.isRequired,
}

export default TaskDetails
