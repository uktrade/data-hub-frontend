import React from 'react'
import { connect } from 'react-redux'
import { state2props } from './state'
import AddToPipelineForm from './AddToPipelineForm'
import EditPipelineForm from './EditPipelineForm'

function PipeLineFormView(props) {
  const { pipelineItemId } = props
  if (pipelineItemId) {
    return <EditPipelineForm {...props} />
  } else {
    return <AddToPipelineForm {...props} />
  }
}

export default connect(state2props)(PipeLineFormView)
