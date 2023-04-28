/* eslint-disable cypress/no-unnecessary-waiting */
import PagePo from '@/cypress/e2e/po/pages/page.po';
import UnitInputPo from '~/cypress/e2e/po/components/unit-input.po';
import LabeledSelectPo from '~/cypress/e2e/po/components/labeled-select.po';
import RadioGroupInputPo from '~/cypress/e2e/po/components/radio-group-input.po';

function _parseArea(area:string) {
  let areaId: string;

  if (area === 'cluster') {
    areaId = 'clusteragentconfig';
  } else if (area === 'fleet') {
    areaId = 'fleetagentconfig';
  } else {
    throw new Error(`Area identifier not recognized ::: ${ area }`);
  }

  return areaId;
}

export default class AgentConfigurationRke2 extends PagePo {
  static url: string = '/c/_/manager/provisioning.cattle.io.cluster/create?type=custom#clusteragentconfig'
  static goTo(): Cypress.Chainable<Cypress.AUTWindow> {
    return super.goTo(AgentConfigurationRke2.url);
  }

  constructor() {
    super(AgentConfigurationRke2.url);
  }

  title(): Cypress.Chainable<string> {
    return this.self().find('.primaryheader h1').invoke('text');
  }

  selectAffinityOption(area: string, optionIndex: number) {
    const areaId = _parseArea(area);

    new RadioGroupInputPo(this.self().find(`#${ areaId } [data-testid="affinity-options"]`)).set(optionIndex);
  }

  clearOutPrefilledAffinityRules(area: string, type: string) {
    const areaId = _parseArea(area);

    cy.document().then(($document) => {
      const documentResult = $document.querySelectorAll(`#${ areaId } [data-testid="${ type }-affinity"] [data-testid^="array-list-box"]`);

      if (documentResult.length) {
        cy.get(`#${ areaId } [data-testid="${ type }-affinity"] [data-testid^="array-list-box"]`).then(($elements) => {
          const count = $elements.length;

          if (count > 0) {
            cy.wrap($elements).each(() => {
              cy.get(`#${ areaId } [data-testid="${ type }-affinity"] [data-testid="array-list-box0"] .btn.role-link.close.btn-sm`).click();

              // we need this delay here in order to wait for DOM to be updated (items removed)
              cy.wait(1000);
            });
          }
        });
      }
    });
  }

  fillRequestandLimitsForm(area: string, data: any) {
    const areaId = _parseArea(area);

    new UnitInputPo(this.self().find(`#${ areaId } [data-testid="cpu-reservation"]`)).setValue(data.request?.cpu);
    new UnitInputPo(this.self().find(`#${ areaId } [data-testid="memory-reservation"]`)).setValue(data.request?.memory);
    new UnitInputPo(this.self().find(`#${ areaId } [data-testid="cpu-limit"]`)).setValue(data.limit?.cpu);
    new UnitInputPo(this.self().find(`#${ areaId } [data-testid="memory-limit"]`)).setValue(data.limit?.memory);
  }

  fillPodSelectorForm(area: string, data: any) {
    const areaId = _parseArea(area);

    if (data.length) {
      data.forEach((dataPoint:any, index: number) => {
        // add a new pod selector
        this.self().find(`#${ areaId } [data-testid="pod-affinity"] [data-testid="array-list-button"]`).click();

        // fill form
        // type
        const affinityType = new LabeledSelectPo(this.self().find(`#${ areaId } [data-testid="pod-affinity"] [data-testid="pod-affinity-type-index${ index }"]`));

        affinityType.toggle();
        affinityType.clickOption(dataPoint.affinityType);

        // priority
        const priority = new LabeledSelectPo(this.self().find(`#${ areaId } [data-testid="pod-affinity"] [data-testid="pod-affinity-priority-index${ index }"]`));

        priority.toggle();
        priority.clickOption(dataPoint.priority);

        // namespace type
        new RadioGroupInputPo(this.self().find(`#${ areaId } [data-testid="pod-affinity"] [data-testid="pod-affinity-namespacetype-index${ index }"]`)).set(dataPoint.namespaceType);

        if (dataPoint.namespaces) {
          // namespace input (selected namespaces)
          this.self().find(`#${ areaId } [data-testid="pod-affinity"] [data-testid="pod-affinity-namespace-input-index${ index }"]`).type(dataPoint.namespaces);
        }

        // expressions
        if (dataPoint.expressions?.length) {
          dataPoint.expressions.forEach((expression:any, i: number) => {
            // add a new expression
            this.self().find(`#${ areaId } [data-testid="pod-affinity"] [data-testid="pod-affinity-expressions-index${ index }"] [data-testid="input-match-expression-add-rule"]`).click();

            // key
            this.self().find(`#${ areaId } [data-testid="pod-affinity"] [data-testid="pod-affinity-expressions-index${ index }"] [data-testid="input-match-expression-key-control-${ i }"]`).type(expression.key);

            // operator
            const selectOperator = new LabeledSelectPo(this.self().find(`#${ areaId } [data-testid="pod-affinity"] [data-testid="pod-affinity-expressions-index${ index }"] [data-testid="input-match-expression-operator-control-${ i }"]`));

            selectOperator.toggle();
            selectOperator.clickOption(expression.operator);

            // value
            if (expression.value) {
              this.self().find(`#${ areaId } [data-testid="pod-affinity"] [data-testid="pod-affinity-expressions-index${ index }"] [data-testid="input-match-expression-values-control-${ i }"]`).type(expression.value);
            }
          });
        }

        // typology
        this.self().find(`#${ areaId } [data-testid="pod-affinity"] [data-testid="pod-affinity-topology-input-index${ index }"]`).type(dataPoint.topology);

        if (dataPoint.weight) {
          // this first part is to make sure we select all the prefilled data
          this.self().find(`#${ areaId } [data-testid="pod-affinity"] [data-testid="pod-affinity-weight-index${ index }"]`).type('{selectall}');
          this.self().find(`#${ areaId } [data-testid="pod-affinity"] [data-testid="pod-affinity-weight-index${ index }"]`).type(dataPoint.weight);
        }
      });
    } else {
      throw new Error(`No data passed for fillPodSelectorForm!`);
    }
  }

