import React from 'react'
import { connect } from 'react-redux'

import ListItem from '@govuk-react/list-item'
import InsetText from '@govuk-react/inset-text'

import StyledOrderedList from '../StyledOrderedList'
import Task from '../Task'
import { state2props, ID as STATE_ID, TASK_GET_PIPELINE_LIST } from './state'
import { PIPELINE__LIST_LOADED } from '../../actions'
import PipelineItem from './PipelineItem'

const PipelineList = ({ status, statusText, items }) => {
  return (
    <Task.Status
      name={TASK_GET_PIPELINE_LIST}
      id={`${STATE_ID}_${status}`}
      progressMessage="loading pipelines items"
      noun="my pipelines"
      startOnRender={{
        payload: { status },
        onSuccessDispatch: PIPELINE__LIST_LOADED,
      }}
    >
      {() => (
        <StyledOrderedList data-auto-id="pipelineList">
          {items && items.length ? (
            items.map((item) => (
              <ListItem key={item.id}>
                <PipelineItem
                  id={item.id}
                  companyId={item.company.id}
                  companyName={item.company.name}
                  projectName={item.name}
                  date={item.created_on}
                />
              </ListItem>
            ))
          ) : (
            <InsetText>
              There are no companies in the {statusText} section of your
              pipeline. You can add companies to your pipeline from the company
              page.
            </InsetText>
          )}
        </StyledOrderedList>
      )}
    </Task.Status>
  )
}

export default connect(state2props)(PipelineList)
