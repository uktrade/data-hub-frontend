import React from 'react'
import PropTypes from 'prop-types'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

const FormLayout = ({ setWidth, children }) => (
  <GridRow>
    <GridCol setWidth={setWidth}>{children}</GridCol>
  </GridRow>
)

FormLayout.propTypes = {
  setWidth: PropTypes.string,
  children: PropTypes.element.isRequired,
}

export default FormLayout
