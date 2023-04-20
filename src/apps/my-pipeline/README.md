# Redirects
As part of rolling out the new export pipeline we need to redirect two URL paths from the old implementation incase users have these bookmarked:

**In six months time (October 2023) we will delete the entire my-pipeline directory, therefore, removing both redirects**

All redirects:

    Dashboard:
    From: /my-pipeline
    To:   /export

    Add an export:
    From: /companies/<company-id>/my-pipeline
    To:   /export/create?companyId=<company-id>
