import React from 'react'
import PropTypes from 'prop-types'
import { FileUpload } from 'govuk-react'

import FieldWrapper from '../FieldWrapper'
import { useField } from '../../hooks'

const FieldFileUpload = ({ name, required, label }) => {
  const { error, touched, onBlur, onChangeFileUpload } = useField({
    name,
    required,
  })

  return (
    <FieldWrapper name={name}>
      <FileUpload
        name={name}
        onChange={onChangeFileUpload}
        onBlur={onBlur}
        meta={{ error, touched }}
      >
        <strong>{label}</strong>
      </FileUpload>
    </FieldWrapper>
  )
}

FieldFileUpload.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.string,
}

export default FieldFileUpload
