
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
   * Triggered when the page is activated
   * @param location
   */
  pageActivated(location: LocationObject): void;
  pageDeactivated(newLocation: LocationObject): void;
  pageUpdated(location: LocationObject): void;
  pageQueryChanged?(location: LocationObject): void;
  pageHashChanged?(location: LocationObject): void;
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
