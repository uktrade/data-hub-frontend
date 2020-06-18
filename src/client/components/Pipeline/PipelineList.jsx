import React from 'react'
import { connect } from 'react-redux'

import ListItem from '@govuk-react/list-item'
import InsetText from '@govuk-react/inset-text'
import Link from '@govuk-react/link'
import { LoadingBox } from 'govuk-react'

import urls from '../../../lib/urls'
import StyledOrderedList from '../StyledOrderedList'

import { state2props, dispatchToProps } from './state'

import PipelineItem from './PipelineItem'
import PipelineFilterSort from './PipelineFilterSort'
import ProgressIndicator from '../ProgressIndicator'
import GetPipeLineData from './GetPipelineData'

const PipelineList = ({
  status,
  statusText,
  lists,
  updateArchiveFilter,
  filter,
}) => {
  return (
    <>
      <PipelineFilterSort
        filter={filter}
        updateArchiveFilter={updateArchiveFilter}
      />
      <GetPipeLineData lists={lists} status={status} filter={filter}>
        {({ items, progress }) => (
          <StyledOrderedList data-auto-id="pipelineList">
            {items.length ? (
              <>
                {items.map((item) => (
                  <ListItem key={item.id}>
                    <PipelineItem item={item} />
                  </ListItem>
                ))}
                {progress && <ProgressIndicator />}
              </>
            ) : (
              <LoadingBox loading={progress} timeIn={0} timeOut={400}>
                <InsetText>
                  There are no companies in the {statusText} section of your
                  pipeline. You can add companies to your pipeline from the
                  company page. To find out more{' '}
                  <Link href={urls.external.helpCentre.pipeline()}>
                    {' '}
                    visit the help centre article on how to use My Pipeline
                  </Link>
                  .
                </InsetText>
              </LoadingBox>
            )}
          </StyledOrderedList>
        )}
      </GetPipeLineData>
    </>
  )
}

export default connect(state2props, dispatchToProps)(PipelineList)
