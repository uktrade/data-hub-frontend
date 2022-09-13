# 2. Continue using NPM over Yarn

Date: 2022-08-12

## Status

Accepted

## Context

The reason we were considering using Yarn was because NPM initially had a bug with [overrides](https://github.com/npm/cli/issues/4232), that took a long time to resolve within *NPM*, and then *Dependabot* and *Jenkins* internal build packs. 

Afterwards inflating problems with custom versions of the NPM CLI where needed, and the Cloud Foundry issues making NPM seem to be the cause for several underlying issues, which in the end tunrned out to be a false positive.

## Decision

After investigations with the legacy yarn versions and the new Berry yarn version, the change seemed to be risky to implement, especially with the impact of all the changes that have been made with Berry. 

The changes include using its own core mechanism over NPM in order to initialise itself and the project being built. There are two branches as a POC,`feature/add-yarn@1.22.19` and `yarn@berry` that tested the concepts, and if these branches are deleted in the future, search Jira for more information by yarn or the yarn branches mentioned. I am adamant we can get this to work but the effort outweighs the benfit.

## Consequences

NPM will continue to serve our needs as most of the Cloud Foundry issues seem to be resolved as a consequence of resizing the disk.
