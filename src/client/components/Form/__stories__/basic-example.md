A form component which does the following:
 * Starts a _task_ when the form is submitted
 * Renders a {ProgressBox} overlay while the _task_ is in progress
 * Handles the _task_ rejection by delegating it to the underlying {TaskProgressBox}
 * Can optionally be prepopulated with initial values resolved from a _task_

The form also has the following functionality built in:
 * Error summary rendered on top of the form when there are validation errors
 * Submit button and secondary action links
 * Success flash message on _task_ resolution
 * Redirection after the _submission task_ resolves
 * Recording Google Tag Manager events

### A basic Form example

This is a basic example of all the capabilities of `Form`. It:

- Can resolve initial values for its fields with a _task_
- Will start a task when the form is submitted with a map of field values sent
  as a payload to the task
- Renders a flash message when the _submission task_ resolves
- Hard-redirects when when the _submission task_ resolves
- Creates analytics events on submission, step advancement and submission task
  rejection/resolution