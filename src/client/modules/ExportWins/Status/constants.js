export const WIN_STATUS = {
  REJECTED: false,
  PENDING: null,
  CONFIRMED: true,
}

export const WIN_STATUS_MAP_TO_LABEL = {
  [WIN_STATUS.REJECTED]: 'Rejected',
  [WIN_STATUS.PENDING]: 'Pending',
  [WIN_STATUS.CONFIRMED]: 'Confirmed',
}
