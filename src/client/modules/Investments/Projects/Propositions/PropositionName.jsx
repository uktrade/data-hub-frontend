import React from 'react'

import { PropositionResource } from '../../../../components/Resource'

const PropositionName = (props) => (
  <PropositionResource.Inline {...props}>
    {(proposition) => proposition.name}
  </PropositionResource.Inline>
)

export default PropositionName
