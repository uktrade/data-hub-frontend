<template>
  <div class="c-form-group c-form-group--light c-form-group--smaller c-form-fieldset--light c-form-fieldset--smaller">
    <label class="c-form-group__label" for="field-name">
      <span class="c-form-group__label-text">{{ label }}</span>
      <span class="c-form-group__hint">At least three characters</span>
    </label>

    <div class="c-form-group__inner">
      <input v-name="name" v-model="term" type="text" class="c-form-control c-form-control--light c-form-control--smaller" />
    </div>

    <ul v-if="options.length > 0">
      <li v-for="(option, index) of options" :key="index">{{  option.label }}</li>
    </ul>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'

  export default {
    props: ['label', 'entity', 'value', 'name'],
    data () {
      return {
        options: [],
        term: '',
      }
    },
    watch: {
      term() {
        if (this.term.length > 2) {
          this.loadOptions(this.term)
        } else {
          this.options = []
        }
      }
    },
    methods: {
      loadOptions () {
        axios.get(`/api/options/${this.entity}?term=${this.term}`)
          .then((response) => {
            this.options = response.data
          })
          .catch(function (error) {
            console.error(error)
          })
      },
    },
  }
</script>
