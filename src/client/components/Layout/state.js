export const state2props = (state) => ({
  userPermissions: state.userPermissions,
  activeFeatures: state.activeFeatures, //TODO - remove this when feature is live for all users
})
