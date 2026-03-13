import type { LitElement, ReactiveController, ReactiveControllerHost } from "lit";

import { FuroLocationUpdater } from "./FuroLocationUpdater";
import type { LocationObject, TabControllerConfig, TabDefinition, TabSelectEventDetail } from "./types";

/**
 * ### TabController
 *
 * A Lit ReactiveController for managing tab state with URL synchronization.
 * Follows the URL-first principle: URL is the source of truth.
 *
 * **Key Features:**
 * - URL-first: tab selection updates URL, URL changes update state
 * - Deep-linkable: every tab state has a unique URL
 * - Multiple instances: use different `urlParam` for independent tab sets
 * - Works with `furo-pages`: provides `current` value for page routing
 *
 * **Flow:**
 * ```
 * User clicks tab → selectTab() → URL updates → syncFromUrl() → state updates → UI re-renders
 * ```
 *
 * @example Basic usage
 * ```typescript
 * import { TabController } from "@furo/route";
 *
 * class MyPage extends LitElement implements FuroPage {
 *   private tabs = new TabController(this, {
 *     urlParam: "tab",
 *     tabs: [
 *       { id: "overview", label: "Overview" },
 *       { id: "details", label: "Details" },
 *       { id: "settings", label: "Settings", icon: "action-settings" },
 *     ],
 *     defaultTab: "overview",
 *   });
 *
 *   onPageActivated(location: LocationObject) {
 *     this.tabs.syncFromUrl(location);
 *   }
 *
 *   onPageUpdated(location: LocationObject) {
 *     this.tabs.syncFromUrl(location);
 *   }
 *
 *   render() {
 *     return html`
 *       <lgt-tabcontainer @tab-select="${this.tabs.handleTabSelect}">
 *         ${this.tabs.renderTabs()}
 *       </lgt-tabcontainer>
 *
 *       <furo-pages page="${this.tabs.current}" default="${this.tabs.defaultTab}">
 *         <page-overview id="overview"></page-overview>
 *         <page-details id="details"></page-details>
 *         <page-settings id="settings"></page-settings>
 *       </furo-pages>
 *     `;
 *   }
 * }
 * ```
 *
 * @example Multiple tab sets on same page
 * ```typescript
 * class MyPage extends LitElement {
 *   private mainTabs = new TabController(this, {
 *     urlParam: "tab",
 *     tabs: [{ id: "editor", label: "Editor" }, { id: "preview", label: "Preview" }],
 *     defaultTab: "editor",
 *   });
 *
 *   private sideTabs = new TabController(this, {
 *     urlParam: "panel",
 *     tabs: [{ id: "properties", label: "Properties" }, { id: "history", label: "History" }],
 *     defaultTab: "properties",
 *   });
 *
 *   onPageActivated(location: LocationObject) {
 *     this.mainTabs.syncFromUrl(location);
 *     this.sideTabs.syncFromUrl(location);
 *   }
 * }
 * // URL: ?tab=editor&panel=history
 * ```
 */
export class TabController implements ReactiveController {
  private host: ReactiveControllerHost;

  private config: TabControllerConfig;

  private _current: string;

  /**
   * Create a new TabController.
   *
   * @param host - The Lit element host
   * @param config - Tab configuration
   */
  constructor(host: ReactiveControllerHost, config: TabControllerConfig) {
    this.host = host;
    this.config = config;
    this._current = config.defaultTab;
    host.addController(this);
  }

  // ─────────────────────────────────────────────────────────────────
  // ReactiveController lifecycle
  // ─────────────────────────────────────────────────────────────────

  /**
   * Called when host is connected.
   */
  // eslint-disable-next-line class-methods-use-this
  hostConnected(): void {
    // No setup needed - we sync from URL in page lifecycle methods
  }

  /**
   * Called when host is disconnected.
   */
  // eslint-disable-next-line class-methods-use-this
  hostDisconnected(): void {
    // No cleanup needed
  }

  // ─────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────

  /**
   * Current tab ID. Use this with `furo-pages` page attribute.
   */
  get current(): string {
    return this._current;
  }

  /**
   * Default tab ID. Use this with `furo-pages` default attribute.
   */
  get defaultTab(): string {
    return this.config.defaultTab;
  }

  /**
   * URL parameter name used by this controller.
   */
  get urlParam(): string {
    return this.config.urlParam;
  }

  /**
   * Tab definitions.
   */
  get tabs(): readonly TabDefinition[] {
    return this.config.tabs;
  }

  /**
   * Sync tab state from URL location.
   * Call this in `onPageActivated()` and `onPageUpdated()`.
   *
   * URL is the source of truth - this method reads from URL and updates state.
   * Also syncs the visual tab selection on the tabcontainer if `tabContainerSelector` is configured.
   *
   * @param location - Location object from furo-pages
   */
  syncFromUrl(location: LocationObject): void {
    const tabFromUrl = location.query[this.config.urlParam] as string | undefined;

    if (tabFromUrl && this.isValidTab(tabFromUrl)) {
      this._current = tabFromUrl;
    } else {
      this._current = this.config.defaultTab;
    }

    // Sync visual tab selection on tabcontainer if selector is configured
    if (this.config.tabContainerSelector) {
      this.syncTabContainerSelection();
    }

    this.host.requestUpdate();
  }

  /**
   * Sync the visual tab selection on the tabcontainer element.
   * Called automatically by syncFromUrl() if tabContainerSelector is configured.
   */
  private syncTabContainerSelection(): void {
    if (!this.config.tabContainerSelector) return;

    const host = this.host as unknown as LitElement;
    if (!host.renderRoot) return;

    // Use whenDefined to ensure the tabcontainer is ready
    void customElements.whenDefined("lgt-tabcontainer").then(() => {
      const tabContainer = host.renderRoot.querySelector(this.config.tabContainerSelector!);
      if (tabContainer) {
        (tabContainer as unknown as { selectTabById(id: string): void }).selectTabById(this._current);
      }
    });
  }

  /**
   * Select a tab by updating the URL.
   * Does NOT update state directly - state updates when URL change triggers syncFromUrl().
   *
   * @param tabId - Tab ID to select
   */
  selectTab(tabId: string): void {
    if (!this.isValidTab(tabId)) {
      console.warn(`TabController: Invalid tab ID "${tabId}". Valid tabs: ${this.config.tabs.map((t) => t.id).join(", ")}`);
      return;
    }

    FuroLocationUpdater.updateQueryParams({
      [this.config.urlParam]: tabId,
    });
    // State update happens when URL change triggers onPageUpdated → syncFromUrl
  }

  /**
   * Event handler for `lgt-tabcontainer` tab-select event.
   * Bind this to the tab container's @tab-select event.
   *
   * @example
   * ```html
   * <lgt-tabcontainer @tab-select="${this.tabs.handleTabSelect}">
   * ```
   */
  handleTabSelect = (e: CustomEvent<TabSelectEventDetail>): void => {
    this.selectTab(e.detail.tab.id);
  };

  /**
   * Check if a tab ID is valid.
   *
   * @param tabId - Tab ID to check
   * @returns true if tab exists in config
   */
  isValidTab(tabId: string): boolean {
    return this.config.tabs.some((tab) => tab.id === tabId);
  }

  /**
   * Get a tab definition by ID.
   *
   * @param tabId - Tab ID
   * @returns Tab definition or undefined
   */
  getTab(tabId: string): TabDefinition | undefined {
    return this.config.tabs.find((tab) => tab.id === tabId);
  }
}
