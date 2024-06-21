# Local troubleshooting

This document was created to provide solutions to common issues that occur when running the frontend locally. The issues are categorised by the method used to bring up the application.

When updating this document please use the following template:

```
### Issue title
[brief description of issue]

Screenshot:

![image-title](./Troubleshooting/[image-name].png 'Textual representation of the error for it to be picked up in a search')

**Solution** If there is a single permanent fix for this issue enter it here.

**Short-term fix** If there is a temporary workaround or some of 'sticky-tape' solution enter it here.

**Long-term fix** If there is a permanent fix for the issue (or if one is being worked on) enter it here.
```

## Docker issues

This section should include issues that occur when running the frontend in Docker.

## Native issues

This section should be used for native issues that occur regardless of what API you are using.

### Missing environment variable

This error appears if one or more of the required environment variables is missing or has no value set. The error message will tell you which variables need to be changed.

![missing-env-var](./Troubleshooting/native-generic-missing-envvar.png '
COMPANY_MATCHING_SERVICE_BASE_URL": "http://mock-third-party-services:8888\*
"COMPANY_MATCHING_HAWK_ID": "dummyId",
"COMPANY_MATCHING_HAWK_KEY": "dummyKey",
"OAUTH2_BYPASS_SSO": "true",
"OAUTH2_LOGOUT_URL": "http://anyurl/o/logout",
"OAUTH2_AUTH_URL": "http://anyurl/o/authorize",
"OAUTH2_DEV_TOKEN" [1]: -- missing
}

