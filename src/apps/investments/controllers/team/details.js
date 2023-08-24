function getDetailsHandler(req, res) {
  return res
    .breadcrumb('Project team')
    .render('investments/views/team/details', {
      props: {
        projectId: res.locals.investment.id,
      },
    })
}

module.exports = {
  getDetailsHandler,
}
