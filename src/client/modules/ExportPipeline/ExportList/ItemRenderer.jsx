import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '@govuk-react/link'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import Tag from '../../../components/Tag'
import { ToggleSection } from '../../../components/ToggleSection'
import { DARK_GREY, MID_GREY, BLACK } from '../../../../client/utils/colours.js'
import {
  formatShortDate,
  formatMediumDateTime,
} from '../../../../client/utils/date.js'
import { currencyGBP } from '../../../../client/utils/number-utils'

const ListItem = styled('li')({
  paddingTop: SPACING.SCALE_4,
  borderBottom: `1px solid ${MID_GREY}`,
  ['&:first-child']: {
    paddingTop: 0,
  },
  ['&:last-child']: {
    borderBottom: 'none',
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

const StyledDL = styled('dl')({
  fontSize: FONT_SIZE.SIZE_16,
})

const lineHeightMixin = {
  lineHeight: '1.5',
}

const StyledDT = styled('dt')({
  color: DARK_GREY,
  float: 'left',
  clear: 'left',
  marginRight: '5px',
  ...lineHeightMixin,
})

const StyledDD = styled('dd')({
  color: BLACK,
  ...lineHeightMixin,
})

const statusToColourMap = {
  WON: 'green',
  ACTIVE: 'blue',
  INACTIVE: 'orange',
}

const ItemRenderer = (item) => {
  const [toggleLabel, setToggleLabel] = useState('Show')
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
      <ToggleSection
        onOpen={(open) =>
          open ? setToggleLabel('Hide') : setToggleLabel('Show')
        }
        label={toggleLabel}
        id={`${item.id}_toggle`}
      >
        <StyledDL data-test="export-details">
          <StyledDT>Destination:</StyledDT>
          <StyledDD>{item.destination_country.name}</StyledDD>
          <StyledDT>Total estimated export value:</StyledDT>
          <StyledDD>
            {currencyGBP(item.estimated_export_value_amount)}{' '}
            <span>({item.estimated_export_value_years.name})</span>
          </StyledDD>
          <StyledDT>Estimated date for win:</StyledDT>
          <StyledDD>{formatShortDate(item.estimated_win_date)}</StyledDD>
          <StyledDT>Main sector:</StyledDT>
          <StyledDD>{item.sector.name}</StyledDD>
          <StyledDT>Owner:</StyledDT>
          <StyledDD>{item.owner.name}</StyledDD>
          <StyledDT>Created on:</StyledDT>
          <StyledDD>{formatMediumDateTime(item.created_on)}</StyledDD>
        </StyledDL>
      </ToggleSection>
    </ListItem>
  )
}

const shape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}).isRequired

ItemRenderer.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    company: shape,
    owner: shape,
    destination_country: shape,
    sector: shape,
    estimated_export_value_years: shape,
    created_on: PropTypes.string.isRequired,
    estimated_export_value_amount: PropTypes.string.isRequired,
    estimated_win_date: PropTypes.string.isRequired,
    export_potential: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
}

export default ItemRenderer