[1] "OAUTH2_DEV_TOKEN" is required
ValidationError: {
"TERM_PROGRAM": "vscode",
"NODE": "/Users/christophersunkel/.nvm/versions/node/v16.15.1/bin/node",
"INIT_CWD": "/Users/christophersunkel/Documents/datahub/data-hub-frontend", "NVM_CD_FLAGS": "-q",
"TERM": "xterm-256color",
"SHELL":"/bin/zsh",
"npm_config_metrics_registry": "https://registry.npmjs.org/",
"TMPDIR": "/var/folders/wh/6db7nz9j6xg7wbc5r25lzc9r0000gn/T/",')

**Solution** Assign a value to the missing variable.

### Unsupported engine error

This error occurs when your local Node version is incorrect.

![wrong-node-version](./Troubleshooting/native-generic-nodeversion.png '
npm ERR! code EBADENGINE
npm ERR! engine Unsupported engine
npm ERR! engine Not compatible with your version of node/npm: undefined 
npm ERR! notsup Not compatible with your version of node/npm: undefined 
npm ERR! notsup Required: {"node":"16.15.1"}
npm ERR! notsup Actual: {"npm":"8.11.0", "node": "v14.17.0"}')

**Short-term fix** Run the command `nvm use [required version]` (you may need to run `nvm install [version]` first).

**Long-term fix** Set your default NVM alias to the required version.

### Running natively against a local API instance

#### Error connecting to Redis

This error usually appears if there is a mismatch between your local API and frontend env files, or if one of your env files has incorrect/outdated environment variables set.

![error-connecting-to-redis](./Troubleshooting/native-generic-redis.png '
error: Error connecting to redis 
   at GetAddrInfoReqWrap.onlookup [as oncomplete] (node: dns:71:26) 
error: Error connecting to redis error: 
error {"code":"ENOTFOUND", "errno":-3008, "hostname":"redis","syscall":"getaddrinfo"} 
error: Error: getaddrinfo ENOTFOUND redis 
   at GetAddrInfoReqWrap.onlookup [as oncomplete] (node: dns:71:26) 
[nodemon] app crashed - waiting for file changes before starting...')

**Solution** Ensure that any shared environment variables are correct and are set to the same value in both projects.

#### Error fetching metadataRepository

This error occurs when the frontend can't connect to your local API instance.

![metadata-error](./Troubleshooting/native-local-metadata.png '
error: Error fetching metadataRepository for url: http://api:8000/v4/metadata/investment-strategic-driver 
error: Error fetching metadataRepository for url: http://api:8000/v4/metadata/order-service-type 
error: Error fetching metadataRepository for url: http://api:8000/v4/metadata/investment-project-stage 
error: Error fetching metadataRepository for url: http://api:8000/v4/metadata/omis-market 
error: Error fetching metadataRepository for url: http://api:8000/v4/metadata/order-cancellation-reason 
error: Error fetching metadataRepository for url: http://api:8000/v4/metadata/investment-specific-programme 
error: Error fetching metadataRepository for url: http://api:8000/v4/metadata/fdi-value 
error: Error fetching metadataRepository for url: http://api:8000/v4/metadata/investment-involvement 
error: Error fetching metadataRepository for url: http://api:8000/v4/metadata/investment-investor-type 
error: Error fetching metadataRepository for url: http://api:8000/v4/metadata/likelihood-to-land
error: Error fetching metadataRepository for url: http://api:8000/v4/metadata/export-experience-category 
error: Error fetching metadataRepository for url: http://api:8000/v4/metadata/trade-agreement 
error: Unable to load all metadataRepository, cannot start app
error: uncaughtException: Error: getaddrinfo ENOTFOUND api
Error: Error: getaddrinfo ENOTFOUND api')

**Solution** Ensure that your `API_ROOT` variable has been set correctly. The local API will use `http://localhost:8000`.

This error can occur when the connection to a Native installation (withouth Docker) of the Data Hub API is refused.

![native-api-econnrefused](./Troubleshooting/native-api-econnrefused.png '
error: Error fetching metadataRepository for url: http://localhost:8000/v4/metadata/investment-investor-type
error: Error fetching metadataRepository for url: http://localhost:8000/v4/metadata/export-experience-category
error: Error fetching metadataRepository for url: http://localhost:8000/v4/metadata/investment-involvement
error: Error fetching metadataRepository for url: http://localhost:8000/v4/metadata/likelihood-to-land
error: Error fetching metadataRepository for url: http://localhost:8000/v4/metadata/trade-agreement
error: Error fetching metadataRepository for url: http://localhost:8000/v4/metadata/export-years
error: Error fetching metadataRepository for url: http://localhost:8000/v4/metadata/export-experience
info: All metadataRepository requests complete
error: Unable to load all metadataRepository, cannot start app
error: uncaughtException: Error: connect ECONNREFUSED ::1:8000
Error: Error: connect ECONNREFUSED ::1:8000
at Request._callback (/Users/marijnkampf/Projects/data-hub-frontend/src/lib/hawk-request.js:35:23)
at self.callback (/Users/marijnkampf/Projects/data-hub-frontend/node_modules/request/request.js:185:22)
at Request.emit (node:events:513:28)
at Request.emit (node:domain:489:12)
at Request.onRequestError (/Users/marijnkampf/Projects/data-hub-frontend/node_modules/request/request.js:877:8)
at ClientRequest.emit (node:events:513:28)
at ClientRequest.emit (node:domain:489:12)
at Socket.socketErrorListener (node:_http_client:481:9)
at Socket.emit (node:events:513:28)
at Socket.emit (node:domain:489:12)
at emitErrorNT (node:internal/streams/destroy:151:8)
at emitErrorCloseNT (node:internal/streams/destroy:116:3)
at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {"date":"Thu Apr 13 2023 12:14:32 GMT+0100 (British Summer Time)","error":{},"exception":true,"os":{"loadavg":[4.88623046875,4.021484375,5.20703125],"uptime":15060},"process":{"argv":["/Users/marijnkampf/.nvm/versio')

**Solution** When connecting to native/local Data Hub API ensure that

- in the **API's .env** file the `LOCAL_DEV=True` is set to `True` and
- in the **Front End's .env** file the `API_ROOT=http://127.0.0.1:8000` uses `127.0.0.1` rather than `localhost`.

### Running natively against a live environment (dev/staging)

#### Error connecting to Redis

When running against a live environment, this error usually occurs if you run `npm run develop` without a local Redis instance running, or if you have incorrect environment variables.

![redis-error](./Troubleshooting/native-live-redis.png '
[HPM] Proxy created: / -> https://datahub-api-dev.london.cloudapps.digital 
[HPM] Proxy rewrite rule created: "^/api-proxy" ~> error: Error connecting to redis
error: error {"code":"ENOTFOUND","errno":-3008, "hostname":"redis","syscall":"getaddrinfo"} 
error: Error: getaddrinfo ENOTFOUND redis
at GetAddrInfoReqWrap.onlookup [as oncomplete] (node: dns:71:26)
error: Error connecting to redis
error: error {"code":"ENOTFOUND", "errno":-3008, "hostname":"redis","syscall":"getaddrinfo"} 
error: Error: getaddrinfo ENOTFOUND redis
at GetAddrInfoReqWrap.onlookup [as oncomplete] (node: dns:71:26)
error: Error connecting to redis
error: error {"code":"ENOTFOUND","errno":-3008, "hostname":"redis","syscall":"getaddrinfo"} 
error: Error: getaddrinfo ENOTFOUND redis
at GetAddrInfoReqWrap.onlookup [as oncomplete] (node: dns:71:26)
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/fdi-type 
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/administrative-area 
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/likelihood-to-land 
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/fdi-value 
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/referral-source-activity 
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/referral-source-marketing 
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/investment-project-stage 
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/investment-type 
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/investment-business-activity 
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/salary-range 
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/investment-strategic-driver 
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/evidence-tag 
error: Error fetching metadataRepository for url: https://datahub-api-dev.london.cloudapps.digital/v4/metadata/business-type
')

**Solution** Close your frontend instance, then start a new native redis instance (follow the [redis setup instructions](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Installing%20redis%20natively.md) if you have not done this before).

Once this is running, you should update the following environment variables:

- `REDIS_HOST` should be set to `localhost`
- `REDIS_URL` should be set to `redis://localhost:6379`
- `DATA_HUB_BACKEND_ACCESS_KEY_ID` and `DATA_HUB_BACKEND_SECRET_ACCESS_KEY` should be set to the values from Vault (if working with the investment homepage, you will need to do the same for all variables with the prefix `HELP_CENTRE` or the page will not load).

Once this is done, the app should start after running `npm run develop`.

#### Invalid authentication details

This error occurs when your `OAUTH2_DEV_TOKEN` is out of date or hasn't been set correctly.

![redis-error](./Troubleshooting/native-live-invalid-token.png '
error: Unable to fetch feature flags: Error: 401 - {"detail": "Invalid authentication credentials."} 
error: uncaughtException: 401 - {"detail": "Invalid authentication credentials."}
Error: 401 - {"detail": "Invalid authentication credentials."}
at request (/Users/christophersunkel/Documents/datahub/data-hub-frontend/src/lib/request.js:49:13)
at processTicksAndReiections (node:internal/process/task queues:96:5)
at async authorisedRequest (/Users/christophersunkel/Documents/datahub/data-hub-frontend/src/lib/authorised-request.js:68:22) 
at async/Users/christophersunkel/Documents/datahub/data-hub-frontend/src/middleware/user-features.is:25:18 {"date": "Mon Jun 20
')

**Solution** Bring down your frontend and remove the current value for `OAUTH2_DEV_TOKEN`. Generate a new access token by navigating to the relevant `/add-access-token/` page (for convenience you can set this to last for up to 168 hours), then set the value of `OAUTH2_DEV_TOKEN` to the newly-generated token. The frontend should now work after running `npm run develop`.

#### 'System down' page appears

This error occurs when your local redis server is brought down whilst the app is still running.

![system-down](./Troubleshooting/native-live-redis-down.png 'System down Part of the system is down, please try again shortly. The team has been notified.')

**Solution** Bring down your local frontend, restart your redis instance and run `npm run develop`. The frontend should then work as expected.

#### Unexpected token < in JSON at position 0

This error is caused when you try to connect to a live environment without turning the VPN on.

![vpn-error](./Troubleshooting/native-live-vpn.png '
error: uncaughtException: Unexpected token < in JSON at position 0
SyntaxError: Unexpected token < in JSON at position 0
at JSON. parse (<anonymous>)
at Request. _callback (/Users/christophersunkel/Documents/datahub/data-hub-frontend/src/lib/hawk-request.js:55:25)
at Request. self.callback (/Users/christophersunkel/Documents/datahub/data-hub-frontend/node_modules/request/request.js:185:22)
at Request.emit (node:events:527:28) at Request.emit (node: domain: 475:12)
at Request.<anonymous> (/Users/christophersunkel/Documents/datahub/data-hub-frontend/node_modules/request/request.js:1154:10)
at Request.emit (node: events: 527:28) at Request.emit (node: domain:475:12)
at IncomingMessage, <anonymous> (/Users/christophersunkel/Documents/datahub/data-hub-frontend/node_modules/request/request. js: 1076:12) 
at Object.oncewrapper (node: events:641:28) at IncomingMessage.emit (node: events: 539:35) at IncomingMessage.emit (node: domain:475:12) 
at endReadableNT (node: internal/streams/readable: 1345:12)
at processTicksAndRejections (node: internal/process/task queues: 83:21) {"date" "Mon Jun 20 2022 10-34:32 GMT+9190 (Britich Summer Time')

**Solution** Bring down your local frontend, enable the VPN and then run `npm run develop` again. The frontend should now work correctly.

## Test Issues

This section is for issues when running tests locally in accordance with the [running tests](./Running%20tests.md) documentation.

### Building dependency images

When building a new dependency image on Macs with Apple chips, you may come across errors with Cypress or the test runners failing to start:

**Solution**: ensure you have checked the following and then re-build/re-run the containers/`make` commands.

- Have Rosetta 2 installed on your Mac (see [Apple's support page](https://support.apple.com/en-gb/HT211861) for more information on this)
- Have the latest version of Docker Desktop installed
- Have enabled the `Use Rosetta for x86/amd64 emulation on Apple Silicon` setting under the general tab in Docker Desktop
