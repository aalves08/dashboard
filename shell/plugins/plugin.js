// This plugin loads any UI Plugins at app load time
import { allHashSettled } from '@shell/utils/promise';
import { shouldNotLoadPlugin, UI_PLUGIN_BASE_URL } from '@shell/config/uiplugins';
import { getKubeVersionData, getVersionData } from '@shell/config/version';
import versions from '@shell/utils/versions';

export default async function(context) {
  if (process.env.excludeOperatorPkg === 'true') {
    return;
  }

  const hash = {};

  // Provide a mechanism to load the UI without the plugins loaded - in case there is a problem
  let loadPlugins = true;

  const queryKeys = Object.keys(context.route?.query || {}).map((q) => q.toLowerCase());

  if (queryKeys.includes('safemode')) {
    loadPlugins = false;
    console.warn('Safe Mode - plugins will not be loaded'); // eslint-disable-line no-console
    setTimeout(() => {
      context.store.dispatch('growl/success', {
        title:   context.store.getters['i18n/t']('plugins.safeMode.title'),
        message: context.store.getters['i18n/t']('plugins.safeMode.message')
      }, { root: true });
    }, 1000);
  }

  if (loadPlugins) {
    // Fetch list of installed plugins from endpoint
    try {
      const res = await allHashSettled({
        versions: versions.fetch(context),
        plugins:  context.store.dispatch('management/request', {
          url:                  `${ UI_PLUGIN_BASE_URL }`,
          method:               'GET',
          headers:              { accept: 'application/json' },
          redirectUnauthorized: false,
        })
      });

      if (res.plugins.status === 'rejected') {
        throw new Error(res.reason);
      }

      const kubeVersion = getKubeVersionData()?.gitVersion;
      const rancherVersion = getVersionData().Version;

      const plugins = res.plugins.value;
      const entries = plugins.entries || plugins.Entries || {};

      Object.values(entries).forEach((plugin) => {
        const shouldNotLoad = shouldNotLoadPlugin(plugin, { rancherVersion, kubeVersion }, context.store.getters['uiplugins/plugins'] || []); // Error key string or boolean

        if (!shouldNotLoad) {
          hash[plugin.name] = context.$plugin.loadPluginAsync(plugin);
        } else {
          context.store.dispatch('uiplugins/setError', { name: plugin.name, error: shouldNotLoad });
        }
      });
    } catch (e) {
      if (e?.code === 404) {
        // Not found, so extensions operator probably not installed
        console.log('Could not load UI Extensions list (Extensions Operator may not be installed)'); // eslint-disable-line no-console
      } else {
        console.error('Could not load UI Extensions list', e); // eslint-disable-line no-console
      }
    }

    // Load all of the plugins
    const pluginLoads = await allHashSettled(hash);

    // Some pluigns may have failed to load - store this
    Object.keys(pluginLoads).forEach((name) => {
      const res = pluginLoads[name];

      if (res?.status === 'rejected') {
        console.error(`Failed to load plugin: ${ name }. `, res.reason || 'Unknown reason'); // eslint-disable-line no-console

        // Record error in the uiplugins store, so that we can show this to the user
        context.store.dispatch('uiplugins/setError', { name, error: 'plugins.error.load' }); // i18n-uses plugins.error.load
      }
    });
  }

  return true;
}
