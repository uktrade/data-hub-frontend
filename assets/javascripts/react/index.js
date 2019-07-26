
document.addEventListener('DOMContentLoaded', () => {
  const nodes = Array.from(document.querySelectorAll('[id^="react-mount-"]'))
  const $ = document.querySelector.bind(document)

  if (nodes.length) {
    if ($('#react-mount-sandbox')) {
      require('../../../src/apps/react-sandbox/Sandbox.jsx')
    }
  }
})
