import PagePo from '@/cypress/e2e/po/pages/page.po';
import AsyncButtonPo from '~/cypress/e2e/po/components/async-button.po';
import LabeledSelectPo from '~/cypress/e2e/po/components/labeled-select.po';
import TabPo from '~/cypress/e2e/po/components/tab.po';
import ActionMenuPo from '~/cypress/e2e/po/components/action-menu.po';
import NameNsDescriptionPo from '~/cypress/e2e/po/components/name-ns-description.po';
import LabeledInputPo from '~/cypress/e2e/po/components/labeled-input.po';

export default class ExtensionsPo extends PagePo {
  static url: string = '/c/local/uiplugins'
  static goTo(): Cypress.Chainable<Cypress.AUTWindow> {
    return super.goTo(ExtensionsPo.url);
  }

  constructor() {
    super(ExtensionsPo.url);
  }

  // screen title
  title(): Cypress.Chainable<string> {
    return this.self().getId('extensions-page-title').invoke('text');
  }

  // install extensions operator
  installExtensionsOperatorIfNeeded(attempt = 0) {
    // this will make sure we wait for the page to render first content
    // so that the attemps aren't on a blank page
    this.title();

    if (attempt > 20) {
      return;
    }
    if (Cypress.$('[data-testid="extension-enable-operator"]').length > 0) {
      new AsyncButtonPo(this.self().find('[data-testid="extension-enable-operator"]')).click();
      this.enableExtensionModalEnableClick();
    } else {
      cy.wait(250).then(() => { // eslint-disable-line
        this.installExtensionsOperatorIfNeeded(++attempt); // next attempt
      });
    }
  }

  // install rancher-plugin-examples
  installRancherPluginExamples() {
    // we should be on the extensions page
    this.title().should('contain', 'Extensions');

    // go to app repos
    this.extensionMenuToggle();

    this.manageReposClick();

    // create a new clusterrepo
    this.createNewClusterRepoClick();

    // fill the form
    this.selectRadioOptionGitRepo(2);
    this.enterClusterRepoName('rancher-plugin-examples');
    this.enterGitRepoName('https://github.com/rancher/ui-plugin-examples');
    this.enterGitBranchName('main');

    // save it
    return this.saveNewClusterRepoClick();
  }

  // extension card
  extensionCard(extensionName: string) {
    return this.self().getId(`extension-card-${ extensionName }`);
  }

  extensionCardClick(extensionName: string): Cypress.Chainable {
    return this.extensionCard(extensionName).click();
  }

  extensionCardInstallClick(extensionName: string): Cypress.Chainable {
    return this.extensionCard(extensionName).getId(`extension-card-install-btn-${ extensionName }`).click();
  }

  extensionCardUpdateClick(extensionName: string): Cypress.Chainable {
    return this.extensionCard(extensionName).getId(`extension-card-update-btn-${ extensionName }`).click();
  }

  extensionCardRollbackClick(extensionName: string): Cypress.Chainable {
    return this.extensionCard(extensionName).getId(`extension-card-rollback-btn-${ extensionName }`).click();
  }

  extensionCardUninstallClick(extensionName: string): Cypress.Chainable {
    return this.extensionCard(extensionName).getId(`extension-card-uninstall-btn-${ extensionName }`).click();
  }

  // extension install modal
  extensionInstallModal() {
    return this.self().get('[data-modal="installPluginDialog"]');
  }

  installModalSelectVersionClick(optionIndex: number): Cypress.Chainable {
    const selectVersion = new LabeledSelectPo(this.extensionInstallModal().getId('install-ext-modal-select-version'));

    selectVersion.toggle();

    return selectVersion.clickOption(optionIndex);
  }

  installModalCancelClick(): Cypress.Chainable {
    return this.extensionInstallModal().getId('install-ext-modal-cancel-btn').click();
  }

  installModalInstallClick(): Cypress.Chainable {
    return this.extensionInstallModal().getId('install-ext-modal-install-btn').click();
  }

  // extension uninstall modal
  extensionUninstallModal() {
    return this.self().get('[data-modal="uninstallPluginDialog"]');
  }

  uninstallModalCancelClick(): Cypress.Chainable {
    return this.extensionUninstallModal().getId('uninstall-ext-modal-cancel-btn').click();
  }

  uninstallModaluninstallClick(): Cypress.Chainable {
    return this.extensionUninstallModal().getId('uninstall-ext-modal-uninstall-btn').click();
  }

