const renderOrdersView = async (req, res, next) => {
  try {
    const props = {
      title: 'Orders',
      heading: 'Orders',
    }

    return res.render('omis/apps/view/views/orders', { props })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderOrdersView,
}
