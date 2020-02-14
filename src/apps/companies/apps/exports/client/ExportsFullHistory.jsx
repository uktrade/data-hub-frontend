import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { H2 } from '@govuk-react/heading'
import { SPACING, LEVEL_SIZE } from '@govuk-react/constants'
import { CollectionList } from 'data-hub-components'

const Wrapper = styled('div')`
  margin-top: ${SPACING.SCALE_3};
`

function ExportFullHistory({ data }) {
  return (
    <Wrapper>
      <H2 size={LEVEL_SIZE[3]}>Export markets history</H2>
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
