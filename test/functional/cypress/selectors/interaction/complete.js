module.exports = {
  meetingHappen: {
    yes: '[for="field-meeting_happen-1"]',
    no: '[for="field-meeting_happen-2"]',
  },
  archivedReason: {
    clientCancelled: '[for="field-archived_reason-1"]',
    ditCancelled: '[for="field-archived_reason-2"]',
    rescheduled: '[for="field-archived_reason-3"]',
  },
  rescheduledDate: '#group-field-date',
  actions: {
    continue: '.button',
    back: ({ companyId, interactionId }) => `[href="/companies/${companyId}/interactions/${interactionId}"]`,
  },
}
