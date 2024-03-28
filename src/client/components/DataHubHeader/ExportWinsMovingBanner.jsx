import React from 'react'
import styled from 'styled-components'

const Root = styled.p({
  maxWidth: '100%',
  background: '#053299',
  color: 'white',
  padding: '0.5em',
  textAlign: 'center',
  margin: 0,
})

const Link = styled.a({
  '&&': {
    color: 'white',
    textDecoration: 'underline',
  },
})

const ExportWinsMovingBanner = () => (
  <Root>
    <strong>Important:</strong>{' '}
    <Link
      target="_blank"
      href="https://data-services-help.trade.gov.uk/data-hub/updates/announcements/export-wins-is-moving-to-data-hub/"
    >
      Export Wins is moving to Data Hub on 3 April 2024
    </Link>
  </Root>
)

export default ExportWinsMovingBanner
