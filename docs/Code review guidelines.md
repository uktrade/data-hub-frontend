# Code Review guidelines

_Discussed and agreed by all Data Hub developers. If anything changes, please keep this document up-to-date and in sync with the related backend/frontend one._

# Table of Contents

- [Step 1: Before and when submitting a PR](#step-1)
- [Step 2: PR submitted](#step-2)
- [Step 3: PR approved](#step-3)

## <a name="step-1"></a>Step 1: Before and when submitting a PR

#### Code and tests

- Make sure your code is appropriately documented and includes change log fragments describing the change
- Keep the overall coding style consistent with the rest of the repository unless it's been identified as a particular style that we want to move away from. Avoid using your own style as this can cause disagreements among developers. When adopting a new agreed style (ideally) refactor the existing code to keep the overall codebase consistent
- Follow Uncle Bob's boy-scout rule: “always leave the code behind in a better state than you found it”
- Include unit, functional, e2e and compatibility tests (when applicable)
- Make sure CI build passes consistently without any flaky tests

#### Commit Hygiene

- Follow branch naming conventions by prefixing your branch name with _feature/_, _bugfix/_, _removal/_, _test/_, _hotfix/_ or _release/_
- Make sure commits are logical and atomic - each commit should include tests
- Keep each commit small and deployable - each commit should ideally leave the master branch in a releasable state
- Use [imperative mood](https://git.kernel.org/pub/scm/git/git.git/tree/Documentation/SubmittingPatches?id=HEAD#n133) in commit message but it's okay to use past tense in the description

#### PR Hygiene

- Make sure your PR is atomic and doesn't solve multiple problems at the same time
- Keep your PR small and deployable - each PR **must** leave the master branch in a releasable state
- PRs shouldn't normally add or change more than [400 lines of code](https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/) at the time
- Use feature flags if your PR cannot be deployed to production at any time after being merged
- Alternatively hide a new piece of functionality behind an express.js route being careful not to expose the URL
- Use GitHub labels if your PR is blocked or depends on another
- Use [a GitHub draft PR](https://github.blog/2019-02-14-introducing-draft-pull-requests/) for WIP or if you want initial feedback

#### Description

- Document what the PR does and why the change is needed
- Give full context - not everyone has access to Jira/Trello
- Detail anything that is out of scope and will be covered by future PRs
- Include details on the lifecycle of the feature and its nature. Is it a new feature or a change to an existing one? Is the code going to be short-lived? Is it part of a bigger piece of work?
- Highlight possible controversies
- Include instructions on how to test (e.g. what should I see?)
- Detail any considerations when releasing

#### Screenshots

- Add before / after screenshots or GIFs
- Include screenshots of both mobile and desktop versions

## <a name="step-2"></a>Step 2: PR submitted

### For both authors and reviewers:

#### <a name="attitude"></a>Attitude

- Remember that you are starting a conversation
- Don't take feedback personally
- Be honest, but don't be rude

#### GitHub

- Non-trivial questions and issues are best discussed via Slack or face-to-face
- The same applies to PRs with large number of comments
- At the end of a conversation, update GitHub with a summary

### If you are the author:

- Make sure you read and follow the guidelines in [Step 1: before and when submitting a PR](#step-1)
- Don't `rebase` or `push --force` whilst the PR is being reviewed otherwise reviewers won't be able to see what's changed
- Don't dismiss change requests except in rare circumstances (e.g. when the reviewer is on holiday), document the reason
- Mark commits that will be squashed into other commits with the _fixup:_ prefix. This helps reviewers understand how you are planning to organise your PR after approval
- Respond to comments if you don't agree with them
- If you decide not to implement the suggestion, come to a mutual understanding with the reviewer

### If you are a reviewer:

#### Time

- Allocate 30 minutes in the morning and 30 minutes in the afternoon for reviewing PRs
- If there are multiple PRs, the preferred method for selection is FIFO (first in first out). However, this could result in fewer PRs being reviewed by multiple developers, so use common sense
- Whenever possible, review a PR in one go so that the author understands the amount of work needed and can plan with his/her team
- Aim to spend no longer than twenty or thirty minutes per Pull Request. For sure we are looking for a reviewer to
  immerse themselves in the sense of the Pull Request but it's not always necessary to check out the branch and test it
  yourself
- The purpose of the code review is to ascertain whether or not the Pull Request is _good enough_. Not perfect but
  good enough. Think of it like "proof-reading" a written document. Of course PRs are an opportunity to share knowledge
  and technique, but if any of your comments fall into this category, please mark them as "Optional" in the comment
  body - see section [Levels of Importance](#levels-of-importance) below.

#### Attack window

Bear in mind that when receiving feedback as an author of a PR, it's easy to feel overwhelmed in the face of a high
volume of feedback. This is especially true if you receive a bunch of comments from several peers, then a little later
on one of those reviewers adds some more points. It can feel like there's no end to it.

So for these reasons you ought to observe the following rules when reviewing a PR:

- Use the GitHub "start a review" feature when commenting. Don't just write "single comments" - bundle all your
  comments up into one batch which is shared with the author only when you finally submit your review as "Comment,
  Approve or Reject". This means that the author of the review can be safe in the knowledge that your input has
  concluded and that they have a complete picture of your thoughts on the PR.

- You only get one shot at a review. You should see your involvement as a single, one-off interaction with that
  request. Once you've submitted it your only future involvement in the PR should be to respond to / resolve
  points that you're already raised. _If you think of something **incredibly important** after you've submitted
  your review then you need to contact the author directly and pick this point up with them as a personal conversation._

#### Architectural feedback

- A Pull Request is not the forum for architectural review. Once work is at such a level of maturity that it
  exists in a PR, all the architectural considerations should have been handled already. If work contains
  anything particularly unusual in terms of its approach, that should have been discussed at one of the fortnightly
  Developer Huddles, well in advance of starting work on the actual code.

#### Language

- Offer suggestions - “It might be easier to...”, “Consider...”
- Be objective - “this method is missing a docstring” instead of “you forgot to write a docstring”

#### Being diplomatic

- Feel free to constructively challenge approaches and solutions, even when coming from a seasoned developer
- It's OK to nit-pick on syntax issues, spelling errors, poor variable/function names, missing corner cases
- But don't be a perfectionist - allow some flexibility

#### Levels of importance

- Prefix non-critical comments with _Optional:_ so that the author knows what is important and what is not
- If all your comments are non-critical, leave your feedback but accept the PR at the same time so that you are not a blocker and you keep [a positive attitude](#attitude)

## <a name="step-3"></a>Step 3: PR approved

- `rebase master` before merging to keep the history clean
- Squash the fixup commits into their related ones
