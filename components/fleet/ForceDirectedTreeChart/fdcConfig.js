import { STATES } from '@/plugins/steve/resource-class';
import {
  CONFIG_MAP,
  SECRET,
  WORKLOAD_TYPES,
  STORAGE_CLASS,
  SERVICE,
  PV,
  PVC,
  POD
} from '@/config/types';

export const FDC_ENUM = { FLEET_GIT_REPO: 'fleet-git-repo' };

const fdcAllowedConfigs = [];

Object.keys(FDC_ENUM).forEach((key) => {
  fdcAllowedConfigs.push(FDC_ENUM[key]);
});

export const FDC_ALLOWED_CONFIGS = fdcAllowedConfigs;

/**
 * Represents a config object for FDC type
 * @param {Function} parseData - Parses the specific data for each chart. Format must be compliant with d3 data format
 * @example data format => { parent: {..., children: [ {..., children: []} ] } }
 * @param {Function} extendNodeClass - Extends the classes for each node so that the styling is correctly applied
 * @param {Function} nodeRadius - Sets the radius of the nodes according each data type
 */
export const FDC_CONFIG = {
  [FDC_ENUM.FLEET_GIT_REPO]: {
    /**
     * Mandatory params for a child object in parseData (for statuses to work)
     * @param {String} state
     * @param {String} stateDisplay
     * @param {String} stateColor
     */
    parseData: (data) => {
      const totalClusterCount = data.status?.desiredReadyClusters;
      const repoChildren = data.bundles.map((bundle, i) => {
        const bundleLowercaseState = bundle.state ? bundle.state.toLowerCase() : 'unknown';
        const bundleStateColor = STATES[bundleLowercaseState].color;

        const repoChild = {
          id:             bundle.id,
          matchingId:     bundle.id,
          type:           bundle.type,
          state:          bundle.state,
          stateLabel:     bundle.stateDisplay,
          stateColor:     bundleStateColor,
          isBundle:       true,
          errorMsg:       bundle.stateDescription,
          detailLocation: bundle.detailLocation,
          children:       []
        };

        if (bundle.status?.resourceKey?.length) {
          bundle.status.resourceKey.forEach((res, index) => {
            const id = `${ res.namespace }/${ res.name }`;
            const matchingId = `${ res.kind }-${ res.namespace }/${ res.name }`;
            let type;
            let state;
            let stateLabel;
            let stateColor;
            let perClusterState;
            let detailLocation;

            if (data.status?.resources?.length) {
              const item = data.status?.resources?.find(resource => `${ resource.kind }-${ resource.id }` === matchingId);

              if (item) {
                type = item.type;
                state = item.state;
                perClusterState = item.perClusterState || [];
                detailLocation = item.detailLocation;
                const resourceLowerCaseState = item.state ? item.state.toLowerCase() : 'unknown';

                stateLabel = STATES[resourceLowerCaseState].label;
                stateColor = STATES[resourceLowerCaseState].color;
              }
            }

            repoChild.children.push({
              id,
              matchingId,
              type,
              state,
              stateLabel,
              stateColor,
              isResource: true,
              perClusterState,
              detailLocation,
              totalClusterCount
            });
          });
        }

        return repoChild;
      });

      const repoLowercaseState = data.state ? data.state.toLowerCase() : 'unknown';
      const repoStateColor = STATES[repoLowercaseState].color;

      const finalData = {
        id:             data.id,
        matchingId:     data.id,
        type:           data.type,
        state:          data.state,
        stateLabel:     data.stateDisplay,
        stateColor:     repoStateColor,
        isRepo:         true,
        errorMsg:       data.stateDescription,
        detailLocation: data.detailLocation,
        children:       repoChildren
      };

      return finalData;
    },
    extendNodeClass: (d) => {
      const classArray = [];

      // node type
      d.data?.isRepo ? classArray.push('repo') : d.data?.isBundle ? classArray.push('bundle') : classArray.push('resource');

      // special bundle type
      if (d.data?.isBundle && d.data?.id.indexOf('helm') !== -1) {
        classArray.push('helm');
      }

      // special resource type
      if (d.data?.isResource && d.data?.type) {
        switch (d.data.type) {
        case WORKLOAD_TYPES.DEPLOYMENT:
          classArray.push('deployment');
          break;
        case SERVICE:
          classArray.push('service');
          break;
        case CONFIG_MAP:
          classArray.push('configmap');
          break;
        case WORKLOAD_TYPES.CRON_JOB:
          classArray.push('cronjob');
          break;
        case WORKLOAD_TYPES.DAEMON_SET:
          classArray.push('daemonset');
          break;
        case WORKLOAD_TYPES.JOB:
          classArray.push('job');
          break;
        case PV:
          classArray.push('persistentvolume');
          break;
        case PVC:
          classArray.push('persistentvolumeclaim');
          break;
        case POD:
          classArray.push('pod');
          break;
        case WORKLOAD_TYPES.REPLICA_SET:
          classArray.push('replicaset');
          break;
        case SECRET:
          classArray.push('secret');
          break;
        case WORKLOAD_TYPES.STATEFUL_SET:
          classArray.push('statefulset');
          break;
        case STORAGE_CLASS:
          classArray.push('storageclass');
          break;
        default:
          classArray.push('other');
          break;
        }
      }

      return classArray;
    },
    nodeRadius: (d, globalNodeRadiusUnit) => {
      return d.data?.isRepo ? globalNodeRadiusUnit * 3 : d.data?.isBundle ? globalNodeRadiusUnit * 2 : globalNodeRadiusUnit;
    }
  }
};
