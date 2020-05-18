import React from 'react'
import styled from 'styled-components'
import { BLUE, WHITE } from 'govuk-colours'
import { FONT_SIZE } from '@govuk-react/constants'

import urls from '../../../lib/urls'
import TabNav from '../TabNav'
import PipelineList from './PipelineList'

const SubTabs = styled(TabNav)`
  margin-top: -15px; /* Because we are in a tabpanel of an existing TabNav, it has a 30px margin at the top but we don't want that much */

  [role='tablist'] {
    padding: 0;
    margin: 0 0 2px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center; /* Backwards compatible */
    justify-content: space-between;
    color: ${BLUE};
    background-color: ${WHITE};
  }

  [role='tab'] {
    background: none;
    border: none;
    color: ${BLUE};
    font-size: ${FONT_SIZE.SIZE_24};
    line-height: 1.3;
    padding: 0 0 6px 0;

    &[aria-selected='true'] {
      border-bottom: 8px solid ${BLUE};
      color: ${BLUE};
      padding: 0;
    }
  }
`

export default function Pipeline() {
  return (
    <SubTabs
      id="PipelineSubTabs"
      label="Pipeline statuses"
      routed={true}
      data-auto-id="pipelineSubTabNav"
      tabs={{
        [urls.pipeline.index()]: {
          label: 'Prospect',
          content: <PipelineList status="leads" />,
        },
        [urls.pipeline.active()]: {
          label: 'Active',
          content: <PipelineList status="in_progress" />,
        },
        [urls.pipeline.won()]: {
          label: 'Won',
          content: <PipelineList status="win" />,
        },
      }}
    />
  )
}
