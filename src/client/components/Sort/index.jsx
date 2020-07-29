import styled from 'styled-components'

import { Select } from 'govuk-react'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import { spacing } from '@govuk-react/lib'

const Sort = styled(Select)`
  ${spacing.responsive({
    size: 2,
    property: 'margin',
    direction: ['top'],
  })}

  span {
    ${spacing.responsive({
      size: 1,
      property: 'margin',
      direction: ['left'],
    })}
  }

  select {
    flex: 1;
  }

  ${MEDIA_QUERIES.TABLET} {
    display: flex;
    align-items: center;
    flex-direction: row;
    span {
      ${spacing.responsive({
        size: 1,
        property: 'margin',
        direction: ['right'],
      })}
    }
  }
`

export default Sort
