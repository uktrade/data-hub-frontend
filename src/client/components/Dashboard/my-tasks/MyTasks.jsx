import React from 'react'
import { connect } from 'react-redux'

import { state2props } from './state'

const MyTasks = () => <h1>Hello Tasks</h1>

export default connect(state2props)(MyTasks)
