Error recevied:
```
[vite:build-import-analysis] Parse error @:50:78
file: /home/chopkins/projects/dit/data-hub-frontend/src/client/modules/Interactions/InteractionDetails/transformers.js:50:77
```

Resolution:
Only use React inside of jsx file, so renamed the file from .js to .jsx


Error Received:
```
error during build:
RollupError: "format" is not exported by "src/client/utils/date.js", imported by "src/client/components/ActivityFeed/activities/DirectoryFormsApi.jsx"
```

Possible Resolution
- migrate the entire app from CommonJS to ES Modules (Huge piece of work)
- Try make use of the common js optimize config inside vite
