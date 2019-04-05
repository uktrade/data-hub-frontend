async function renderSelect (req, res) {
  const { company } = res.locals

  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Select the match')
    .render('companies/apps/matching/views/select', {
      heading: `Select the match for ${company.name}`,
    })
}

module.exports = {
  renderSelect,
}
