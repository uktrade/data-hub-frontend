import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

import {
  ListItem,
  ItemHeader,
  ItemContent,
  DeleteButton,
  RightCol,
  ItemHeaderLink,
  ItemFooter,
} from './styled'
import { formatMediumDateParsed } from '../../../utils/date'
import { BLACK, DARK_GREY } from '../../../utils/colours'

export const ItemRenderer = ({
  item,
  onDeleteReminder,
  disableDelete,
  deletedText,
  headerLinkHref,
  headerLinkTitle,
  itemContent,
  itemFooterContent,
}) => {
  return (
    <ListItem key={item.id} data-test="reminders-list-item">
      <GridRow>
        {item.deleted ? (
          <GridCol>
            <ItemHeader data-test="item-header">Reminder deleted</ItemHeader>
            <ItemContent colour={DARK_GREY} data-test="item-content">
              {deletedText}
            </ItemContent>
          </GridCol>
        ) : (
          <>
            <GridCol>
              <ItemHeader data-test="item-header">
                <ul>
                  <li>Received {formatMediumDateParsed(item.created_on)}</li>
                  {headerLinkHref && (
                    <li>
                      <ItemHeaderLink href={headerLinkHref}>
                        {headerLinkTitle}
                      </ItemHeaderLink>
                    </li>
                  )}
                </ul>
              </ItemHeader>

              <ItemContent colour={BLACK} data-test="item-content">
                {itemContent}
              </ItemContent>

              {itemFooterContent && (
                <ItemFooter data-test="item-footer">
                  {itemFooterContent}
                </ItemFooter>
              )}

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

export default ItemRenderer
