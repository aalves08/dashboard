<script>
export default {
  props: {
    row: {
      type:     Object,
      required: true
    },
    col: {
      type:     Object,
      required: true
    },
  },

  data() {
    return {
      loading: true, isPods: false, dataWatcher: null, result: null
    };
  },

  computed: {
    value() {
      return this.col.value(this.row);
    }
  },

  methods:  {
    async startDelayedLoading() {
      // if (this.col.name === 'pod_restarts') {
      //   console.log('HERE!!!!!', this.col, this.row);
      //   this.isPods = true;
      //   this.dataWatcher = this.$watch('row.pods', async function(neu) {
      //     await this.watcherFunction(neu);
      //   }, { immediate: true });
      // }
      if (this.col.name === 'pod_restarts') {
        this.isPods = true;
        this.result = await this.row.restartCount();
        console.log('this.result start delayed loading', this.result);
      }

      this.loading = false;
    },
    async watcherFunction(neu) {
      console.log('PODS CHANGE', neu);
      this.result = await this.row.restartCount();

      console.log('this.result', this.result);
    }
  },
  unmounted() {
    this.dataWatcher();
  },
};
</script>

<template>
  <i v-if="loading" class="icon icon-spinner delayed-loader" />
  <span v-else-if="isPods">{{ result }}</span>
  <span v-else>{{ value }}</span>
</template>

<style lang="scss" scoped>
  .delayed-loader {
    font-size: 16px;
    height: 16px;
    width: 16px;
  }
</style>
