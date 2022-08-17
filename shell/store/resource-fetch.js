import Vue from 'vue';

export const state = function() {
  return {
    refreshFlag:                null,
    isTooManyItemsToAutoUpdate: false,
    manualRefreshIsLoading:     false,
    list:                       [
      Object.freeze({ name: 'item1' }),
      Object.freeze({ name: 'item2' }),
    ]
  };
};

export const getters = {
  isTooManyItemsToAutoUpdate: state => state.isTooManyItemsToAutoUpdate,
  refreshFlag:                state => state.refreshFlag,
  manualRefreshIsLoading:     state => state.manualRefreshIsLoading,
  list:                       state => state.list
};

export const mutations = {
  updateIsTooManyItems(state, data) {
    state.isTooManyItemsToAutoUpdate = data;
  },
  updateRefreshFlag(state, data) {
    state.refreshFlag = data;
  },
  updateManualRefreshIsLoading(state, data) {
    state.manualRefreshIsLoading = data;
  },
  updateWholeList(state, data) {
    Vue.set(state, 'list', [{ name: 'item3' }, { name: 'item4' }]);
  },
  replaceItemOnList(state, data) {
    Vue.set(state.list, 1, { name: 'this-is-a-special-one' });
  },
};

export const actions = {
  clearData({ commit, state }) {
    commit('updateIsTooManyItems', false);
    commit('updateRefreshFlag', null);
  },
  updateIsTooManyItems({ commit }, data) {
    commit('updateIsTooManyItems', data);
  },
  updateManualRefreshIsLoading({ commit }, data) {
    commit('updateManualRefreshIsLoading', data);
  },
  doManualRefresh({ commit, dispatch, state }) {
    // simple change to trigger request on the resource-fetch mixin....
    const finalData = new Date().getTime();

    commit('updateRefreshFlag', finalData);
  },
  updateWholeList({ commit }, data) {
    commit('updateWholeList', data);
  },
  replaceItemOnList({ commit }, data) {
    commit('replaceItemOnList', data);
  },
};