  fillNodeSelectorForm(area: string, data: any) {
    const areaId = _parseArea(area);

    if (data.length) {
      data.forEach((dataPoint:any, index: number) => {
        // add a new node selector
        this.self().find(`#${ areaId } [data-testid="node-affinity"] [data-testid="array-list-button"]`).click();

        // fill form
        // priority
        const priority = new LabeledSelectPo(this.self().find(`#${ areaId } [data-testid="node-affinity"] [data-testid="node-affinity-priority-index${ index }"]`));

        priority.toggle();
        priority.clickOption(dataPoint.priority);

        // expressions
        if (dataPoint.expressions?.length) {
          dataPoint.expressions.forEach((expression:any, i: number) => {
            // add a new expression
            this.self().find(`#${ areaId } [data-testid="node-affinity"] [data-testid="node-affinity-expressions-index${ index }"] [data-testid="input-match-expression-add-rule"]`).click();

            // matching
            if (expression.matching) {
              const selectMatching = new LabeledSelectPo(this.self().find(`#${ areaId } [data-testid="node-affinity"] [data-testid="node-affinity-expressions-index${ index }"] [data-testid="input-match-type-field-control-${ i }"]`));

              selectMatching.toggle();
              selectMatching.clickOption(expression.matching);
            }

            // key
            this.self().find(`#${ areaId } [data-testid="node-affinity"] [data-testid="node-affinity-expressions-index${ index }"] [data-testid="input-match-expression-key-control-${ i }"]`).type(expression.key);

            // operator
            const selectOperator = new LabeledSelectPo(this.self().find(`#${ areaId } [data-testid="node-affinity"] [data-testid="node-affinity-expressions-index${ index }"] [data-testid="input-match-expression-operator-control-${ i }"]`));

            selectOperator.toggle();
            selectOperator.clickOption(expression.operator);

            // value
            if (expression.value) {
              this.self().find(`#${ areaId } [data-testid="node-affinity"] [data-testid="node-affinity-expressions-index${ index }"] [data-testid="input-match-expression-values-control-${ i }"]`).type(expression.value);
            }
          });
        }

        if (dataPoint.weight) {
          // this first part is to make sure we select all the prefilled data
          this.self().find(`#${ areaId } [data-testid="node-affinity"] [data-testid="node-affinity-weight-index${ index }"]`).type('{selectall}');
          this.self().find(`#${ areaId } [data-testid="node-affinity"] [data-testid="node-affinity-weight-index${ index }"]`).type(dataPoint.weight);
        }
      });
    } else {
      throw new Error(`No data passed for fillNodeSelectorForm!`);
    }
  }

  fillTolerationsForm(area: string, data: any) {
    const areaId = _parseArea(area);

    if (data.length) {
      data.forEach((dataPoint:any, index: number) => {
        // add a new toleration
        this.self().find(`#${ areaId } [data-testid="add-toleration-btn"]`).click();

        // fill form
        // key
        this.self().find(`#${ areaId } [data-testid="toleration-key-index${ index }"]`).type(dataPoint.key);

        // operator
        const selectOperator = new LabeledSelectPo(this.self().find(`#${ areaId } [data-testid="toleration-operator-index${ index }"]`));

        selectOperator.toggle();
        selectOperator.clickOption(dataPoint.operator);

        // value
        if (dataPoint.value) {
          this.self().find(`#${ areaId } [data-testid="toleration-value-index${ index }"]`).type(dataPoint.value);
        }

        // effect
        const selectEffect = new LabeledSelectPo(this.self().find(`#${ areaId } [data-testid="toleration-effect-index${ index }"]`));

        selectEffect.toggle();
        selectEffect.clickOption(dataPoint.effect);

        // seconds
        if (dataPoint.seconds) {
          this.self().find(`#${ areaId } [data-testid="toleration-seconds-index${ index }"] input`).type(dataPoint.seconds);
        }
      });
    } else {
      throw new Error(`No data passed for fillTolerationsForm!`);
    }
  }
}
