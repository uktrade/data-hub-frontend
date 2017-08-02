/* eslint-disable camelcase */

function transformObjectToOption ({ id, name }) {
  return {
    value: id,
    label: name,
  }
}

function transformStringToOption (string) {
  return {
    value: string,
    label: string,
  }
}

function transformContactToOption ({ id, first_name, last_name }) {
  return {
    value: id,
    label: `${first_name} ${last_name}`,
  }
}

module.exports = {
  transformObjectToOption,
  transformStringToOption,
  transformContactToOption,
}
