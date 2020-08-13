import React from 'react'
import PropTypes from 'prop-types'
import VisuallyHidden from '@govuk-react/visually-hidden'

import FieldWrapper from '../FieldWrapper'
import ButtonLink from '../../../ButtonLink'

const FieldUneditable = ({
  name,
  label,
  legend,
  hint,
  onChangeClick,
  children,
}) => {
  return (
    <FieldWrapper {...{ name, label, legend, hint }}>
      {children}{' '}
      {onChangeClick && (
        <ButtonLink inline={true} type="button" onClick={onChangeClick}>
          Change <VisuallyHidden>{label || legend}</VisuallyHidden>
        </ButtonLink>
      )}
    </FieldWrapper>
  )
}

FieldUneditable.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  onChangeClick: PropTypes.func,
  children: PropTypes.node.isRequired,
}

FieldUneditable.defaultProps = {
  label: null,
  legend: null,
  hint: null,
  onChangeClick: null,
}

export default FieldUneditable
