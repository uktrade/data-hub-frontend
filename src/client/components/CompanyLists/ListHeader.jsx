import { H3 } from '@govuk-react/heading'
import Link from '@govuk-react/link'
import React from 'react'
import styled from 'styled-components'

import urls from '../../../lib/urls'
import FormActions from '../Form/elements/FormActions'
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

const StyledFormActions = styled(FormActions)({
  textAlign: 'right',
})

const ListHeader = ({ id, name }) => (
  <StyledRoot>
    <StyledHeading>{name}</StyledHeading>
    <StyledFormActions>
      <SecondaryButton as={Link} href={urls.companyLists.rename(id)}>
        Edit list name
      </SecondaryButton>
      <SecondaryButton as={Link} href={urls.companyLists.delete(id)}>
        Delete list
      </SecondaryButton>
    </StyledFormActions>
  </StyledRoot>
)

export default ListHeader
