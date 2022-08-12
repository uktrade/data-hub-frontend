# 2. Continue using NPM over Yarn

Date: 2022-08-12

## Status

Accepted

## Context

The reason we were considering using Yarn was because NPM initially had a bug with overrides, that took a long time to resolve, afterwards inflating problems with custom versions of NPM being needed, and the Cloud Foundry issues makeing NPM seem to be the cause for several underlying issues (which tunrned out to be a false positive.)

## Decision

After investingations with the legacy yarn versions and the new bery yarn version, the change seemed to be risky to implement, especially with the impact of all the changes that have been made with Berry. The changes include using its own core mechanism over npm inorder to initialise itself and the project being built. There are two branches as a POC,`feature/add-yarn@1.22.19` and `yarn@berry` that tested the concepts. I think in the end we can get it to work but the effort outweighs the benfit.

## Consequences

NPM will continue to serve our needs as most of the Cloud Foundry issues seem to be resolved as a consequence of resizing the disk.
