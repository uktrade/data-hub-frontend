const renderEssDetails = async (req, res, next) => {
  try {
    const { user } = req.session
    const currentAdviserId = user.id

    const props = {
      title: 'ESS Interaction',
      heading: 'ESS Interaction',
      currentAdviserId,
    }
    return res.render('interactions/views/essDetails', { props })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEssDetails,
}
