# ArchivePanel

### Description

A extension of `StatusMessage` that is used to denote whether a record has been archived.

### Usage

```jsx
<ArchivePanel
  isArchived={record.archived}
  archivedBy={record.archivedBy}
  archivedOn={record.archivedOn}
  archiveReason={record.archiveReason}
  unarchiveUrl={aunarchiveUrl}
  type={type}
/>
```

### Properties

| Prop            | Required | Default | Type     | Description                                                                                                                                        |
| :-------------- | :------- | :------ | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isArchived`    | true     | ``      | boolean  | The archive status of the record. If set to `false`, the component will return `null` and will not render.                                         |
| `archivedBy`    | false    | ``      | Object   | An object containg the first and last name of the person who archived the contact. If this is not defined, the automatic archive text will appear. |
| `archivedOn`    | true     | ``      | string   | The date the record was archived.                                                                                                                  |
| `archiveReason` | true     | ``      | string   | The reason why the record was archived.                                                                                                            |
| `unarchiveUrl`  | true     | ``      | string   | The URL to unarchive the record.                                                                                                                   |
| `type`          | true     | ``      | string   | The type of record.                                                                                                                                |
| `onClick`       | false    | ``      | function | This is used when the unarchive link needs to contain an `onClick` event (such as displaying a flash message)                                      |
