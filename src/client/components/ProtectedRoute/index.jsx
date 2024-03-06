import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AccessDenied from '../AccessDenied'

export const ProtectedRoute = ({
  module,
  modulePermissions,
  userPermissions = [],
  routePermissions = [],
  test123,
  ...rest
}) => {
  let RouteComponent = test123
  return routePermissions.every((p) => userPermissions.includes(p)) &
    modulePermissions.includes(module) ? (
    <RouteComponent {...rest} />
  ) : (
    <AccessDenied />
  )
}

ProtectedRoute.propTypes = {
  module: PropTypes.string.isRequired,
  modulePermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  routePermissions: PropTypes.arrayOf(PropTypes.string),
  redirect: PropTypes.string,
}

export default connect((state) => state)(ProtectedRoute)
