import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import ListItem from '@govuk-react/list-item'
import InsetText from '@govuk-react/inset-text'
import Checkbox from '@govuk-react/checkbox'
import Link from '@govuk-react/link'
import { spacing } from '@govuk-react/lib'
import { GREY_4, WHITE } from 'govuk-colours'

import urls from '../../../lib/urls'
import StyledOrderedList from '../StyledOrderedList'
import Task from '../Task'
import {
  state2props,
  dispatchToProps,
  ID as STATE_ID,
  TASK_GET_PIPELINE_LIST,
} from './state'
import { PIPELINE__LIST_LOADED } from '../../actions'
import PipelineItem from './PipelineItem'

const StyledSortFilter = styled.div`
  ${spacing.responsive({
    size: 3,
    property: 'padding',
    direction: ['left', 'right'],
  })}
  ${spacing.responsive({
    size: 2,
    property: 'padding',
    direction: ['top', 'bottom'],
  })}
  background-color: ${GREY_4};
  
  span:before {
    background-color: ${WHITE};
  }
`

const StyledCheckbox = styled(Checkbox)`
  margin: 0;
`

const PipelineList = ({
  status,
  statusText,
  items,
  updateArchiveFilter,
  filter,
}) => {
  const { includeArchive } = filter

  return (
    <>
      <StyledSortFilter>
        <StyledCheckbox
          data-auto-id="pipeline-filter-archive"
          onChange={() => updateArchiveFilter(!includeArchive)}
          checked={includeArchive}
        >
          Show archived projects
        </StyledCheckbox>
      </StyledSortFilter>
      <Task.Status
        name={TASK_GET_PIPELINE_LIST}
        id={`${STATE_ID}_${status}`}
        progressMessage="loading pipelines items"
        noun="my pipelines"
        startOnRender={{
          payload: { status, ...(!includeArchive && { archive: false }) },
          onSuccessDispatch: PIPELINE__LIST_LOADED,
        }}
      >
        {() => (
          <StyledOrderedList data-auto-id="pipelineList">
            {items && items.length ? (
              items.map((item) => (
                <ListItem key={item.id}>
                  <PipelineItem item={item} />
                </ListItem>
              ))
            ) : (
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
            )}
          </StyledOrderedList>
        )}
      </Task.Status>
    </>
  )
}

export default connect(state2props, dispatchToProps)(PipelineList)
