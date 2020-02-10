import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { H3 } from '@govuk-react/heading'

import { CollectionList } from 'data-hub-components'

const Wrapper = styled('div')`
  margin-top: 16px;
`

function ExportFullHistory({ data }) {
  return (
    <Wrapper>
      <H3>Export markets history</H3>
      <CollectionList
        items={data.results}
        totalItems={data.count}
        itemName="result"
      />
    </Wrapper>
  )
}

ExportFullHistory.propTypes = {
  data: PropTypes.object.isRequired,
}

export default ExportFullHistory
