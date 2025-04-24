import React from 'react'
import styled from 'styled-components'

import { formatDate, DATE_FORMAT_FULL } from '../../../../utils/date-utils'
import urls from '../../../../../lib/urls'
import { GREY_1 } from '../../../../utils/colours'
import ItemRenderer from '../ItemRenderer'
import AccessibleLink from '../../../../components/Link'

const ItemHint = styled('span')({
  color: GREY_1,
})

const ItemContent = ({ item }) => (
  <ul>
    {item.task.company && (
      <li>
        <ItemHint>Company: </ItemHint>
        <AccessibleLink href={urls.companies.detail(item.task.company.id)}>
          {item.task.company.name}
        </AccessibleLink>
      </li>
    )}

    <li>
      <ItemHint>Date due: </ItemHint>
      {formatDate(item.task.due_date, DATE_FORMAT_FULL)}
    </li>
  </ul>
)

const MyTasksItemRenderer = (item, onDeleteReminder, disableDelete) => (
  <ItemRenderer
    item={item}
    onDeleteReminder={onDeleteReminder}
    disableDelete={disableDelete}
    deletedText={`${item.event} for ${
      item.task.company ? item.task.company.name : item.task.title
    }`}
    headerLinkHref={urls.tasks.details(item.task.id)}
    headerLinkTitle={item.event}
    itemContent={<ItemContent item={item} />}
    key={item.id}
  />
)

export default MyTasksItemRenderer
