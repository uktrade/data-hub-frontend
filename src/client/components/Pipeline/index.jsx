import React from 'react'
import styled from 'styled-components'
import { BLUE, WHITE } from 'govuk-colours'
import { FONT_SIZE } from '@govuk-react/constants'

import TabNav from '../TabNav'
import PipelineList from './PipelineList'
import { STATUS_VALUES } from '../../../apps/my-pipeline/client/constants'

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
      tabs={STATUS_VALUES.reduce((acc, status) => {
        acc[status.url()] = {
          label: status.label,
          content: (
            <PipelineList
              status={status.value}
              statusText={status.label.toLocaleLowerCase()}
            />
          ),
        }
        return acc
      }, {})}
    />
  )
}
