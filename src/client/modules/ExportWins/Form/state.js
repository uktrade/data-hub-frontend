import { getQueryParamsFromLocation } from '../../../../client/utils/url'

export const TASK_GET_EXPORT_WINS_SAVE_FORM = 'TASK_GET_EXPORT_WINS_SAVE_FORM'
export const ID = 'exportWinForm'

export const TASK_GET_EXPORT_PROJECT = 'TASK_GET_EXPORT_PROJECT'
export const EXPORT_PROJECT_ID = 'exportProject'

export const TASK_GET_EXPORT_WIN = 'TASK_GET_EXPORT_WIN'
export const EXPORT_WIN_ID = 'exportWin'

export const getFormValuesFromSessionStorage = (item) => {
  try {
    return JSON.parse(window.sessionStorage.getItem(item)) || null
  } catch {
    return null
  }
}

const getContactFromLocation = (location) => {
  const queryParams = getQueryParamsFromLocation(location)
  const label = queryParams['new-contact-name']
  const value = queryParams['new-contact-id']
  return label && value ? { value, label } : null
}

export const state2props = ({ router, ...state }) => {
  const queryParams = getQueryParamsFromLocation(router.location)

  // If the contact is defined then the user has added a new
  // company contact as part of the add export win user journey.
  const contact = getContactFromLocation(router.location)

  // There's a bug in the form that doesn't maintain form values when being
  // redirected back to the form after adding a company contact. The
  // form resets its values, meaning the user has to input all the form
  // fields a second time, the user's frustrastion is compounded when
  // the form is over multiple steps. For example, if the user completes
  // steps 1 and 2 and then adds a new contact on step 3 the form values
  // from the previous 2 steps will have been lost. As a workaround the form
  // state is written to window.sessionStorage and read here. The form values object
  // is then passed to the CustomerDetailsStep (this is where you add a new contact)
  // where the form's state is updated by calling setFieldValue on each of the
  // missing form values. There is also a separate larger piece of work that's
  // ongoing that will fix this issue throughout Data Hub, not just here.
  const sessionStorageFormValues = getFormValuesFromSessionStorage(ID)

  return {
    csrfToken: state.csrfToken,
    currentAdviserId: state.currentAdviserId,
    isEditing: queryParams.exportwin !== undefined,
    contact,
    sessionStorageFormValues,
  }
}
