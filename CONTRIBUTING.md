# Contribution guidelines

## Git workflow

- Pull requests must contain a succinct, clear summary of the change is and
  why it is being made
- Follow the [GDS Git styleguide](https://github.com/alphagov/styleguides/blob/master/git.md)
- Make a feature branch following the [Git Flow](https://datasift.github.io/gitflow/IntroducingGitFlow.html)
  naming convention. For example `feature/my-new-feature`.
- Ensure your branch contains logical atomic commits before sending a pull request
- Pull requests are automatically tested, where applicable using [CircleCI](https://circleci.com/),
  which will report back on whether the tests still pass on your branch
- Pull requests deploy a heroku [review app](https://devcenter.heroku.com/articles/github-integration-review-apps)
  with those changes. Details of the review app will be reported in the pull request.
- You _may_ rebase your branch after feedback if it's to include relevant
  updates from the master branch. We prefer a rebase here to a merge commit
  as we prefer a clean and straight history on master with discrete merge
  commits for features
- Features are merged onto the `develop` branch
- Releases are created from `develop` and are merged into `master`

## Code

- Must be readable with meaningful naming, eg no short hand single character variable names
- See [GDS styleguides](https://github.com/alphagov/styleguides) for examples

## Testing

Write tests.

## Versioning

We use [Semantic Versioning](http://semver.org/), and bump the version on
master only. Please don't submit your own proposed version numbers.
