import React from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { RemindersLists } from '.'
import { connect } from 'react-redux'
import { state2props } from './state'

const RemindersRoutes = ({ defaultUrl }) => {
  const { reminderType } = useParams()

  if (!reminderType) {
    return <Redirect to={{ pathname: defaultUrl }} />
  }
  return <RemindersLists reminderType={reminderType} />
}

export default connect(state2props)(RemindersRoutes)