  // extension details
  extensionDetails() {
    return this.self().getId('extension-details');
  }

  extensionDetailsBgClick(): Cypress.Chainable {
    return this.self().getId('extension-details-bg').click();
  }

  extensionDetailsTitle(): Cypress.Chainable<string> {
    return this.extensionDetails().getId('extension-details-title').invoke('text');
  }

  extensionDetailsCloseClick(): Cypress.Chainable {
    return this.extensionDetails().getId('extension-details-close').click();
  }

  // extension tabs
  extensionTabs() {
    return this.self().getId('extension-tabs');
  }

  extensionTabInstalledClick(): Cypress.Chainable {
    return new TabPo(this.extensionTabs()).clickNthTab(1);
  }

  extensionTabAvailableClick(): Cypress.Chainable {
    return new TabPo(this.extensionTabs()).clickNthTab(2);
  }

  extensionTabUpdatesClick(): Cypress.Chainable {
    return new TabPo(this.extensionTabs()).clickNthTab(3);
  }

  extensionTabAllClick(): Cypress.Chainable {
    return new TabPo(this.extensionTabs()).clickNthTab(4);
  }

  // extension reload banner
  extensionReloadBanner() {
    return this.self().getId('extension-reload-banner');
  }

  extensionReloadClick(): Cypress.Chainable {
    return this.extensionReloadBanner().getId('extension-reload-banner-reload-btn').click();
  }

  // extension menu
  private extensionMenu() {
    return this.self().getId('extensions-page-menu');
  }

  extensionMenuToggle(): Cypress.Chainable {
    return this.extensionMenu().click();
  }

  manageReposClick(): Cypress.Chainable {
    return new ActionMenuPo(this.self()).clickMenuItem(0);
  }

  // this will only appear with developer mode enabled
  // developerLoadClick(): Cypress.Chainable {
  //   return this.self().getId('action-menu-2-item').click();
  // }

  disableExtensionsClick(): Cypress.Chainable {
    return new ActionMenuPo(this.self()).clickMenuItem(2);
  }

  // disable extensions OVERALL modal
  disableExtensionModal() {
    return this.self().getId('disable-ext-modal');
  }

  removeRancherExtRepoCheckboxClick(): Cypress.Chainable {
    return this.self().getId('disable-ext-modal-remove-repo').click();
  }

  disableExtensionModalCancelClick(): Cypress.Chainable {
    return this.disableExtensionModal().get('.dialog-buttons button:first-child').click();
  }

  disableExtensionModalDisableClick(): Cypress.Chainable {
    return this.disableExtensionModal().get('.dialog-buttons button:last-child').click();
  }

  // enable extensions OVERALL modal
  enableExtensionModal() {
    return this.self().get('[data-modal="confirm-uiplugins-setup"]');
  }

  enableExtensionModalCancelClick(): Cypress.Chainable {
    return this.enableExtensionModal().get('.dialog-buttons button:first-child').click();
  }

  enableExtensionModalEnableClick(): Cypress.Chainable {
    return this.enableExtensionModal().get('.dialog-buttons button:last-child').click();
  }

  // install operator
  installOperatorBtn() {
    return this.self().getId('extension-enable-operator');
  }

  installOperatorBtnClick(): Cypress.Chainable {
    return this.installOperatorBtn().click();
  }

  // add a new repo (Extension Examples)
  createNewClusterRepoClick(): Cypress.Chainable {
    return this.self().getId('masthead-create').click();
  }

  enterClusterRepoName(name: string) {
    return new NameNsDescriptionPo(this.self()).name().set(name);
  }

  enterGitRepoName(name: string) {
    return cy.get('[data-testid="clusterrepo-git-repo-input"]').type(name);
    // return new LabeledInputPo(this.self().get('[data-testid="clusterrepo-git-repo-input"]')).set(name);
  }

  enterGitBranchName(name: string) {
    return cy.get('[data-testid="clusterrepo-git-branch-input"]').type(name);
  }

  selectRadioOptionGitRepo(index: Number): Cypress.Chainable {
    return this.self().get(`[data-testid="clusterrepo-radio-input"] .radio-group > div:nth-child(${ index }) .labeling label`).click();
  }

  saveNewClusterRepoClick(): Cypress.Chainable {
    return this.self().getId('action-button-async-button').click();
  }
}
