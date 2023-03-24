import React from 'react'
import styled from 'styled-components'

import Tag from '../../../../client/components/Tag'

const TagContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
})

const statusToColourMap = {
  WON: 'green',
  ACTIVE: 'blue',
  INACTIVE: 'orange',
}

const ListItem = styled('li')({})

const ItemRenderer = (item) => {
  const status = item.status.toUpperCase()
  const exportPotential = item.export_potential.toUpperCase()
  return (
    <ListItem key={item.id} data-test="export-item">
      <TagContainer>
        <Tag colour="grey">{`${exportPotential} POTENTIAL`}</Tag>
        <Tag colour={statusToColourMap[status]}>{status}</Tag>
      </TagContainer>
    </ListItem>
  )
}

export default ItemRenderer
