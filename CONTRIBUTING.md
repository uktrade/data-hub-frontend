# Contribution guidelines

## Git workflow

When working on a new feature the convention is to follow
[Git Flow](https://datasift.github.io/gitflow/IntroducingGitFlow.html).

Ongoing work is kept in the `develop` branch, each time a new thing is worked
on a feature branch needs to be created below 'feature' and merged back into
develop.

Once features are tested and agreed they are released feature by feature or
sometimes as a collection of features by merging to master.

Once you are happy the feature is ready then make sure the code has been
linted and tests have been run. Make sure your commits don't contain extraneous
entries (such as wip or fixups) using rebase interactive and create a pull request.

The pull request title should briefly say what the change is, and the description
should describe how you did the change and why you chose to do it the way you did.

Once a pull request is made it will be tested using [CircleCI](https://circleci.com/)
and, if successful, deployed to a heroku instance. Links to the Circle build
and deployed address will be shown in the github pull request.
