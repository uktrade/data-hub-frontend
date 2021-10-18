import React from 'react'
import { GREY_4 } from 'govuk-colours'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import { animation, randomNumberMinToMax } from './utils'

const List = styled('ul')`
  margin-top: ${SPACING.SCALE_3};
`

const ListItem = styled('li')`
  border-top: 1px solid ${GREY_4};
  ${({ marginTop }) => marginTop && `margin-top: ${marginTop}px;`};
`

const ListItemRow = styled('div')`
  ${animation};
  ${({ height }) => height && `height: ${height}px;`};
  ${({ widthPercent }) => widthPercent && `width: ${widthPercent}%;`};
  ${({ marginTop }) => marginTop && `margin-top: ${marginTop}px;`};
`

const collectionList =
  ({ listItems = 10, listItemFields = 6 } = {}) =>
  () =>
    (
      <List>
        {Array.from(Array(listItems).keys()).map((i) => (
          <ListItem marginTop={i === 0 ? null : 40}>
            {Array.from(Array(listItemFields).keys()).map((j) => (
              <ListItemRow
                height={j === 0 ? 20 : 13}
                marginTop={j === 0 ? null : 15}
                widthPercent={randomNumberMinToMax(30, 60)}
              />
            ))}
          </ListItem>
        ))}
      </List>
    )

export default collectionList
