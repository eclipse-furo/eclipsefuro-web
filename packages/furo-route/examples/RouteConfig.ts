import { QueryParams, Route, FuroAppFlow } from '@furo/route';

// if you want autocompletion for the flow events, fill this array
const exposedEvents = [
  'unauthorized',
  'object-not-found',
  'general-error-occurred',
  'history-back',
  'navigate-home',
  'show-cube',
] as const;

export const RouteConfig: Route[] = [
  {
    currentPage: '*',
    flowEvent: 'unauthorized',
    target: 'auth',
    queryParamMapping: '*',
    internalDescription: 'Auth page',
  },
  {
    currentPage: '*',
    flowEvent: 'object-not-found',
    target: '404',
    queryParamMapping: '*',
    internalDescription: '404 page',
  },
  {
    currentPage: '*',
    flowEvent: 'show-cube',
    target: 'cube-obj',
    queryParamMapping: '*',
    internalDescription: 'Cube details',
  },
  {
    currentPage: '*',
    flowEvent: 'general-error-occurred',
    target: '5xx',
    queryParamMapping: '*',
    internalDescription: '5xx page',
  },
  {
    currentPage: '*',
    flowEvent: 'navigate-home',
    target: '',
    queryParamMapping: '*',
    internalDescription: 'This is the "start" page',
  },
  {
    currentPage: '*',
    flowEvent: 'history-back',
    target: 'HISTORY-BACK',
    queryParamMapping: null,
  },
  {
    currentPage: '*',
    flowEvent: 'HISTORY-BACK-FALLBACK',
    target: 'WINDOW-CLOSE',
    queryParamMapping: null,
    internalDescription:
      'Close the window if we are at the starting point in a opened window',
  },
];

export type FlowEventName = (typeof exposedEvents)[number];

class AppFlow {
  static emit(eventName: FlowEventName, queryParams?: QueryParams) {
    FuroAppFlow.emit(eventName, queryParams);
  }
}

export { AppFlow };
