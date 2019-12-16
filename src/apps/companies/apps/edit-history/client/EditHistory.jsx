import React from 'react'
import PropTypes from 'prop-types'
import { H3 } from '@govuk-react/heading'
import pluralise from 'pluralise'

import EditHistoryList from './EditHistoryList'

function EditHistory ({ editHistory }) {
  const numberOfChanges = `${editHistory.length} ${pluralise(editHistory.length, 'change')}`
  return (
    <div>
      <H3>{numberOfChanges}</H3>
      <EditHistoryList items={editHistory} />
    </div>
  )
}

EditHistory.propTypes = {
  editHistory: PropTypes.array.isRequired,
}

export default EditHistory
