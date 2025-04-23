import React from 'react'

import urls from '../../../../../lib/urls'
import ItemRenderer from '../ItemRenderer'
import AccessibleLink from '../../../../components/Link'

const ItemContent = ({ item }) => (
  <>
    {item.event} for{' '}
    <AccessibleLink
      href={`${urls.investments.projects.details(item.project.id)}`}
    >
      {item.project.name}
    </AccessibleLink>
  </>
)

const InvestmentItemRenderer = (item, onDeleteReminder, disableDelete) => (
  <ItemRenderer
    key={item.id}
    item={item}
    onDeleteReminder={onDeleteReminder}
    disableDelete={disableDelete}
    deletedText={`${item.event} for ${item.project.name}`}
    itemContent={<ItemContent item={item} />}
    itemFooterContent={`Project code ${item.project.project_code}`}
  />
)

export default InvestmentItemRenderer
