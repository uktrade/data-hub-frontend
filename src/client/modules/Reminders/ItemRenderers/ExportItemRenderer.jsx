import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'
import styled from 'styled-components'
import { BLACK, GREY_1, GREY_2 } from 'govuk-colours'
import { H3 } from '@govuk-react/heading'
import {
  SPACING,
  FONT_SIZE,
  FONT_WEIGHTS,
  HEADING_SIZES,
  MEDIA_QUERIES,
} from '@govuk-react/constants'

import { formatMediumDate } from '../../../utils/date'
import { DARK_GREY } from '../../../utils/colors'
import { INTERACTION_NAMES } from '../constants'
import urls from '../../../../lib/urls'

const Button = styled('button')({
  padding: 0,
  background: 'transparent',
  border: 'none',
  fontSize: FONT_SIZE.SIZE_16,
  fontFamily: 'inherit',
  color: DARK_GREY,
  cursor: 'pointer',
  textDecoration: 'underline',
})

const DeleteButton = styled(Button)({
  display: ({ isMobile }) => (isMobile ? 'inline' : 'none'),
  marginBottom: SPACING.SCALE_4,
  [MEDIA_QUERIES.TABLET]: {
    display: ({ isMobile }) => (isMobile ? 'none' : 'inline'),
    margin: `${SPACING.SCALE_3} 0`,
  },
  [MEDIA_QUERIES.DESKTOP]: {
    display: ({ isMobile }) => (isMobile ? 'none' : 'inline'),
    margin: `${SPACING.SCALE_3} 0`,
  },
})

const RightCol = styled(GridCol)({
  display: 'none',
  textAlign: 'right',
  [MEDIA_QUERIES.TABLET]: {
    display: 'block',
  },
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'block',
  },
})

const ListItem = styled('li')({
  borderBottom: `solid 1px ${GREY_2}`,
})

const ItemHeader = styled(H3)({
  fontSize: HEADING_SIZES.SMALL,
  marginTop: SPACING.SCALE_3,
  marginBottom: SPACING.SCALE_4,
})

const ItemHeaderLink = styled(Link)({
  fontWeight: FONT_WEIGHTS.regular,
})

const ItemContent = styled('div')({
  color: ({ colour }) => colour,
  marginBottom: SPACING.SCALE_3,
})

const ItemHint = styled('span')({
  color: GREY_1,
})

const ExportItemRenderer = (item, onDeleteReminder, disableDelete) => (
  <ListItem key={item.id} data-test="reminders-list-item">
    <GridRow>
      {item.deleted ? (
        <GridCol>
          <ItemHeader data-test="item-header">Reminder deleted</ItemHeader>
          <ItemContent colour={DARK_GREY} data-test="item-content">
            Received {formatMediumDate(item.created_on)} for {item.company.name}
          </ItemContent>
        </GridCol>
      ) : (
        <>
          <GridCol>
            <ItemHeader data-test="item-header">
              <ul>
                <li>Received {formatMediumDate(item.created_on)}</li>
                <li>
                  <ItemHeaderLink
                    href={`${urls.companies.detail(item.company.id)}`}
                  >
                    No interaction recorded for {item.company.name}
                  </ItemHeaderLink>
                </li>
              </ul>
            </ItemHeader>
            <ItemContent colour={BLACK} data-test="item-content">
              <ul>
                <li>
                  <ItemHint>Date of last interaction:</ItemHint>{' '}
                  {formatMediumDate(item.last_interaction_date)}
                </li>
                {item.interaction ? (
                  <>
                    <li>
                      <ItemHint>Recorded by:</ItemHint>{' '}
                      {item.interaction.created_by?.name || 'Name unknown'}
                      {item.interaction.created_by?.dit_team
                        ? ` in ${item.interaction.created_by.dit_team.name}`
                        : ' - team unknown'}
                    </li>
                    <li>
                      <ItemHint>Interaction type:</ItemHint>{' '}
                      {INTERACTION_NAMES[item.interaction.kind]}
                    </li>
                    <li>
                      <ItemHint>Subject:</ItemHint> {item.interaction.subject}
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <ItemHint>Recorded by:</ItemHint>
                      {' no information'}
                    </li>
                    <li>
                      <ItemHint>Interaction type:</ItemHint>
                      {' no information'}
                    </li>
                    <li>
                      <ItemHint>Subject:</ItemHint>
                      {' no information'}
                    </li>
                  </>
                )}
              </ul>
            </ItemContent>
            {/* Display on mobile only */}
            {onDeleteReminder && !disableDelete && (
              <DeleteButton
                isMobile={true}
                data-test="delete-button"
                onClick={() => onDeleteReminder(item.id)}
              >
                Delete reminder
              </DeleteButton>
            )}
          </GridCol>
          {/* Display on Tablet and Desktop only */}
          {onDeleteReminder && (
            <RightCol setWidth="one-quarter">
              {!disableDelete && (
                <DeleteButton
                  data-test="delete-button"
                  onClick={() => onDeleteReminder(item.id)}
                >
                  Delete reminder
                </DeleteButton>
              )}
            </RightCol>
          )}
        </>
      )}
    </GridRow>
  </ListItem>
)

export default ExportItemRenderer
