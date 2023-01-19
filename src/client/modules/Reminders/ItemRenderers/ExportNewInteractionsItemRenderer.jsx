import React from 'react'
import { BLACK, GREY_1 } from 'govuk-colours'
import styled from 'styled-components'
import { ItemContent } from './styled'

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
            {item.interaction ? (
              <>
                <li>
                  <ItemHint>Name/Team: </ItemHint>
                  {item.interaction.created_by?.name || 'Name unknown'}
                  {item.interaction.created_by?.dit_team
                    ? ` in ${item.interaction.created_by.dit_team.name}`
                    : ' - team unknown'}
                </li>
                <li>
                  <ItemHint>Type of interaction: </ItemHint>
                  {INTERACTION_NAMES[item.interaction.kind]}
                </li>
                <li>
                  <ItemHint>Interaction title: </ItemHint>
                  {item.interaction.subject}
                </li>
              </>
            ) : (
              <>
                <li>
                  <ItemHint>Name/Team: </ItemHint>
                  {' no information'}
                </li>
                <li>
                  <ItemHint>Type of interaction: </ItemHint>
                  {' no information'}
                </li>
                <li>
                  <ItemHint>Interaction title: </ItemHint>
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
