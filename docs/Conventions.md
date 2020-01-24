# Conventions

This document was created to help DIT front-end developers use the same approach when writing JavaScript code.

## 1. Avoid using lodash functions if native alternative is available

Reference: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore

## 2. Avoid using classes for React components

Use function with hooks instead.

## 3. Avoid usage of the `this` keyword

There are not many good reasons to use the `this` keyword in a React project (especially if we agree not to use classes). The `this` keyword indicates usage OO paradigm and imperative style, which is unnecessary with React. Moreover, we use `this` in a completely wrong way in the front-end unit tests. There are some valid reasons to use it though:

If `this` is a part of the library's API e.g. D3.js exposes the selected DOM element as `this` in the accessor callbacks. Similarly in jQuery.
If inheritance is the best approach for a given problem

In those cases it’s fine to use eslint-disable flags. A code reviewer could then easily spot this in a PR and raise issues if needed.

## 4. Don't control outer layout from inside of a component

❌ Example of removing margin of the last badge within the badge:

```js
const Badge = styled('span')`
  border: 2px solid gray;
  &:last-child {
    margin-right: 0;
  }
`

const Badges = styled('div')
```

✅ Example of doing the same on the outer layer

```js
const Badge = styled('span')`
  border: 2px solid gray;
`

const Badges = styled('div')`
  & > &:last-child {
    margin-right: 0;
  }
`
```
