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

  select {
    flex: 1;
    width: 'initial';
    min-width: 200px;
  }

  ${MEDIA_QUERIES.TABLET} {
    display: flex;
    align-items: center;
    flex-direction: row;
    ${spacing.responsive({
      size: 0,
      property: 'margin',
      direction: ['top'],
    })}
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
