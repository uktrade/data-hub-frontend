import { PIPELINE__FILTER_ARCHIVE_CHANGED } from '../../actions'

export const ID = 'pipelineList'
export const TASK_GET_PIPELINE_LIST = 'TASK_GET_PIPELINE_LIST'

export const state2props = (state) => state[ID]

const updateArchiveFilter = (includeArchive) => ({
  type: PIPELINE__FILTER_ARCHIVE_CHANGED,
  result: { includeArchive },
})

export const dispatchToProps = {
  updateArchiveFilter,
}
