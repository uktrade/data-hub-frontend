const reporter = require('cucumber-html-reporter')

var options = {
  theme: 'bootstrap',
  jsonDir: 'cucumber/reports',
  output: 'cucumber/report.html',
  reportSuiteAsScenarios: true,
  launchReport: false,
  ignoreBadJsonFile: true,
}

reporter.generate(options)
process.exit(0)
