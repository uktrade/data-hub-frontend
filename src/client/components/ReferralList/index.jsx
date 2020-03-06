import React from 'react'
import HintText from '@govuk-react/hint-text'
import { SPACING } from '@govuk-react/constants'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import styled from 'styled-components'

import ContentWithHeading from '../ContentWithHeading'
import Task from '../Task'
import Referral from './Referral'
import { REFFERAL_LIST__LOADED } from '../../actions'
import multiInstance from '../../utils/multiinstance'
import reducer from './reducer'

const StyledItemSpacer = styled.div({
  '& > *': {
    marginTop: SPACING.SCALE_4,
  },
})

const ReferralList = ({ referrals }) => (
  <ContentWithHeading heading={pluralize('Referral', referrals.length, true)}>
    <StyledItemSpacer>
      {referrals.map(({ id, ...referral }) => (
        <Referral key={id} id={id} {...referral} />
      ))}
    </StyledItemSpacer>
  </ContentWithHeading>
)

const EmptyState = () => (
  <ContentWithHeading heading="My referrals">
    <HintText>
      You have not received or sent any referrals.
      <br />
      You can refer companies to other advisers from a company page.
    </HintText>
  </ContentWithHeading>
)

ReferralList.propTypes = {
  referrals: PropTypes.arrayOf(PropTypes.shape(Referral.propTypes)),
}

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
        referrals && referrals.length ? (
          <ReferralList referrals={referrals} />
        ) : (
          <EmptyState />
        )
      }
    </Task.Status>
  ),
})
