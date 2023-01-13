import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'
import styled from 'styled-components'
import {
  DeleteButton,
  RightCol,
  ListItem,
  ItemHeader,
  ItemContent,
} from './styled'
import { BLACK, GREY_1 } from 'govuk-colours'
import { FONT_WEIGHTS } from '@govuk-react/constants'

import { formatMediumDate } from '../../../utils/date'
import { DARK_GREY } from '../../../utils/colors'
import { INTERACTION_NAMES } from '../constants'
import urls from '../../../../lib/urls'

const ItemHeaderLink = styled(Link)({
  fontWeight: FONT_WEIGHTS.regular,
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
            {onDeleteReminder && (
              <DeleteButton
                isMobile={true}
                data-test="delete-button"
                onClick={() => onDeleteReminder(item.id)}
                disabled={disableDelete}
              >
                Delete reminder
              </DeleteButton>
            )}
          </GridCol>
          {/* Display on Tablet and Desktop only */}
          {onDeleteReminder && (
            <RightCol setWidth="one-quarter">
              <DeleteButton
                data-test="delete-button"
                onClick={() => onDeleteReminder(item.id)}
                disabled={disableDelete}
              >
                Delete reminder
              </DeleteButton>
            </RightCol>
          )}
        </>
      )}
    </GridRow>
  </ListItem>
)

export default ExportItemRenderer
