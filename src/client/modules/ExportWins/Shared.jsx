import React from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'
import { Link } from 'govuk-react'

import ExportWin from '../../components/Resource/ExportWin'
import VerticalSpacer from '../../components/VerticalSpacer'
import urls from '../../../lib/urls'

export const ExportWinTitle = (props) => (
  <ExportWin.Inline {...props}>
    {(exportWin) => (
      <>
        {exportWin.nameOfExport} to {exportWin.country?.name}
      </>
    )}
  </ExportWin.Inline>
)

export const ExportWinsLink = () => (
  <Link
    data-test="export-wins-link"
    as={ReactRouterLink}
    to={urls.companies.exportWins.index()}
  >
    Export wins
  </Link>
)

export const VerticalSpacerWithMarginBottom = styled(VerticalSpacer)`
  margin-bottom: ${SPACING.SCALE_5};
`
