import React from 'react'
import { SectionBreak, H3 } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import styled from 'styled-components'

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
  <div>
    <H3>{pluralize('Referral', referrals.length, true)}</H3>
    <SectionBreak visible={true} />
    <StyledItemSpacer>
      {referrals.map(({ id, ...referral }) => (
        <Referral key={id} id={id} {...referral} />
      ))}
    </StyledItemSpacer>
  </div>
)

const EmptyState = () => (
  <div>
    <H3>My Referrals</H3>
    <SectionBreak visible={true} />
    <p>
      You have not received or sent any referrals.
      <br />
      You can refer companies to other advisers from a company page.
    </p>
  </div>
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
