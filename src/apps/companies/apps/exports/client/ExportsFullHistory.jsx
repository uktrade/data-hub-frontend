import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { H3 } from '@govuk-react/heading'

import { CollectionList } from 'data-hub-components'

const Wrapper = styled('div')`
  margin-top: 16px;
`

const DEFAULT_ITEMS_PER_PAGE = 10

function ExportFullHistory({ data }) {
  const [activePage, setActivePage] = useState(1)

  const index = activePage - 1
  const offset = index * DEFAULT_ITEMS_PER_PAGE
  const limit = (index + 1) * DEFAULT_ITEMS_PER_PAGE

  return (
    <Wrapper>
      <H3>Export markets history</H3>
      <CollectionList
        items={data.results}
        onPageClick={(page, event) => {
          setActivePage(page)
          event.preventDefault()
        }}
        activePage={activePage}
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
