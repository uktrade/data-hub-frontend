import React from 'react'
import HintText from '@govuk-react/hint-text'
import { SPACING } from '@govuk-react/constants'
import pluralize from 'pluralize'
import styled from 'styled-components'

import ContentWithHeading from '../ContentWithHeading'
import Task from '../Task'
import Referral from './Referral'
import { REFFERAL_LIST__LOADED } from '../../actions'
import multiInstance from '../../utils/multiinstance'
import reducer from './reducer'

const StyledOl = styled.ol({
  listStyleType: 'none',
  '& > *': {
    marginTop: SPACING.SCALE_4,
  },
})

export default multiInstance({
  name: 'ReferralList',
  reducer,
  component: ({ id, referrals }) => (
    <Task.Status
      name="Referrals"
      id={id}
      progressMessage="Loading referrals"
      startOnRender={{
        onSuccessDispatch: REFFERAL_LIST__LOADED,
      }}
    >
      {() =>
        referrals && (
          <ContentWithHeading
            heading={pluralize('Referral', referrals.length, true)}
          >
            {referrals.length ? (
              <StyledOl>
                {referrals.map(({ id, ...referral }) => (
                  <li key={id}>
                    <Referral id={id} {...referral} />
                  </li>
                ))}
              </StyledOl>
            ) : (
              <HintText>
                You have not received or sent any referrals.
                <br />
                You can refer companies to other advisers from a company page.
              </HintText>
            )}
          </ContentWithHeading>
        )
      }
    </Task.Status>
  ),
})
