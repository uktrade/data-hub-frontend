import React from 'react'
import styled from 'styled-components'

import { BLACK, GREY_1 } from '../../../utils/colours'
import { ItemContent } from './styled'
import { formatMediumDate } from '../../../utils/date'
import { INTERACTION_NAMES } from '../constants'
import ExportItemRenderer from './ExportItemRenderer'

const ItemHint = styled('span')({
  color: GREY_1,
})

export const ExportNewInteractionsItemRenderer = (
  item,
  onDeleteReminder,
  disableDelete
) => {
  return (
    <ExportItemRenderer
      item={item}
      onDeleteReminder={onDeleteReminder}
      disableDelete={disableDelete}
      headerLinkTitle={`New interaction recorded for ${item.company.name}`}
      itemInteractionContent={
        <ItemContent colour={BLACK} data-test="item-content">
          <ul>
            <li>
              <ItemHint>Date of interaction: </ItemHint>
              {formatMediumDate(item.last_interaction_date)}
            </li>
            {item.interaction ? (
              <>
                <li>
                  <ItemHint>Recorded by: </ItemHint>
                  {item.interaction.created_by?.name || 'Name unknown'}
                  {item.interaction.created_by?.dit_team
                    ? ` in ${item.interaction.created_by.dit_team.name}`
                    : ' - team unknown'}
                </li>
                <li>
                  <ItemHint>Interaction type: </ItemHint>
                  {INTERACTION_NAMES[item.interaction.kind]}
                </li>
                <li>
                  <ItemHint>Subject: </ItemHint>
                  {item.interaction.subject}
                </li>
              </>
            ) : (
              <>
                <li>
                  <ItemHint>Recorded by: </ItemHint>
                  {' no information'}
                </li>
                <li>
                  <ItemHint>Interaction type: </ItemHint>
                  {' no information'}
                </li>
                <li>
                  <ItemHint>Subject: </ItemHint>
                  {' no information'}
                </li>
              </>
            )}
          </ul>
        </ItemContent>
      }
    />
  )
}
