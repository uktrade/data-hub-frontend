# Email notifications
We need to change some of the React Router routes to accommodate the upcoming work on
company exports. We don't want to break the links within the emails that have already been sent
to subscribed users - the workaround is to redirect all requests coming from those emails.
Going forward, all users will receive notification emails with the new links. 

**In six months time (May 2023) we will delete this entire directory (removing the redirects) as it's purely for short term backwards compatibility.**

All redirects:

    From : /reminders/estimated-land-date
    To :   /reminders/investments-estimated-land-dates

    From : /reminders/no-recent-interaction
    To :   /reminders/investments-no-recent-interactions

    From : /reminders/outstanding-propositions
    To :   /reminders/investments-outstanding-propositions

    From : /reminders/settings/estimated-land-date
    To :   /reminders/settings/investments-estimated-land-dates

    From : /reminders/settings/no-recent-interaction
    To :   /reminders/settings/investments-no-recent-interactions
