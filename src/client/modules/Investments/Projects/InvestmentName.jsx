import React from 'react'

import { InvestmentResource } from '../../../components/Resource'

const InvestmentName = (props) => (
  <InvestmentResource.Inline {...props}>
    {(project) => project.name}
  </InvestmentResource.Inline>
)

export default InvestmentName
