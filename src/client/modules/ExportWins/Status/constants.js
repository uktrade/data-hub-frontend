export const WIN_STATUS = {
  REJECTED: false,
  SENT: null,
  WON: true,
}

export const WIN_STATUS_MAP_TO_LABEL = {
  [WIN_STATUS.REJECTED]: 'Rejected',
  [WIN_STATUS.SENT]: 'Sent',
  [WIN_STATUS.WON]: 'Won',
}
