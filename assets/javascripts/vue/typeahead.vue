<template>
  <div v-bind:class="classes"
       v-bind:id="name+'__typeahead'">
    <label class="c-form-group__label" :class="{ 'u-visually-hidden': hideLabel }" :for="id">
      <span class="c-form-group__label-text">{{ label }}</span>
    </label>
    <multiselect
      label="label"
      open-direction="auto"
      track-by="value"
      v-model="selectedOptions"
      :placeholder="setPlaceHolder"
      :model="multiSelectModel"
      :clear-on-select="true"
      :close-on-select="isCloseOnSelect"
      :hide-selected="true"
      :internal-search="false"
      :loading="isLoading"
      :multiple="multipleSelect"
      :options="options"
      :options-limit="500"
      :show-no-results="false"
      :showLabels="false"
      :searchable="true"
      :custom-label="nameWithSubLabel"
      :id="id"
      @search-change="queryOptions"
      @open="clearInputField">
      <template slot="clear" slot-scope="props">
        <div class="multiselect__clear" v-if="selectedOptions"
             @mousedown.prevent.stop="clearAll(props.search)"></div>
      </template>
      <template slot="option" slot-scope="props">
        <div class="multiselect__option-label" v-html="$options.filters.highlight(props.option.label, props.search)">{{
          props.option.label }}
        </div>
        <div class="multiselect__option-sublabel" v-if="isAsyncFunction"
             v-html="$options.filters.highlight(props.option.subLabel, props.search)">{{ props.option.subLabel }}
        </div>
        <div class="multiselect__option-sublabel" v-else>{{ props.option.subLabel }}</div>
      </template>

      <template slot="caret" slot-scope="methods">
        <div v-if="showCaret">
          <div @mousedown.prevent.stop="methods.toggle()" class="multiselect__select"></div>
        </div>
      </template>
    </multiselect>


    <template v-if="multipleSelect">
      <input type="hidden" class="js-ClearInputs--removable-field" :name="name"
             v-for="(option, index) in selectedOptions"
             :key="index" :value="option.value">
    </template>
    <template v-else>
      <input type="hidden" class="js-ClearInputs--removable-field" :name="name"
             :value="hiddenFormValue">
    </template>
  </div>
</template>
<script>

  const axios = require('axios')
  const Multiselect = require('vue-multiselect').default
  const getFormData = require('get-form-data').default
  const debounce = require('lodash/debounce')
  const pickBy = require('lodash/pickBy')
  const uuid = require('uuid')
  const XHR = require('../lib/xhr')
  const { matchWords } = require('../lib/helpers')

  export default {
    components: {
      'multiselect': Multiselect,
    },
    props: {
      label: {
        type: String,
        required: true,
      },
      entity: {
        type: String,
        required: false,
      },
      selectedValue: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
        required: true,
      },
      model: {
        type: String,
        required: false,
      },
      value: {
        type: String,
        required: false,
        default: ''
      },
      formSelector: {
        type: String,
        required: false,
      },
      autoSubmit: {
        type: Boolean,
        default: true,
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      multipleSelect: {
        type: Boolean,
        required: false,
        default: true,
      },
      closeOnSelect: {
        type: Boolean,
        default: false,
      },
      classes: {
        type: String,
        required: false,
      },
      isAsync: {
        type: Boolean,
        required: false,
        default: true,
      },
      hideLabel: {
        type: Boolean,
        required: false,
        default: false,
      },
      useSubLabel: {
        type: Boolean,
        required: false,
        default: true,
      },
      hideInactive: {
        type: Boolean,
        required: false,
        default: true,
      }
    },
    created () {
      if (!this.useMultipleSelect) {
        this.setPlaceHolder = this.getLabelFromValue(this.selectedValue, this.multiSelectModel) || this.placeholder
      }

      this.isCloseOnSelect = !this.useMultipleSelect
      this.multiSelectModel = null

      if (!this.isAsync) {
        this.multiSelectModel = this.model
      }
    },
    data () {
      return {
        selectedOptions: this.value ? JSON.parse(this.value) : [],
        options: [],
        optionsData: this.model && JSON.parse(this.model),
        isLoading: false,
        id: uuid(),
        multiSelectModel: this.model,
        useMultipleSelect: this.multipleSelect,
        hiddenFormValue: this.selectedValue,
        setPlaceHolder: this.placeholder,
        isAsyncFunction: false,
        hasLabel: this.hideLabel,
        hasSubLabel: this.useSubLabel,
        filterInactive: this.hideInactive ? '&is_active=true' : ''
      }
    },
    methods: {
      nameWithSubLabel: function({ label, subLabel }){
        return this.hasSubLabel ? `${label}, ${subLabel}` : label
      },
      clearInputField: function () {
        this.setPlaceHolder = this.placeholder
      },
      getLabelFromValue: function (value, model) {
        if(!value){ return }
        const activeValue = JSON.parse(model).filter((item) => {
          return item.value === value
        })
        if (activeValue.length < 1) {
          return this.setPlaceHolder
        }

        return `${activeValue[0].label}${activeValue[0].subLabel ? ', ' + activeValue[0].subLabel : ''}`
      },
      queryOptions: function (query) {
        this.isAsync ? this.asyncSearch(query) : this.search(query)
      },
      search: debounce(function (query) {
        this.options = this.optionsData.filter((obj) => {
          return matchWords(obj.label, query)
        })
      }, 500),
      asyncSearch: debounce(function (query) {
        if (query.length < 3) {return}
        this.isLoading = true
        this.isAsyncFunction = true
        axios.get(`/api/options/${this.entity}?autocomplete=${query}${this.filterInactive}`)
          .then((response) => {
            this.options = response.data
            this.isLoading = false
          })
          .catch(function (error) {
            console.error(error)
          })
      }, 500),
    },
    watch: {
      selectedOptions: function (selectedOption) {
        if (selectedOption) {
          this.hiddenFormValue = selectedOption.value
        } else {
          this.setPlaceHolder = this.placeholder
        }

        if (!this.autoSubmit) { return }

        const form = this.formSelector ? document.querySelector(this.formSelector) : this.$el.closest('form')
        if (!form) { return }

        const query = pickBy(getFormData(form))
        delete query[this.id]

        query[this.name] = Array.isArray(selectedOption) ? selectedOption.map(option => option.value) : [selectedOption]

        XHR.request(form.action, query)
      }
    },
    computed: {
      showCaret: function () {
        return this.options.length > 0
      }
    }
  }
</script>
