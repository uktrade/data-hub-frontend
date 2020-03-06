import PropTypes from 'prop-types'
import React from 'react'

import CompanyLists from './CompanyLists'
import ReferralList from './ReferralList'
import TabNav from './TabNav'

const Dashboard = ({ id }) => (
  <TabNav
    id={`${id}:TabNav`}
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
)

Dashboard.propTypes = {
  id: PropTypes.string.isRequired,
}

export default Dashboard
