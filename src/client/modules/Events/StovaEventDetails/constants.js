const getExternalStovaLink = (stovaReference) => {
  return `https://eu-admin.eventscloud.com/loggedin/eVent/index.php?eventid=${stovaReference}`
}

module.exports = {
  getExternalStovaLink,
}
