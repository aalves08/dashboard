<script>
import { _EDIT } from '@shell/config/query-params';
export default {
  props: {
    cluster: {
      type:     Object,
      required: true,
    },
  },

  name: 'ConfigBadge',

  computed: {
    tooltip() {
      return this.t('clusterBadge.customizeAppearance');
    }
  },
  methods: {
    customBadgeDialog() {
      this.$store.dispatch('cluster/promptModal', { component: 'AddCustomBadgeDialog', componentProps: { mode: _EDIT } });
    },
  },
};
</script>

<template>
  <div
    class="config-badge"
  >
    <div>
      <a
        role="button"
        class="badge-install btn btn-sm role-secondary"
        data-testid="add-custom-cluster-badge"
        tabindex="0"
        @keyup.enter="customBadgeDialog"
        @keyup.space="customBadgeDialog"
        @click="customBadgeDialog"
      >
        <i
          v-clean-tooltip="tooltip"
          class="icon icon-brush-icon"
        />
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .config-badge {

    .badge-install {
      display: flex;
      margin-left: 10px;

      &:hover {
        border-color: var(--lightest);
        cursor: pointer;
      }

      &:focus-visible {
        @include focus-outline;
        outline-offset: 4px;
      }

      > I {
        line-height: inherit;
      }

      // &:focus {
      //   outline: 0;
      // }
    }
  }
</style>
