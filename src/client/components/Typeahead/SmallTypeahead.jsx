import React from 'react'
import PropTypes from 'prop-types'
import Typeahead from './Typeahead'
import smallStyles from './smallStyles'

const SmallTypeahead = ({ styles, ...props }) => (
  <Typeahead {...props} styles={{ ...smallStyles, ...styles }} />
)

SmallTypeahead.propTypes = {
  styles: PropTypes.object,
}

SmallTypeahead.defaultProps = {
  styles: {},
}

export default SmallTypeahead
