import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import { OBJECTIVE_LOADED } from '../../../../actions'
import ObjectiveArchiveForm from './ObjectiveArchiveForm'
import { ID, TASK_GET_OBJECTIVE, state2props } from '../state'
import Task from '../../../../components/Task'

const ObjectiveArchive = ({ objectiveItem }) => {
  const { companyId, objectiveId } = useParams()
  return (
    <>
      {objectiveItem && (
        <ObjectiveArchiveForm
          company={objectiveItem.company}
          objectiveItem={objectiveItem}
        />
      )}
      <Task.Status
        name={TASK_GET_OBJECTIVE}
        id={ID}
        startOnRender={{
          payload: { companyId: companyId, objectiveId: objectiveId },
          onSuccessDispatch: OBJECTIVE_LOADED,
        }}
      />
    </>
  )
}

export default connect(state2props)(ObjectiveArchive)
