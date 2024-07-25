import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import { get } from 'lodash'

import Tag from '../../../components/Tag/index.jsx'
import { ToggleSection } from '../../../components/ToggleSection/index.jsx'
import { DARK_GREY, MID_GREY, BLACK } from '../../../utils/colours.js'
import { formatShortDate, formatMediumDateTime } from '../../../utils/date.js'
import { currencyGBP } from '../../../utils/number-utils.js'
import { ToggleButton } from '../../../components/ToggleSection/BaseToggleSection.jsx'

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

const LinkContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
})

const StyledHeader = styled('h3')({
  marginBottom: 5,
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

const DashboardToggleSection = styled(ToggleSection)({
  [ToggleButton]: {
    fontSize: FONT_SIZE.SIZE_16,
  },
})

const statusToColourMap = {
  WON: 'green',
  ACTIVE: 'blue',
  INACTIVE: 'orange',
}

const EstimatedExport = ({
  estimated_export_value_amount,
  estimated_export_value_years,
}) => {
  if (estimated_export_value_amount && estimated_export_value_years) {
    return (
      <>
        {currencyGBP(estimated_export_value_amount)}{' '}
        <span>({estimated_export_value_years.name})</span>
      </>
    )
  }
  if (estimated_export_value_amount) {
    return <>{currencyGBP(estimated_export_value_amount)}</>
  }
  if (estimated_export_value_years) {
    return <>{estimated_export_value_years.name}</>
  }
  return <span>Not set</span>
}

const ResultItem = (item) => {
  const [toggleLabel, setToggleLabel] = useState('Show')
  const status = item.status.toUpperCase()
  const exportPotential = item.export_potential.toUpperCase()
  return (
    <ListItem key={item.id} data-test="export-item">
      <TagContainer>
        <Tag colour="grey">{`${exportPotential} POTENTIAL`}</Tag>
        <Tag colour={statusToColourMap[status]}>{status}</Tag>
      </TagContainer>
      <LinkContainer>
        <StyledHeader>
          <a href={`/companies/${item.company.id}/overview`}>
            {item.company.name}
          </a>
        </StyledHeader>
        <a href={`/export/${item.id}/details`}>{item.title}</a>
      </LinkContainer>
      <DashboardToggleSection
        onOpen={(open) =>
          open ? setToggleLabel('Hide') : setToggleLabel('Show')
        }
        label={toggleLabel}
        id={`${item.id}_toggle`}
      >
        <StyledDL data-test="export-details">
          <StyledDT>Destination:</StyledDT>
          <StyledDD>
            {get(item, 'destination_country.name', 'Not set')}
          </StyledDD>
          <StyledDT>Total estimated export value:</StyledDT>
          <StyledDD>
            <EstimatedExport
              estimated_export_value_amount={item.estimated_export_value_amount}
              estimated_export_value_years={item.estimated_export_value_years}
            />
          </StyledDD>
          <StyledDT>Estimated date for win:</StyledDT>
          <StyledDD>
            {item.estimated_win_date
              ? formatShortDate(item.estimated_win_date)
              : 'Not set'}
          </StyledDD>
          <StyledDT>Main sector:</StyledDT>
          <StyledDD>{get(item, 'sector.name', 'Not set')}</StyledDD>
          <StyledDT>Owner:</StyledDT>
          <StyledDD>{item.owner.name}</StyledDD>
          <StyledDT>Created on:</StyledDT>
          <StyledDD>{formatMediumDateTime(item.created_on)}</StyledDD>
        </StyledDL>
      </DashboardToggleSection>
    </ListItem>
  )
}

const shape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}).isRequired

ResultItem.propTypes = {
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

export default ResultItem
