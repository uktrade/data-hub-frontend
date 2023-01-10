## Inital steps:

- Chat with sam about the irap projects usage of vite, difference in approach as irap was using vite from scratch but datahub is an existing project with a combination of 3 technologies in the middle of a code migration from node + nunjucks + react into just react. Found some similarites where both repo's were using a backend to serve the compiled assets, there was also some middleware code inside datahub that did a check for a resource and if it was part of a webpack manifest.
- Used the getting started guidance on the vite website, installed vite and started with the `build` command to try and produce some compiled assets. Below are some of the errors I came across and how they were fixes

## Errors

### Error Received:
```
[vite:build-import-analysis] Parse error @:50:78
file: /home/chopkins/projects/dit/data-hub-frontend/src/client/modules/Interactions/InteractionDetails/transformers.js:50:77
```

### Resolution:
Only use React inside of jsx file, so renamed the file from .js to .jsx


### Error Received:
```
error during build:
RollupError: "format" is not exported by "src/client/utils/date.js", imported by "src/client/components/ActivityFeed/activities/DirectoryFormsApi.jsx"
```
### 
Possible Resolution:
- migrate the entire app from CommonJS to ES Modules (Huge piece of work)
- Try make use of the common js optimize config inside vite

### Actual Resolution:
Inside the vite.config.js file, made use of the commonjsOptions property add added every file that used the Common JS syntax of `module.exports`.


### Error Recieved:
```
Uncaught ReferenceError: require is not defined
    at assets/index-dfaf6cee.js (index-dfaf6cee.js:24051:34)
    at __require (index-dfaf6cee.js:5:50)
    at index-dfaf6cee.js:97778:16
```

### Resolution
This error was appearing because some of the react jsx files were using a combination of require and import. Switching all to import allowed vite to properly compile


## Outcomes:
After fixing all the above issues, I was able to generate a set of assets using the `vite build` command. Coupled with the `vite preview` command, these assets were then useable inside of the datahub application with some caveats:

- There is limited scope for controlling the output of the manifest file, so file keys are generated with their full file path which could be annoying when referencing deeply nested files.
- The `vite serve` command is extermely fast to run (500ms), however does not produce a working environment. Error is
```
Uncaught SyntaxError: The requested module '/client/utils/date.js' does not provide an export named 'format' (at CompaniesHouseAccount.jsx:14:10
```

## Summary:
For new projects using the latest technologies, vite is a logical choice as it requires less config and is much faster than webpack. For projects with legacy code, the effort required to upgrade is substantial. Instead of attempting to make the project work with vite by using the config file, it would be better to go all out and upgrade everything from CommonJS to ES Modules. There are tools out there to assist, but I found them not easy to use and did introduce some errors.
