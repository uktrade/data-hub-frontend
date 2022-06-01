import React from 'react'
import PropTypes from 'prop-types'
import Resource from '../Resource'
import { ID, TASK_GET_USER_FEATURE_FLAGS } from './state'

/** 
This component enables the checking of a particular user feature flag in React.
It can be used in a react component to conditionally render children or take
action based on whether the user feature is enabled. e.g.

<CheckUserFeature userFeatureFlagName="my-user-feature">
{(isFeatureFlagEnabled) 
  => {isFeatureFlagEnabled && <MyNewComponent />}} 
</CheckUserFeature />

*/
export default function CheckUserFeatureFlag({
  children,
  userFeatureFlagName,
}) {
  return (
    <Resource
      name={TASK_GET_USER_FEATURE_FLAGS}
      id={ID}
      payload={userFeatureFlagName}
    >
      {(isFeatureFlagEnabled) => children(isFeatureFlagEnabled)}
    </Resource>
  )
}

CheckUserFeatureFlag.propTypes = {
  children: PropTypes.func,
  userFeatureFlagName: PropTypes.string.isRequired,
}
