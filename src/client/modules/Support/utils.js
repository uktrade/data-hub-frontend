export const createZenDeskMessage = ({
  titleField,
  feedbackType,
  feedbackField,
  emailField,
  browserField,
  zenVariables,
}) => {
  return {
    requester: {
      name: 'Data hub user',
      email: emailField,
    },
    subject: titleField,
    comment: {
      body: feedbackField,
    },
    custom_fields: [
      { id: zenVariables.browser, value: browserField },
      {
        id: zenVariables.service,
        value: zenVariables.serviceChannel,
      },
    ],
    tags: [feedbackType],
  }
}
