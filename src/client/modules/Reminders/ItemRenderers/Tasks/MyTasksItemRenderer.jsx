import React from 'react'
import { Link } from 'govuk-react'
import styled from 'styled-components'

import { DATE_LONG_FORMAT_1 } from '../../../../../common/constants'
import { format } from '../../../../utils/date'
import urls from '../../../../../lib/urls'
import { GREY_1 } from '../../../../utils/colours'
import ItemRenderer from '../ItemRenderer'

const ItemHint = styled('span')({
  color: GREY_1,
})

const ItemContent = ({ item }) => (
  <ul>
    <li>
      <ItemHint>Company: </ItemHint>
      <Link
        href={urls.companies.detail(
          item.task.investment_project_task.investment_project.investor_company
            .id
        )}
      >
        {
          item.task.investment_project_task.investment_project.investor_company
            .name
        }
      </Link>
    </li>
    <li>
      <ItemHint>Date due: </ItemHint>
      {format(item.task.due_date, DATE_LONG_FORMAT_1)}
    </li>
  </ul>
)

const MyTasksItemRenderer = (item, onDeleteReminder, disableDelete) => (
  <ItemRenderer
    item={item}
    onDeleteReminder={onDeleteReminder}
    disableDelete={disableDelete}
    deletedText={`${item.event} for ${item.task.investment_project_task.investment_project.name}`}
    headerLinkHref={urls.tasks.details(item.task.id)}
    headerLinkTitle={item.event}
    itemContent={<ItemContent item={item} />}
  />
)

export default MyTasksItemRenderer
