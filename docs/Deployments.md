# Deployments

Commits to `master` are automatically deployed to a staging environment.

Opening a pull request creates a temporary instance on Heroku called [review apps](https://devcenter.heroku.com/articles/github-integration-review-apps) which points to the staging environment.

Deployments to production are done manually through Jenkins where a Git tag can be used.

## Deploying to production

1. Create a GIT tag `git tag v<MAJOR>.<MINOR>.<PATCH>`, e.g. `v5.1.2` pointing to the latest `master`
   
    | Release type | When to increase |
    | ------------- | ------------- |
    | Major (**1**.0.0) | When a change requires modifications to the infrastructure, e.g. NodeJS version upgrade. |
    | Minor (0.**1**.0) | When a release contains at least one new feature. |
    | Patch (0.0.**1**) | When a release contains only fixes. | 

2. Push the tag to the remote - `git push origin v<VERSION_NUMBER>`

2. Go to Jenkins and click on 'Build with Parameters.

3. Select `production` for the environment.

4. Type your version number created in step `1` to the `Git_Commit` text field.

5. Press the `Build` button.
   
6. Create a GH release by clicking `Draft a new release` on the [releases page](https://github.com/uktrade/data-hub-frontend/releases).
   
   List of changes can be found using the tag-based comparison
   provided by GitHub, i.e. `github.com/uktrade/data-hub-frontend/compare/OLD_TAG…NEW_TAG`

   Example: https://github.com/uktrade/data-hub-frontend/compare/v5.62.1...v5.62.2
