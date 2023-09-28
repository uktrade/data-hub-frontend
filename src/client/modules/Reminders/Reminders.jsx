import React from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { RemindersLists } from '.'
import { state2props } from './state'

export const Reminders = ({ defaultUrl }) => {
  const { reminderType } = useParams()

  if (!reminderType) {
    return <Redirect to={{ pathname: defaultUrl }} />
  }
  return <RemindersLists reminderType={reminderType} />
}

export default connect(state2props)(Reminders)
