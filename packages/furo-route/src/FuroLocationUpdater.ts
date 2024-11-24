import { HashParams, QueryParams } from './types';

export class FuroLocationUpdater {
  /**
   * Set query params by giving an object with key-value pairs.
   *
   * Keep in mind, that this values goes to the url, so setting objects as values is not a good idea
   * @param {QueryParams} queryParams
   * @param {string} queryParamsToRemove - Comma separated list of qp keys to clear/remove from the address
   */
  static updateQueryParams(
    queryParams: QueryParams,
    queryParamsToRemove: string = '',
  ) {
    // read currentPage qp and update incoming qp

    const newQuery = window.location.search.slice(1);

    const queryObject: QueryParams = {};
    if (newQuery.length > 0) {
      newQuery.split('&').forEach(qstr => {
        const p = qstr.split('=');
        // eslint-disable-next-line prefer-destructuring
        queryObject[p[0]] = p[1];
      });
    }

    // clear qps
    if (queryParamsToRemove) {
      queryParamsToRemove.split(',').forEach(ps => {
        delete queryObject[ps.trim()];
      });
    }

    // append qps
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const param in queryParams) {
      queryObject[param] = queryParams[param];
    }

    const qp = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const segment in queryObject) {
      // eslint-disable-next-line no-prototype-builtins
      if (queryObject.hasOwnProperty(segment)) {
        qp.push(`${segment}=${queryObject[segment]}`);
      }
    }
    const location = `${window.location.pathname}?${qp.join('&')}${
      window.location.hash
    }`;
    // notify furo location
    const beforeReplace = new CustomEvent('__beforeReplaceState', {
      composed: true,
      bubbles: true,
      detail: { cancel: false },
    });
    window.dispatchEvent(beforeReplace);

    if (!beforeReplace.detail.cancel) {
      window.history.replaceState({}, '', location);

      const customEvent = new CustomEvent('__furoLocationChanged', {
        composed: true,
        bubbles: true,
        detail: window.performance.now(),
      });
      window.dispatchEvent(customEvent);
    }
  }

  /**
   * Set hash values by giving an object with key-value pairs.
   *
   * Keep in mind, that this values goes to the url, so setting objects as values is not a good idea
   * @param hashParams
   */
  static updateHashParams(
    hashParams: HashParams,
    hashParamsToRemove: string = '',
  ) {
    // read currentPage hash and update incoming hash

    const currentHash = window.location.hash.slice(1);

    const hashObject: HashParams = {};
    if (currentHash.length > 0) {
      currentHash.split('&').forEach(qstr => {
        const p = qstr.split('=');
        // eslint-disable-next-line prefer-destructuring
        hashObject[p[0]] = p[1];
      });
    }

    // clear hashs
    if (hashParamsToRemove) {
      hashParamsToRemove.split(',').forEach(ps => {
        delete hashObject[ps.trim()];
      });
    }

    // append hashs
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const param in hashParams) {
      hashObject[param] = hashParams[param];
    }

    const hash = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const segment in hashObject) {
      // eslint-disable-next-line no-prototype-builtins
      if (hashObject.hasOwnProperty(segment)) {
        hash.push(`${segment}=${hashObject[segment]}`);
      }
    }

    const location = `${window.location.pathname}${
      window.location.search
    }#${hash.join('&')}`;
    const beforeReplace = new CustomEvent('__beforeReplaceState', {
      composed: true,
      bubbles: true,
      detail: { cancel: false },
    });
    window.dispatchEvent(beforeReplace);

    if (!beforeReplace.detail.cancel) {
      window.history.replaceState({}, '', location);
      const customEvent = new CustomEvent('__furoLocationChanged', {
        composed: true,
        bubbles: true,
        detail: window.performance.now(),
      });
      window.dispatchEvent(customEvent);
    }
  }
}
