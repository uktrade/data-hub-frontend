function detailsGetHandler(req, res) {
  return res.render('investments/views/details', {
    props: {
      projectId: res.locals.investment.id,
    },
  })
}

module.exports = {
  detailsGetHandler,
}
