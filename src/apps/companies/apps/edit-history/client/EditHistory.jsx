import React from 'react'
import PropTypes from 'prop-types'
import { H3 } from 'govuk-react'

function EditHistory ({ editHistory }) {
  return (
    <>
      <H3>This page is hidden behind an Express route</H3>
      {editHistory.map((item, index) => (
        <pre key={index}>{JSON.stringify(item, null, 2)}</pre>
      ))}
    </>
  )
}

EditHistory.propTypes = {
  editHistory: PropTypes.array.isRequired,
}

export default EditHistory
