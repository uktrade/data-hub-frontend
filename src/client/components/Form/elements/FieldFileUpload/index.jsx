import React from 'react'
import PropTypes from 'prop-types'
import { FileUpload } from 'govuk-react'

import FieldWrapper from '../FieldWrapper'
import { useField } from '../../hooks'

const FieldFileUpload = ({ name, label }) => {
  const { error, touched, onBlur, onChangeFileUpload } = useField({
    name,
    // required,
  })

  return (
    <FieldWrapper name={name} label={label}>
      <FileUpload
        name={name}
        // onChange={onChange}
        onChange={onChangeFileUpload}
        onBlur={onBlur}
        meta={{ error, touched }}
      />
    </FieldWrapper>
  )
}

FieldFileUpload.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.string,
}

export default FieldFileUpload
