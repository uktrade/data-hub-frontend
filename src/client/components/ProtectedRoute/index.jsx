import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import AccessDenied from '../AccessDenied'

const ProtectedRoute = ({ module, modulePermissions, ...rest }) =>
  modulePermissions.includes(module) ? <Route {...rest} /> : <AccessDenied />

ProtectedRoute.propTypes = {
  module: PropTypes.string.isRequired,
  modulePermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  redirect: PropTypes.string,
}

export default connect((state) => state)(ProtectedRoute)
