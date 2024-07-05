/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{ type: 'autogenerated', dirName: '.' }],

  // But you can create a sidebar manually
  // Items name and page should be same.
  // For eg. if you rename a page you should also change that page name in item attribute under the tutorialSidebar.

  extensionsSidebar: [
    {
      type:  'category',
      label: 'Extensions',
      link:  {
        type: 'doc',
        id:   'extensions/home',
      },
      items: [
        'extensions/introduction',
        'extensions/rancher-2.9-support',
        'extensions/support-matrix',
        'extensions/extensions-getting-started',
        'extensions/extensions-configuration',
        {
          type:  'category',
          label: 'Extensions API',
          link:  {
            type: 'doc',
            id:   'extensions/api/overview',
          },
          items: [
            'extensions/api/concepts',
            'extensions/api/metadata',
            {
              type:  'category',
              label: 'Navigation & Pages',
              items: [
                'extensions/api/nav/products',
                'extensions/api/nav/custom-page',
                'extensions/api/nav/resource-page',
                'extensions/api/nav/side-menu',
                'extensions/api/nav/routing',
              ]
            },
            'extensions/api/actions',
            'extensions/api/cards',
            'extensions/api/panels',
            'extensions/api/tabs',
            'extensions/api/table-columns',
            {
              type:  'category',
              label: 'Components',
              link:  {
                type: 'doc',
                id:   'extensions/api/components/components',
              },
              items: [
                'extensions/api/components/resources',
                'extensions/api/components/node-drivers',
                'extensions/api/components/auto-import',
              ]
            },
            'extensions/api/common',
          ]
        },
        {
          type:  'category',
          label: 'Advanced',
          items: [
            'extensions/advanced/air-gapped-environments',
            'extensions/advanced/provisioning',
            'extensions/advanced/localization',
            'extensions/advanced/hooks',
            'extensions/advanced/stores',
            'extensions/advanced/version-compatibility',
            'extensions/advanced/safe-mode',
            'extensions/advanced/yarn-link',
          ]
        },
        'extensions/publishing',
        {
          type:  'category',
          label: 'Use cases/Examples',
          link:  {
            type: 'doc',
            id:   'extensions/usecases/overview',
          },
          items: [
            'extensions/usecases/top-level-product',
            'extensions/usecases/cluster-level-product',
            {
              type:  'category',
              label: 'Node Driver',
              link:  {
                type: 'doc',
                id:   'extensions/usecases/node-driver/overview',
              },
              items: [
                'extensions/usecases/node-driver/about-drivers',
                'extensions/usecases/node-driver/cloud-credential',
                'extensions/usecases/node-driver/machine-config',
                'extensions/usecases/node-driver/advanced',
                'extensions/usecases/node-driver/proxying',
                'extensions/usecases/node-driver/about-example',
              ]
            }
          ]
        }
      ]
    },
  ],
  internalSidebar: [
    'internal/docs',
    {
      type:  'category',
      label: 'Getting Started',
      items: [
        'internal/getting-started/quickstart',
        'internal/getting-started/concepts',
        'internal/getting-started/development_environment',
        'internal/getting-started/ui-walkthrough'
      ],
    },
    {
      type:  'category',
      label: 'Guide',
      items: [
        'internal/guide/package-management',
        'internal/guide/auth-providers',
        'internal/guide/custom-dev-build'
      ],
    },
    {
      type:  'category',
      label: 'How the Code Base Works',
      items: [
        'internal/code-base-works/api-resources-and-schemas',
        'internal/code-base-works/auth-sessions-and-tokens',
        'internal/code-base-works/cluster-management-resources',
        'internal/code-base-works/customising-how-k8s-resources-are-presented',
        'internal/code-base-works/directory-structure',
        'internal/code-base-works/products-and-navigation',
        'internal/code-base-works/forms-and-validation',
        'internal/code-base-works/helm-chart-apps',
        'internal/code-base-works/keyboard-shortcuts',
        'internal/code-base-works/kubernetes-resources-data-load',
        'internal/code-base-works/routes',
        'internal/code-base-works/middleware',
        'internal/code-base-works/stores',
        'internal/code-base-works/nuxt-plugins',
        'internal/code-base-works/machine-drivers',
        'internal/code-base-works/performance',
        'internal/code-base-works/sortable-table',
        'internal/code-base-works/on-screen-text-and-translations',
        'internal/code-base-works/style',
      ],
    },
    'internal/storybook',
    {
      type:  'category',
      label: 'Testing',
      items: [
        'internal/testing/unit-test',
        'internal/testing/e2e-test',
        'internal/testing/stress-test',
      ],
    },
    'internal/terminology',
  ],
};

module.exports = sidebars;
