import React from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'

import ExportInteractionsList from './ExportInteractionsList'
import ExportResource from '../../components/Resource/Export'
import { DefaultLayout } from '../../components'
import TabNav from '../../components/TabNav'
import ExportDetails from './ExportDetails'
import urls from '../../../lib/urls'

const EXPORT_ID_REGEX = /\/export\/([^/]+)\//
const EXPORT_ASPECT_REGEX = /\/([^/]+)$/

const StyledLink = styled('a')({
  fontSize: 20,
  display: 'inline-block',
  fontFamily: 'Arial, sans-serif',
  marginTop: 8,
  marginBottom: 8,
})

export const CompanyLink = (props) => (
  <ExportResource.Inline {...props}>
    {(exportProject) => (
      <StyledLink
        data-test="export-company-link"
        href={urls.companies.detail(exportProject.company.id)}
      >
        {exportProject.company.name.toUpperCase()}
      </StyledLink>
    )}
  </ExportResource.Inline>
)

export const ExportProjectTitle = (props) => (
  <ExportResource.Inline {...props}>
    {(exportProject) => exportProject.title}
  </ExportResource.Inline>
)

const Export = () => {
  const location = useLocation()
  const matchId = location.pathname.match(EXPORT_ID_REGEX)
  const exportId = matchId ? matchId[1] : null
  const matchAspect = location.pathname.match(EXPORT_ASPECT_REGEX)
  const aspect = matchAspect ? matchAspect[1] : null // aspect will be either 'details' or 'interactions'

  return (
    <DefaultLayout
      preheading={<CompanyLink id={exportId} />}
      heading={<ExportProjectTitle id={exportId} />}
      pageTitle={`Export ${aspect}`}
      breadcrumbs={[
        { link: urls.exportPipeline.index(), text: 'Home' },
        { text: <ExportProjectTitle id={exportId} /> },
      ]}
    >
      <TabNav
        id="export-tab-nav"
        label="Export tab nav"
        layout="vertical"
        routed={true}
        tabs={{
          [urls.exportPipeline.details(exportId)]: {
            label: 'Project details',
            content: <ExportDetails />,
          },
          [urls.exportPipeline.interactions(exportId)]: {
            label: 'Interactions',
            content: ExportInteractionsList,
          },
        }}
      />
    </DefaultLayout>
  )
}

export default Export
