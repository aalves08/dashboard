/* eslint-disable cypress/no-unnecessary-waiting */
import AgentConfigurationRke2 from '~/cypress/e2e/po/pages/agent-configuration-rke2.po';
import {
  podAffinityData,
  requestAndLimitsData,
  tolerationsData,
  nodeAffinityData
} from '@/cypress/e2e/tests/pages/data/agent-configuration-rke2-data';
import { payloadComparisonData } from '@/cypress/e2e/tests/pages/data/agent-configuration-rke2-payload';

describe('Agent Configuration for RKE2', () => {
  beforeEach(() => {
    cy.login();
    AgentConfigurationRke2.goTo();
  });

  it('Should send the correct payload to the server', () => {
    const agentConfigurationRke2 = new AgentConfigurationRke2();

    // intercept
    cy.intercept('POST', 'v1/provisioning.cattle.io.clusters').as('customRKE2ClusterCreation');

    // cluster name
    cy.get('[data-testid="name-ns-description-name"] input').type(`test-cluster-${ Math.random().toString(36).substr(2, 6) }`);

    // we should be on the custom cluster creation screen (starts on cluster agent tab as per url of goTo)
    agentConfigurationRke2.title().should('contain', 'Cluster: Create Custom');

    // fill requests and limits form (cluster agent)
    agentConfigurationRke2.fillRequestandLimitsForm('cluster', requestAndLimitsData);

    // fill tolerations form (cluster agent)
    agentConfigurationRke2.fillTolerationsForm('cluster', tolerationsData);

    // Select custom affinity rules (cluster agent)
    agentConfigurationRke2.selectAffinityOption('cluster', 1);

    // Clear out any prefilled affinity rules so that we start from scratch
    agentConfigurationRke2.clearOutPrefilledAffinityRules('cluster', 'pod');
    agentConfigurationRke2.clearOutPrefilledAffinityRules('cluster', 'node');

    // fill form for pod affinity/anti-affinity (cluster agent)
    agentConfigurationRke2.fillPodSelectorForm('cluster', podAffinityData);

    // fill form for pod affinity/anti-affinity (cluster agent)
    agentConfigurationRke2.fillNodeSelectorForm('cluster', nodeAffinityData);

    // navigate to the fleet agent area
    cy.get('#fleetagentconfig').click();

    // fill requests and limits form (fleet agent)
    agentConfigurationRke2.fillRequestandLimitsForm('fleet', requestAndLimitsData);

    // fill tolerations form (fleet agent)
    agentConfigurationRke2.fillTolerationsForm('fleet', tolerationsData);

    // Select custom affinity rules (fleet agent)
    agentConfigurationRke2.selectAffinityOption('fleet', 1);

    // Clear out any prefilled affinity rules so that we start from scratch
    agentConfigurationRke2.clearOutPrefilledAffinityRules('fleet', 'pod');
    agentConfigurationRke2.clearOutPrefilledAffinityRules('fleet', 'node');

    // fill form for pod affinity/anti-affinity (fleet agent)
    agentConfigurationRke2.fillPodSelectorForm('fleet', podAffinityData);

    // fill form for pod affinity/anti-affinity (fleet agent)
    agentConfigurationRke2.fillNodeSelectorForm('fleet', nodeAffinityData);

    // hit create button
    cy.get('[data-testid="rke2-custom-create-save"]').click();

    // need to do a wait to make sure intercept doesn't fail on cy.wait for request
    // ci/cd pipelines are notoriously slow... let's wait longer than usual
    // https://github.com/cypress-io/cypress/issues/19975
    cy.wait(60000);

    cy.wait('@customRKE2ClusterCreation').then((req) => {
      expect(req.response?.statusCode).to.equal(201);
      expect(req.request?.body?.spec.clusterAgentDeploymentCustomization).to.deep.equal(payloadComparisonData.clusterAgentDeploymentCustomization);
      expect(req.request?.body?.spec.fleetAgentDeploymentCustomization).to.deep.equal(payloadComparisonData.fleetAgentDeploymentCustomization);
    });
  });
});
