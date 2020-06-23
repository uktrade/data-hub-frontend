import React from 'react'
import { connect } from 'react-redux'
import { state2props } from './state'
import AddPipelineItemForm from './AddPipelineItemForm'
import EditPipelineItemForm from './EditPipelineItemForm'

function PipeLineFormView(props) {
  const { pipelineItemId } = props
  if (pipelineItemId) {
    return <EditPipelineItemForm {...props} />
  } else {
    return <AddPipelineItemForm {...props} />
  }
}

export default connect(state2props)(PipeLineFormView)
