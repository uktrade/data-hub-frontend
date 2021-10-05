import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const ProtectedLink = ({ module, modulePermissions, children = null }) =>
  modulePermissions.includes(module) ? children : null

ProtectedLink.propTypes = {
  module: PropTypes.string.isRequired,
  modulePermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.element,
}

export default connect((state) => state)(ProtectedLink)
