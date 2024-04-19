export const WIN_STATUS = {
  REJECTED: false,
  PENDING: null,
  WON: true,
}

export const WIN_STATUS_MAP_TO_LABEL = {
  [WIN_STATUS.REJECTED]: 'Rejected',
  [WIN_STATUS.PENDING]: 'Pending',
  [WIN_STATUS.WON]: 'Won',
}
