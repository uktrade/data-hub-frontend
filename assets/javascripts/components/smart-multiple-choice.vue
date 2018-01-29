<template>
  <div class="c-form-group c-form-group--light c-form-group--smaller c-form-fieldset--light c-form-fieldset--smaller">
    <label class="c-form-group__label" for="ajax">
      <span class="c-form-group__label-text">{{ label }}</span>
    </label>
    <multiselect
      v-model="selectedOptions"
      id="ajax"
      label="label"
      track-by="code"
      placeholder="Type to search"
      open-direction="bottom"
      :options="options"
      :multiple="true"
      :searchable="true"
      :loading="isLoading"
      :internal-search="false"
      :clear-on-select="false"
      :close-on-select="false"
      :options-limit="500"
      :limit="3"
      :limit-text="limitText"
      :max-height="600"
      :show-no-results="false"
      :hide-selected="true"
      @search-change="asyncFind">
      <template slot="clear" slot-scope="props">
        <div class="multiselect__clear" v-if="selectedOptions.length" @mousedown.prevent.stop="clearAll(props.search)"></div>
      </template><span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import Multiselect from 'vue-multiselect'

  export default {
    props: ['label', 'entity', 'value', 'name'],
    data () {
      return {
        selectedOptions: [],
        options: [],
        isLoading: false,
      }
    },
    components: {
      'multiselect': Multiselect,
    },
    methods: {
      limitText (count) {
        return `and ${count} other options`
      },
      asyncFind (query) {
        if (query.length < 3) {
          this.options = []
          return
        }

        this.isLoading = true
        axios.get(`/api/options/${this.entity}?term=${query}`)
          .then((response) => {
            this.options = response.data.map((country) => {
              return {
                code: country.value,
                label: country.label,
              }
            })
            this.isLoading = false
          })
          .catch(function (error) {
            console.error(error)
          })
      },
    },
  }
</script>

<style>
  .multiselect__tags {
    border: 1px solid #6f777b;
    border-radius: 0;
  }

  .multiselect__input:focus,
  .multiselect__single:focus {
    box-shadow: none;
  }

  .multiselect--active {
    box-shadow: 0 0 0 3px #ffbf47;
  }

  .multiselect__option--highlight,
  .multiselect__option--highlight:after,
  .multiselect__tag {
    background: #005ea5;
  }
</style>
