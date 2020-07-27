import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import EntityListItem from './EntityListItem'

const StyledEntityList = styled('ol')`
  margin-bottom: ${SPACING.SCALE_4};
  padding-left: 0;
`

const StyledEntityListItem = styled('li')`
  list-style-type: none;
`

const EntityList = ({ entities, entityRenderer: EntityRenderer }) => (
  <StyledEntityList>
    {entities.map((entity) => (
      <StyledEntityListItem key={`entity-list-item_${entity.id}`}>
        <EntityRenderer {...entity} />
      </StyledEntityListItem>
    ))}
  </StyledEntityList>
)

EntityList.propTypes = {
  entities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      heading: PropTypes.string.isRequired,
      meta: PropTypes.array.isRequired,
      data: PropTypes.object.isRequired,
    })
  ).isRequired,
  entityRenderer: PropTypes.func,
}

EntityList.defaultProps = {
  entityRenderer: EntityListItem,
}

export default EntityList
