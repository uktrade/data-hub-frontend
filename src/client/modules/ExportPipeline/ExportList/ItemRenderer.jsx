import React from 'react'
import styled from 'styled-components'
import Link from '@govuk-react/link'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import Tag from '../../../../client/components/Tag'
import { MID_GREY } from '../../../../client/utils/colours.js'

const ListItem = styled('li')({
  paddingTop: SPACING.SCALE_4,
  paddingBottom: SPACING.SCALE_3,
  borderBottom: `1px solid ${MID_GREY}`,
  ['&:first-child']: {
    paddingTop: 0,
  },
})

const TagContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
})

const Header = styled('h2')({
  marginBottom: 0,
  marginTop: SPACING.SCALE_4,
  fontSize: FONT_SIZE.SIZE_19,
  fontWeight: FONT_WEIGHTS.bold,
})

const statusToColourMap = {
  WON: 'green',
  ACTIVE: 'blue',
  INACTIVE: 'orange',
}

const ItemRenderer = (item) => {
  const status = item.status.toUpperCase()
  const exportPotential = item.export_potential.toUpperCase()
  return (
    <ListItem key={item.id} data-test="export-item">
      <TagContainer>
        <Tag colour="grey">{`${exportPotential} POTENTIAL`}</Tag>
        <Tag colour={statusToColourMap[status]}>{status}</Tag>
      </TagContainer>
      <Header>{item.company.name}</Header>
      <Link href={`/export/${item.id}/details`}>{item.title}</Link>
    </ListItem>
  )
}

export default ItemRenderer
