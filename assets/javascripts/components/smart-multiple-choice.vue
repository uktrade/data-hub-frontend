<template>
  <div class="c-form-group c-form-group--light c-form-group--smaller c-form-fieldset--light c-form-fieldset--smaller c-form-group--filter">
    <label class="c-form-group__label" for="ajax">
      <span class="c-form-group__label-text">{{ label }}</span>
    </label>
    <multiselect
      label="label"
      open-direction="bottom"
      placeholder="Type to search"
      track-by="value"
      v-model="selectedOptions"
      :clear-on-select="true"
      :close-on-select="false"
      :hide-selected="true"
      :internal-search="false"
      :loading="isLoading"
      :multiple="true"
      :options="options"
      :options-limit="500"
      :show-no-results="false"
      :showLabels="false"
      :searchable="true"
      @search-change="asyncFind">
      <template slot="clear" slot-scope="props">
        <div class="multiselect__clear" v-if="selectedOptions.length" @mousedown.prevent.stop="clearAll(props.search)"></div>
      </template>

      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>

      <template slot="option" slot-scope="props">
        <div class="multiselect__option-label">{{ props.option.label }}</div>
        <div class="multiselect__option-sublabel">{{ props.option.subLabel }}</div>
      </template>
    </multiselect>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import Multiselect from 'vue-multiselect'
  import getFormData from 'get-form-data'
  import XHR from '../lib/xhr'
  import { pickBy, debounce } from 'lodash'

  export default {
    components: {
      'multiselect': Multiselect,
    },
    props: ['label', 'entity', 'name'],
    data () {
      return {
        selectedOptions: [],
        options: [],
        isLoading: false,
      }
    },
    watch: {
      selectedOptions: function (newOptions) {
        if (this.isSubmitting) { return }
        this.isSubmitting = true
        const form = this.$el.closest('form')
        const query = pickBy(getFormData(form))
        query[this.name] = newOptions.map(option => option.value)
        XHR.request(form.action, query)
          .then(() => { this.isSubmitting = false })
      }
    },
    methods: {
      asyncFind: debounce(function (query) {
        if (query.length < 3) {
          this.options = []
          return
        }
        this.isLoading = true
        axios.get(`/api/options/${this.entity}?term=${query}`)
          .then((response) => {
            this.options = response.data
            this.isLoading = false
          })
          .catch(function (error) {
            console.error(error)
          })
      }, 500),
    },
  }
</script>
