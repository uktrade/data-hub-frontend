import { PIPELINE__LIST_FILTER_SORT_CHANGED } from '../../actions'

export const ID = 'pipelineList'
export const TASK_GET_PIPELINE_LIST = 'TASK_GET_PIPELINE_LIST'

export const state2props = (state) => state[ID]

const updateArchiveFilter = (includeArchive) => ({
  type: PIPELINE__LIST_FILTER_SORT_CHANGED,
  result: { includeArchive },
})

const updateSort = (sortBy) => ({
  type: PIPELINE__LIST_FILTER_SORT_CHANGED,
  result: { sortBy },
})

export const dispatchToProps = {
  updateArchiveFilter,
  updateSort,
}
