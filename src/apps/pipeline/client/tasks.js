export function checkIfOnPipeline({ companyId }) {
  // TODO: when the backend is completed this function will check if the company is already on the pipeline and will set a boolean, isOnPipeline, in the state. This will determine whether to show the add to pipeline form or a helpful message pointing out the user has already done that. For now, only Lambda plc will return true.
  return companyId === '0fb3379c-341c-4da4-b825-bf8d47b26baa' ? true : false
}
