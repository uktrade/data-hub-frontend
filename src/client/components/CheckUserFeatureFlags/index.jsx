import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import Resource from '../Resource'
import { ID, TASK_GET_USER_FEATURE_FLAGS } from './state'
import { useHistory, useLocation } from 'react-router-dom'

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
  const location = useLocation()
  const history = useHistory()
  const existingParams = qs.parse(location.search.slice(1))

  const [isFlagOn, setFlagOn] = useState(false)

  useEffect(() => {
    if (isFlagOn) {
      history.replace({
        search: qs.stringify({
          ...existingParams,
          ['featureTesting']: userFeatureFlagName,
        }),
      })
    }
  }, [isFlagOn])

  return (
    <Resource
      name={TASK_GET_USER_FEATURE_FLAGS}
      id={ID}
      payload={userFeatureFlagName}
    >
      {(isFeatureFlagEnabled) => {
        setFlagOn(isFeatureFlagEnabled)
        return children(isFeatureFlagEnabled)
      }}
    </Resource>
  )
}

CheckUserFeatureFlag.propTypes = {
  children: PropTypes.func,
  userFeatureFlagName: PropTypes.string.isRequired,
}
