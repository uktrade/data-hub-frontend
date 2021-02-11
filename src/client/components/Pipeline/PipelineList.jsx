import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import pluralize from 'pluralize'
import ListItem from '@govuk-react/list-item'
import InsetText from '@govuk-react/inset-text'
import Link from '@govuk-react/link'
import LoadingBox from '@govuk-react/loading-box'
import { SPACING } from '@govuk-react/constants'
import { FONT_WEIGHTS } from '@govuk-react/constants/lib/typography'

import urls from '../../../lib/urls'
import StyledOrderedList from '../StyledOrderedList'

import { state2props, dispatchToProps } from './state'

import PipelineItem from './PipelineItem'
import PipelineFilterSort from './PipelineFilterSort'
import GetPipeLineData from './GetPipelineData'

const StyledItemsCounter = styled('h1')`
  font-weight: ${FONT_WEIGHTS.bold};
  margin: ${SPACING.SCALE_4} 0;
`

const PipelineList = ({
  status,
  lists,
  updateArchiveFilter,
  updateSort,
  filter,
}) => {
  return (
    <>
      <PipelineFilterSort
        filter={filter}
        updateArchiveFilter={updateArchiveFilter}
        updateSort={updateSort}
      />
      <GetPipeLineData lists={lists} status={status} filter={filter}>
        {({ items, progress }) => (
          <>
            <StyledItemsCounter>
              {pluralize('project', items.length, true)}
            </StyledItemsCounter>
            {items.length ? (
              <StyledOrderedList data-auto-id="pipelineList">
                {items.map((item) => (
                  <ListItem key={item.id}>
                    <PipelineItem item={item} />
                  </ListItem>
                ))}
              </StyledOrderedList>
            ) : (
              <LoadingBox loading={progress} timeIn={0} timeOut={400}>
                <InsetText>
                  My pipeline allows you to track the progress of your projects.
                  <br />
                  <br />
                  For more information please see the{' '}
                  <Link href={urls.external.helpCentre.pipeline()}>
                    {' '}
                    help centre article
                  </Link>{' '}
                  on how to use this feature.
                </InsetText>
              </LoadingBox>
            )}
          </>
        )}
      </GetPipeLineData>
    </>
  )
}

export default connect(state2props, dispatchToProps)(PipelineList)
