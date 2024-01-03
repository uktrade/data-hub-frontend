import React from 'react'
import PropTypes from 'prop-types'

import Resource from '../Resource/Resource'
import Analytics from '../Analytics'
import { ID, TASK_GET_USER_FEATURE_FLAGS } from './state'

/**
This component enables the checking of a particular user feature flag in React.
It can be used in a react component to conditionally render children or take
action based on whether the user feature is enabled. e.g.

<CheckUserFeatureFlag userFeatureFlagName="my-user-feature">
{(isFeatureFlagEnabled)
  => {isFeatureFlagEnabled && <MyNewComponent />}}
</CheckUserFeatureFlag />
*/

const CheckUserFeatureFlag = ({ children, userFeatureFlagName }) => (
  <Resource
    name={TASK_GET_USER_FEATURE_FLAGS}
    id={ID + userFeatureFlagName}
    payload={userFeatureFlagName}
  >
    {(isFeatureFlagEnabled) => (
      <Analytics>
        {(pushAnalytics) => {
          isFeatureFlagEnabled &&
            pushAnalytics({
              event: 'featureFlag',
              extra: {
                name: userFeatureFlagName,
              },
            })
          return children(isFeatureFlagEnabled)
        }}
      </Analytics>
    )}
  </Resource>
)
CheckUserFeatureFlag.propTypes = {
  children: PropTypes.func,
  userFeatureFlagName: PropTypes.string.isRequired,
}

export default CheckUserFeatureFlag
