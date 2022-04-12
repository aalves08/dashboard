import { STATES } from '@/plugins/steve/resource-class';

// some default values
const defaultNodeRadius = 20;
const defaultNodePadding = 15;
const chartWidth = 800;
const chartHeight = 500;
const fdcStrength = -300;
const fdcDistanceMax = 500;
const fdcForceCollide = 75;

// setting up default sim params
const simulationParams = {
  fdcStrength,
  fdcDistanceMax,
  fdcForceCollide,
};

/**
 * Represents a config object for FDC type
 * @param {Function} parseData - Parses the specific data for each chart. Format must be compliant with d3 data format
 * @example data format => { parent: {..., children: [ {..., children: []} ] } }
 * @param {Function} extendNodeClass - Extends the classes for each node so that the styling is correctly applied
 * @param {Function} nodeDimensions - Sets the radius of the nodes according each data type
 * @param {Function} infoDetails - Prepares the data to be displayed in the info box on the right-side of the ForceDirectedTreeChart component
 */
export const gitRepoGraphConfig = {
  chartWidth,
  chartHeight,
  simulationParams,
  /**
     * data prop that is used to trigger the watcher in the component. Should follow format "data.xxxxxx"
     */
  watcherProp: 'data.bundles',
  /**
     * Mandatory params for a child object in parseData (for statuses to work)
     * @param {String} state
     * @param {String} stateDisplay
     * @param {String} stateColor
     * @param {String} matchingId
     */
  parseData:   (data) => {
    const bundles = data.bundles.map((bundle, i) => {
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

      const bds = data.bundleDeployments.filter(bd => bundle.id === `${ bd.metadata?.labels?.['fleet.cattle.io/bundle-namespace'] }/${ bd.metadata?.labels?.['fleet.cattle.io/bundle-name'] }`);

      console.log('bds', bds);
      bds.forEach((bd) => {
        const bdLowercaseState = bd.state ? bd.state.toLowerCase() : 'unknown';
        const bdStateColor = STATES[bdLowercaseState].color;

        const cluster = data.clustersList.find((cluster) => {
          const clusterString = `${ cluster.namespace }-${ cluster.name }`;

          return bd.id.includes(clusterString);
        });

        repoChild.children.push({
          id:                 bd.id,
          matchingId:         bd.id,
          type:               bd.type,
          clusterId:          cluster ? cluster.id : undefined,
          state:              bd.state,
          stateLabel:         bd.stateDisplay,
          stateColor:         bdStateColor,
          isBundleDeployment: true,
          errorMsg:           bd.stateDescription,
          detailLocation:     bd.detailLocation,
        });
      });

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
      children:       bundles
    };

    return finalData;
  },
  /**
     * Used to add relevant classes to each main node instance
     */
  extendNodeClass: (d) => {
    const classArray = [];

    // node type
    d.data?.isRepo ? classArray.push('repo') : d.data?.isBundle ? classArray.push('bundle') : classArray.push('bundle-deployment');

    return classArray;
  },
  /**
     * Used to add the correct icon to each node (ties up with iconsConst)
     * Will need to work on a proper long-term solution following up the release of the chart
     */
  fetchNodeIcon: (d) => {
    if (d.data?.isRepo) {
      return 'git';
    }

    if ( d.data?.isBundle) {
      if (d.data?.id.indexOf('helm') !== -1) {
        return 'helm';
      }

      return 'bundle';
    }

    if (d.data?.isBundleDeployment) {
      return 'deployment';
    }
  },
  /**
     * Used to set node dimensions
     */
  nodeDimensions: (d) => {
    if (d.data?.isRepo) {
      return {
        radius:  defaultNodeRadius * 3,
        padding: defaultNodePadding * 2.5
      };
    }
    if (d.data?.isBundle) {
      return {
        radius:  defaultNodeRadius * 2,
        padding: defaultNodePadding
      };
    }

    return {
      radius:  defaultNodeRadius,
      padding: defaultNodePadding
    };
  },
  /**
     * Use @param {Obj} valueObj for compound values (usually associated with a template of some sort) or @param value for a simple straightforward value
     */
  infoDetails: (data) => {
    const moreInfo = [
      {
        type:     'title-link',
        labelKey: 'fleet.fdc.name',
        valueObj: {
          id:             data.id,
          detailLocation: data.detailLocation
        }
      },
      {
        labelKey:  'fleet.fdc.type',
        value:    data.type
      }
    ];

    if (data.isBundleDeployment) {
      moreInfo.push({
        labelKey: 'fleet.fdc.cluster',
        value:    data.clusterId
      });
    }

    moreInfo.push({
      type:     'state-badge',
      labelKey: 'fleet.fdc.state',
      valueObj:    {
        stateColor: data.stateColor,
        stateLabel: data.stateLabel
      }
    });

    if (data.errorMsg) {
      moreInfo.push({
        type:     'single-error',
        labelKey: 'fleet.fdc.error',
        value:    data.errorMsg
      });
    }

    // if (data.perClusterState.find(item => item.error)) {
    //   const err = [];

    //   data.perClusterState.forEach((item) => {
    //     err.push(`<p class="error">${ item.message } :::::: Cluster ID: ${ item.clusterId }</p>`);
    //   });

    //   moreInfo.push({
    //     type:     'multiple-error',
    //     labelKey: 'fleet.fdc.errors',
    //     value:    err
    //   });
    // }
    return moreInfo;
  }
};
