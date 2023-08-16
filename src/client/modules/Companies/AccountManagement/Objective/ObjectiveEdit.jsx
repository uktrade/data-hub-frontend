import React from 'react'
import { useParams } from 'react-router-dom'

import ObjectiveForm from './ObjectiveForm'
import { TASK_GET_OBJECTIVE, state2props } from '../state'
import { OBJECTIVE_LOADED } from '../../../../actions'
import { ID } from '../state'
import { connect } from 'react-redux'
import Task from '../../../../components/Task'

const ObjectiveEdit = ({ objectiveItem }) => {
  const { companyId, objectiveId } = useParams()
  return (
    <>
      {objectiveItem && (
        <ObjectiveForm
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

export default connect(state2props)(ObjectiveEdit)
