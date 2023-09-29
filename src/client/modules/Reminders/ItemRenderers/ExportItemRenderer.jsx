import React from 'react'
import { FONT_WEIGHTS } from '@govuk-react/constants'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Link } from 'govuk-react'
import styled from 'styled-components'

import {
  ListItem,
  ItemHeader,
  ItemContent,
  DeleteButton,
  RightCol,
} from './styled'
import { formatMediumDate } from '../../../utils/date'
import { DARK_GREY } from '../../../utils/colours'
import urls from '../../../../lib/urls'

const ItemHeaderLink = styled(Link)({
  fontWeight: FONT_WEIGHTS.regular,
})

export const ExportItemRenderer = ({
  item,
  onDeleteReminder,
  disableDelete,
  headerLinkTitle,
  itemInteractionContent,
}) => {
  return (
    <ListItem key={item.id} data-test="reminders-list-item">
      <GridRow>
        {item.deleted ? (
          <GridCol>
            <ItemHeader data-test="item-header">Reminder deleted</ItemHeader>
            <ItemContent colour={DARK_GREY} data-test="item-content">
              Received {formatMediumDate(item.created_on)} for{' '}
              {item.company.name}
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
                      {headerLinkTitle}
                    </ItemHeaderLink>
                  </li>
                </ul>
              </ItemHeader>

              {itemInteractionContent}

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
}

export default ExportItemRenderer
