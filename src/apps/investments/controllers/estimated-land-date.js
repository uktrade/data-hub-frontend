const renderView = (req, res, next) => {
  try {
    res.render('investments/views/estimated-land-date', {
      props: {
        investment: res.locals.investment,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderView,
}
