export const WIN_STATUS = {
  PENDING: null,
  CONFIRMED: true,
  REJECTED: false,
}

export const WIN_STATUS_MAP_TO_LABEL = {
  [WIN_STATUS.PENDING]: 'Pending',
  [WIN_STATUS.CONFIRMED]: 'Confirmed',
  [WIN_STATUS.REJECTED]: 'Rejected',
}
