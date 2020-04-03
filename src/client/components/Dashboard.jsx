import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { GREY_2 } from 'govuk-colours'

import CompanyLists from './CompanyLists'
import ReferralList from './ReferralList'
import TabNav from './TabNav'

const StyledDiv = styled('div')`
  border-top: 4px solid ${GREY_2};
  padding-top: 16px;
`

const Dashboard = ({ id }) => (
  <StyledDiv>
    <TabNav
      id={`${id}.TabNav`}
      label="Dashboard"
      selectedIndex={0}
      tabs={[
        {
          label: 'My companies lists',
          content: <CompanyLists />,
        },
        {
          label: 'My referrals',
          content: <ReferralList id={`${id}:ReferralList`} />,
        },
      ]}
    />
  </StyledDiv>
)

Dashboard.propTypes = {
  id: PropTypes.string.isRequired,
}

export default Dashboard
