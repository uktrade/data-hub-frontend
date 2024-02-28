const OPTION_ME = 'me'
const OPTION_SOMEONE_ELSE = 'someoneElse'

export const OPTIONS = {
  ME: OPTION_ME,
  SOMEONE_ELSE: OPTION_SOMEONE_ELSE,
  ASSIGNED_TO: [
    { label: 'Me', value: OPTION_ME },
    { label: 'Someone else', value: OPTION_SOMEONE_ELSE },
  ],
}

const STATUS_ACTIVE = 'active'
const STATUS_COMPLETED = 'complete'
export const STATUS = {
  ACTIVE: STATUS_ACTIVE,
  COMPLETED: STATUS_COMPLETED,
}
