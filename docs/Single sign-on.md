# Single Sign-On

Data hub uses [uktrade/staff-sso](https://github.com/uktrade/staff-sso) for OAuth. Details of the required environment
variables needed to setup OAuth can be seen in the [Environment variables](#environment-variables) section.
For further information about how to setup OAuth:

- Look in confluence for details on setting up SSO for developers. Instructions can be found in
  `Data Hub team > Technical Documentation > Frontend > SSO for developers`.

# Bypassing OAuth in development mode

If you wish to completely bypass SSO functionality locally you can by setting the environment variable:

```
export OAUTH2_BYPASS_SSO=true
```

and providing a valid `OAUTH2_DEV_TOKEN` environment variable. This Access token needs to be valid for the SSO provider
the application is pointed at.

# Using SSO when developing

Developers can also test SSO functionality locally by removing the `OAUTH2_DEV_TOKEN` environment variable and making
sure that `OAUTH2_BYPASS_SSO` is set to false (it is by default). To use Oauth locally you will then need to set up the
correct access and SSO details for the SSO provider you are using.

## SSO development providers

### SSO mock

You could use the [uktrade/mock-sso](https://github.com/uktrade/mock-sso) repo.

If you are using docker-compose and the supplied `sample.env` file, the default
environment variables will suffice. Run through the instructions to [set up
mock-sso under docker-compose here](https://github.com/uktrade/mock-sso#docker-compose).

If you are running natively, you will need to set up the following environment variables:

```
export OAUTH2_DEV_TOKEN=exampleDevToken
export OAUTH2_TOKEN_FETCH_URL=http://localhost:8080/o/token
export OAUTH2_AUTH_URL=http://localhost:8080/o/authorize
```

data-hub-frontend will then use mock-sso to simply pass your `OAUTH2_DEV_TOKEN` between SSO and the application.

### UAT SSO

You could point data-hub-frontend to the UAT SSO environment. If you wish to please speak to the
[#technology-sso](https://ditdigitalteam.slack.com/messages/C5FLP2DSM/details/) team to set up the correct access and
SSO details required.

### HTTP Basic Auth

When running with `OAUTH2_BYPASS_SSO` the frontend can be user/password protected by setting `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD`

### Local checkout of staff SSO

You could checkout [uktrade/staff-sso](https://github.com/uktrade/staff-sso) locally and point data-hub-frontend
at that.
