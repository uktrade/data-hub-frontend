const request = require('request')

let reactData = request(
  'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY',
  { json: true },
  (err, res, body) => {
    if (err) {
      return console.log(err)
    }
    return res
  }
)

async function renderReactSandbox (req, res, next) {
  try {
    res
      .title('React playground')
      .render('react-sandbox/container')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderReactSandbox,
  reactData,
}
