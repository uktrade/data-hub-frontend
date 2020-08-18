import { H3 } from '@govuk-react/heading'
import { LEVEL_SIZE } from '@govuk-react/constants'
import Link from '@govuk-react/link'
import React from 'react'
import styled from 'styled-components'

import { FormActions } from '../../../client/components'
import urls from '../../../lib/urls'
import SecondaryButton from '../SecondaryButton'

const StyledRoot = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
})

const StyledHeading = styled(H3)({
  flexGrow: 1,
  marginBottom: 0,
})

const ListHeader = ({ id, name }) => (
  <StyledRoot>
    <StyledHeading size={LEVEL_SIZE[4]}>{name}</StyledHeading>
    <FormActions>
      <SecondaryButton as={Link} href={urls.companyLists.rename(id)}>
        Edit list name
      </SecondaryButton>
      <SecondaryButton as={Link} href={urls.companyLists.delete(id)}>
        Delete list
      </SecondaryButton>
    </FormActions>
  </StyledRoot>
)

export default ListHeader
