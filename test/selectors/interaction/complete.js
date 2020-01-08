module.exports = {
  meetingHappen: {
    yes: '[for="field-meeting_happen-1"]',
    no: '[for="field-meeting_happen-2"]',
    error: '#group-field-meeting_happen .c-form-group__error-message',
  },
  archivedReason: {
    clientCancelled: '[for="field-archived_reason-1"]',
    ditCancelled: '[for="field-archived_reason-2"]',
    rescheduled: '[for="field-archived_reason-3"]',
    error: '#group-field-archived_reason .c-form-group__error-message',
  },
  rescheduledDate: {
    field: '#field-date',
    error: '#group-field-date .c-form-group__error-message',
  },
  actions: {
    continue: '.govuk-button',
    back: ({ companyId, interactionId }) =>
      `[href="/companies/${companyId}/interactions/${interactionId}"]`,
  },
}
