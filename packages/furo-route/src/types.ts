export interface QueryParams {
  [key: string]: string | number;
}

export interface HashParams {
  [key: string]: string | number;
}

export interface LocationObject {
  host: string;
  query: QueryParams;
  hash: HashParams;
  path: string;
  pathSegments: string[];
  hashString: string;
  queryString: string;
}

export interface FuroPage {
  /**
   * Triggered when the page is initialized, or you moved from another page to this page
   * @param location
   */
  onPageActivated(location: LocationObject): void;

  /**
   * Triggered when you go to a different page.
   * @param newLocation
   */
  onPageDeactivated(newLocation: LocationObject): void;

  /**
   * Triggered when something in the URL of the current page changes, query, hash or subpages path.
   * @param location
   */
  onPageUpdated(location: LocationObject): void;

  /**
   * Triggered when query params changed.
   * @param location
   */
  onPageQueryChanged?(location: LocationObject): void;

  /**
   * Triggered when hash params change
   * @param location
   */
  onPageHashChanged?(location: LocationObject): void;
}



export interface QueryParamMap {
  from: string;
  to: string;
}

export interface Route {
  readonly currentPage: string;
  readonly flowEvent: string;
  readonly target: 'HISTORY-BACK' | 'WINDOW-CLOSE' | string;
  readonly queryParamMapping: undefined | null | '*' | QueryParamMap[];
  readonly isExternalTarget?: boolean;
  readonly forceOpenBlank?: boolean;
  readonly internalDescription?: string;
}

export interface FlowEvent {
  eventName: string;
  queryParams?: QueryParams;
}

export interface DocumentTitle {
  prefix: string;
  title: string;
  suffix: string;
  documentTitle: string;
  iconName?: string;
}

// ─────────────────────────────────────────────────────────────────
// TabController Types
// ─────────────────────────────────────────────────────────────────

/**
 * Tab definition for TabController.
 */
export interface TabDefinition {
  /** Unique ID, used in URL query param and furo-pages page attribute */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Optional: Tab design variant */
  design?: "Default" | "Positive" | "Negative" | "Critical" | "Neutral";
  /** Optional: Icon name (SAP icon) */
  icon?: string;
  /** Optional: Whether tab is disabled */
  disabled?: boolean;
}

/**
 * Configuration for TabController.
 */
export interface TabControllerConfig {
  /** URL query parameter name (e.g., "tab", "subtab", "sideTab") */
  urlParam: string;
  /** Tab definitions */
  tabs: readonly TabDefinition[];
  /** Default tab ID when none specified in URL */
  defaultTab: string;
  /** Optional: CSS selector for the lgt-tabcontainer to sync visual selection */
  tabContainerSelector?: string;
}

/**
 * Event detail from lgt-tabcontainer tab-select event.
 */
export interface TabSelectEventDetail {
  tab: { id: string };
}

/**
 * Interface for lgt-tabcontainer element.
 */
export interface TabContainerElement extends HTMLElement {
  selectTabById(tabId: string): void;
}
