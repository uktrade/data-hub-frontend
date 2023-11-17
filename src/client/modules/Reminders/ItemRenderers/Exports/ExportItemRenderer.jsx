import React from 'react'
import styled from 'styled-components'

import { GREY_1 } from '../../../../utils/colours'

import ItemRenderer from '../ItemRenderer'
import { INTERACTION_NAMES } from '../../constants'
import { formatMediumDate } from '../../../../utils/date'
import urls from '../../../../../lib/urls'

const ItemHint = styled('span')({
  color: GREY_1,
})

const ItemContent = ({ item, hintLabel }) => (
  <ul>
    <li>
      <ItemHint>{`${hintLabel}: `}</ItemHint>
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
)

const ExportItemRenderer = ({
  item,
  onDeleteReminder,
  disableDelete,
  hintLabel,
  headerLinkTitle,
}) => (
  <ItemRenderer
    item={item}
    onDeleteReminder={onDeleteReminder}
    disableDelete={disableDelete}
    deletedText={`Received ${formatMediumDate(item.created_on)} for ${
      item.company.name
    }`}
    headerLinkTitle={headerLinkTitle}
    headerLinkHref={urls.companies.detail(item.company.id)}
    itemContent={<ItemContent item={item} hintLabel={hintLabel} />}
  />
)

export default ExportItemRenderer
