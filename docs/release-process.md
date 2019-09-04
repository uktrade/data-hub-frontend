## Beginners guide to the release process

1. Move to the `develop` branch - `git checkout develop`
2. Make sure you’ve got the latest updates - `git pull`
3. Create a branch for your release  - `git checkout -b release/v5.40.0` (change the version number to what you need it to be, this goes for all version numbers used as examples from here on out)
4. Use `npm version` to bump the version number in the package.json. You can do this manually, but this is easier - `npm version minor`
(For a major version bump, i.e. 5.39 => 6.0, use `npm version major`. There is also patch, prepatch, preminor, premajor, and prerelease)
5. `npm version` also creates a Git tag. A Git tag records a point in history and means the codebase, as it is at this point in time, doesn’t get deleted by Git’s garbage collection. In other words, we can easily roll back to this commit if you screw up later - so relax.
6. Push the branch up to GitHub - `git push origin release/v5.40.0`
7. Push the tag up to GitHub - `git push origin v5.40.0`
8. Go to the repo on [GitHub](www.github.com/uktrade/data-hub-frontend) and you should see a ‘New pull request’ button. Click it.
9. At the top of the screen you’ll see a compare box. Compare your branch to `master` to see what changes you’ll be merging. This not only shows you what has changed in comparison to `master`, but will actually merge it to `master` too, rather than `develop` as per normal PRs.
10. Write release notes based on what has changed. This should be understandable for humans who aren’t developers. The format is generally 3 sections - features, bugs, technical. Check a previous release for inspiration.
11. Click 'Create pull request'.
12. Once created you’ll need someone else to review the release pull request. So, add a reviewer on the right hand side of the page and/or ask for someone to look at it in the #data-hub-fed-dev slack channel
13. Once it’s approved and providing all the tests have passed, go ahead and merge your release.
14. Then click the 'Delete branch' button at the bottom of the screen.
15. Go to [releases](www.github.com/data-hub-frontend/releases) and click 'Draft a release'. Then follow the instructions to create a release from the tag.
16. Log into the VPN and head to Jenkins to check on your build. Jenkins should be building your release out onto the dev and staging environments (this happens after you merge your PR). Dev already has your changes and will just get the updated version number.
17. Once the staging build is done, go take a look at it on staging. You can check it is the right version by inspecting the head element and looking for your new version number.
18. Now ask the Data Hub Tech Lead to look over it for you and announce the release to staging on the #data-hub channel.
19. Once the Tech Lead gives you the green light we’ll push the build to the production environment. BUT, not before a little bit of house keeping...
20. Now we’re going to put our tag that is in `master` into the `develop` branch so we’re all nicely aligned. This also makes sure that future changes to `develop` can be merged into `master` because it stops the two branches from diverging.
21. So checkout `master` - `git checkout master`
22. Make sure it’s the latest and greatest - `git pull`
23. Move over to `develop` - `git checkout develop`
24. Get the latest there too (another developer might have created some new PRs while we were releasing) - `git pull`
25. Merge the tag in `master` into `develop` - `git merge master`
26. Now we need to push `develop` up to GitHub, but as the permissions are locked down you’ll need to get the Tech Lead or WebOps to run `git push origin develop` for you.
27. Now we’re ready to push the release to production. Go back to Jenkins and click build with parameters.
28. Select `production` for the environment.
29. Type `master` in the Git_Commit box.
30. And that should be it. Hang around to make sure it succeeds and there aren’t any unexpected hiccups.
31. One last thing. Delete the branch locally from your machine - `git branch -d release/v5.40.0`
