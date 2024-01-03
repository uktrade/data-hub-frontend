import React from 'react'

import DataHubProvider from '../provider'
import CheckUserFeatureFlag from '../../../../../src/client/components/CheckUserFeatureFlags'
import { TASK_GET_USER_FEATURE_FLAGS } from '../../../../../src/client/components/CheckUserFeatureFlags/state'
import { getUserFeatureFlags } from '../../../../../src/client/components/CheckUserFeatureFlags/tasks'

describe('CheckUserFeatureFlags', () => {
  const Component = ({ userFeatureFlagName }) => (
    <DataHubProvider
      tasks={{ [TASK_GET_USER_FEATURE_FLAGS]: getUserFeatureFlags }}
    >
      <CheckUserFeatureFlag userFeatureFlagName={userFeatureFlagName}>
        {(isFeatureFlagEnabled) =>
          isFeatureFlagEnabled ? (
            <p>feature flag is enabled</p>
          ) : (
            <p>feature flag is not enabled</p>
          )
        }
      </CheckUserFeatureFlag>
    </DataHubProvider>
  )

  const enabledFlag = 'flag-enabled'
  const disabledFlag = 'flag-disabled'

  beforeEach(() => {
    cy.intercept('GET', '/api-proxy/whoami/', {
      active_features: [enabledFlag],
    })
  })

  context('when the feature flag is not enabled', () => {
    beforeEach(() => {
      cy.mount(<Component userFeatureFlagName={disabledFlag} />)
    })

    it('should pass false to its children', () => {
      cy.contains('feature flag is not enabled')
    })
  })

  context('when the feature flag is enabled', () => {
    beforeEach(() => {
      cy.mount(<Component userFeatureFlagName={enabledFlag} />)
    })

    it('should pass true to the children', () => {
      cy.contains('feature flag is enabled')
    })
  })
})
