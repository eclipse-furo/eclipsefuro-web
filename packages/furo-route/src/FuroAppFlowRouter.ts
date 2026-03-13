import type { PageRequest, QueryParams, RouteMap, ViewRequest } from "./types";

let furoAppFlowRouter: FuroAppFlowRouter; // FuroAppFlowRouter

/**
 * The job of the FuroAppFlowRouter is to update the url and manage the history state of the browser.
 * Every "view" of the app is always derived from the `Location` (URL), this ensures a proper deep link handling.
 *
 *
 * @param {RegExp} u
 */
class FuroAppFlowRouter {
  private openBlankPage = false;

  private urlSpaceRegex = "";

  private configObject: RouteMap;

  private clickHandler: (e: MouseEvent) => void;

  /**
   *
   * @param config {RouteMap}
   * @param urlSpaceRegex {string} - A regexp pattern that defines the set of URLs that should be considered part of this web app. Clicking on a link that matches this regular expression won't result in a full page navigation, but will instead just update the URL state in place.
   */
  constructor(config: RouteMap, urlSpaceRegex?: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    furoAppFlowRouter = this;

    this.configObject = config;

    if (window.history.length <= 1) {
      window.history.replaceState({ HistoryStartingPoint: true }, "", window.location.href);
    }

    if (urlSpaceRegex !== undefined) {
      this.urlSpaceRegex = urlSpaceRegex;
    }

    window.addEventListener("keydown", (ev) => {
      if (ev.metaKey || ev.altKey) {
        this.openBlankPage = true;
      }
    });

    window.addEventListener("keyup", (ev) => {
      if (ev.key === "Meta" || ev.key === "Control") {
        this.openBlankPage = false;
      }
    });

    window.addEventListener("focus", () => {
      this.openBlankPage = false;
    });

    window.addEventListener("blur", () => {
      this.openBlankPage = false;
    });
    this.clickHandler = (e: MouseEvent) => {
      const target = this._findAtagInPath(e.composedPath());

      // only handle clicks on <a href=".
      if (target === null) {
        return;
      }

      if (target.target === "_blank") {
        return;
      }

      // only handle regular clicks
      if (e.metaKey || e.altKey || e.ctrlKey) {
        return;
      }

      // ignore links outside urlSpaceRegex
      if (this.urlSpaceRegex !== "") {
        if (target.pathname.match(this.urlSpaceRegex) === null) {
          return;
        }
      }

      // do not interfere with links to other hosts
      if (target.host !== window.location.host) {
        const customEvent = new CustomEvent("external-link-clicked", {
          composed: true,
          bubbles: false,
          detail: window.performance.now(),
        });
        window.dispatchEvent(customEvent);

        this.handleAppExitReEnter();
        return;
      }

      // update history for internal links
      const beforeReplace = new CustomEvent("__beforeReplaceState", {
        composed: true,
        bubbles: true,
        detail: { cancel: false, targetPath: target.pathname },
      });
      window.dispatchEvent(beforeReplace);

      if (!beforeReplace.detail.cancel) {
        window.history.replaceState(window.history.state, "", target.href);
        // Internal notyfication
        window.dispatchEvent(
          new CustomEvent("__furoLocationChanged", {
            composed: true,
            bubbles: true,
            detail: window.performance.now(),
          })
        );
      }

      // prevent from full reload
      e.preventDefault();
    };

    window.addEventListener("click", this.clickHandler, false);
  }

  trigger(pageRequest: PageRequest) {
    // ── Built-in system events ──
    if (pageRequest.requestName === "history-back") {
      const beforeHistoryBack = new CustomEvent("__beforeHistoryBack", {
        composed: true,
        bubbles: true,
        detail: { cancel: false },
      });
      window.dispatchEvent(beforeHistoryBack);

      if (!beforeHistoryBack.detail.cancel) {
        this.back();
      }
      return true;
    }

    if (pageRequest.requestName === "EXTERNAL_LINK") {
      if (!pageRequest.queryParams?.url) {
        console.error("url is missing");
        return false;
      }
      const url = pageRequest.queryParams.url as string;
      if (this.openBlankPage) {
        window.open(url);
      } else {
        const beforeReplace = new CustomEvent("__beforeReplaceState", {
          composed: true,
          bubbles: true,
          detail: { cancel: false, targetPath: new URL(url, window.location.origin).pathname },
        });
        window.dispatchEvent(beforeReplace);

        if (!beforeReplace.detail.cancel) {
          window.location.href = url;
          window.dispatchEvent(
            new CustomEvent("__furoLocationChanged", {
              composed: true,
              bubbles: true,
              detail: window.performance.now(),
            })
          );
          this.handleAppExitReEnter();
          window.location.href = url;
        }
      }
      return true;
    }

    if (pageRequest.requestName === "HISTORY-BACK-FALLBACK") {
      window.close();
      return true;
    }

    // ── Config-based routing ──
    // should be able to handle with or without slash at the end of paths. ("/app/" or "/app")
    const currentPath = window.location.pathname.replace(new RegExp(this.urlSpaceRegex), "").replace("/", "");
    const match = new RegExp(this.urlSpaceRegex).exec(window.location.pathname);

    // slash should be added to rewrite location
    let prefix = "/";
    if (match !== null) {
      prefix = `${match[0]}/`;
    }

    const base = this.configObject[pageRequest.requestName];
    const selectedFlow: ViewRequest | undefined = base?.pageOverrides?.[currentPath] ? { ...base, ...base.pageOverrides[currentPath] } : base;

    if (selectedFlow !== undefined) {
      let search = "";

      if (selectedFlow.queryParamMapping) {
        // map everything
        if (selectedFlow.queryParamMapping === "*") {
          const qp = [];
          // eslint-disable-next-line no-restricted-syntax
          for (const k in pageRequest.queryParams) {
            qp.push(`${k}=${pageRequest.queryParams[k]}`);
          }
          if (qp.length > 0) {
            search = `?${qp.join("&")}`;
          }
        } else {
          // selective mapping
          const qp: string[] = [];
          if (pageRequest.queryParams !== undefined) {
            selectedFlow.queryParamMapping.forEach((qpMap) => {
              // map pageRequest.queryParams.xx to yy
              if (pageRequest.queryParams![qpMap.from]) {
                qp.push(`${qpMap.to}=${pageRequest.queryParams![qpMap.from]}`);
              }
            });
          }
          if (qp.length > 0) {
            search = `?${qp.join("&")}`;
          }
        }
      }

      if (selectedFlow.isExternalTarget) {
        const url = document.createElement("a");
        url.href = selectedFlow.target + search;

        if (this.openBlankPage || selectedFlow.forceOpenBlank) {
          window.open(url.href);
        } else {
          const beforeReplace = new CustomEvent("__beforeReplaceState", {
            composed: true,
            bubbles: true,
            detail: { cancel: false, targetPath: url.pathname },
          });
          window.dispatchEvent(beforeReplace);

          if (!beforeReplace.detail.cancel) {
            window.location.href = url.href;
            window.dispatchEvent(
              new CustomEvent("__furoLocationChanged", {
                composed: true,
                bubbles: true,
                detail: window.performance.now(),
              })
            );
            this.handleAppExitReEnter();
            window.location.href = url.href;
          }
        }

        return true;
      }

      const beforeReplace = new CustomEvent("__beforeReplaceState", {
        composed: true,
        bubbles: true,
        detail: { cancel: false, targetPath: prefix + selectedFlow.target },
      });
      window.dispatchEvent(beforeReplace);

      if (!beforeReplace.detail.cancel) {
        if (this.openBlankPage) {
          this.openBlankPage = false;
          window.open(prefix + selectedFlow.target + search);
        } else {
          window.history.replaceState(window.history.state, "", prefix + selectedFlow.target + search);
        }
      }

      window.dispatchEvent(
        new CustomEvent("__furoLocationChanged", {
          composed: true,
          bubbles: true,
          detail: window.performance.now(),
        })
      );

      window.dispatchEvent(
        new CustomEvent("page-changed", {
          composed: true,
          bubbles: true,
          detail: pageRequest,
        })
      );
      return true;
    }

    console.error("Page request not found", pageRequest);
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  private handleAppExitReEnter() {
    window.dispatchEvent(
      new CustomEvent("before-app-left", {
        composed: true,
        bubbles: true,
        detail: window.performance.now(),
      })
    );

    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("app-reentered", {
          composed: true,
          bubbles: true,
          detail: window.performance.now(),
        })
      );
    }, 64); // safety time so this event is effectively triggered when the user returns to the app.
  }

  /**
   * trigger a history back
   */

  back() {
    if ((window.history.state as { HistoryStartingPoint?: boolean } | null)?.HistoryStartingPoint) {
      this.trigger({ requestName: "HISTORY-BACK-FALLBACK" });
    } else {
      window.history.back();
    }
  }

  /**
   * trigger a history forward
   */
  // eslint-disable-next-line class-methods-use-this
  forward() {
    window.history.forward();
  }

  /**
   * look for A tags in a path array from click events
   * @private
   * @param path
   * @return {boolean|*}
   */
  private _findAtagInPath(path: EventTarget[]): HTMLAnchorElement | null {
    // if we reach body, we are too deep
    if ((path[0] as Element).tagName === "BODY") {
      return null;
    }
    if ((path[0] as Element).tagName === "A") {
      return path[0] as HTMLAnchorElement;
    }
    const [, ...tail] = path;
    return this._findAtagInPath(tail);
  }
}

class FuroAppFlow {
  static emit(requestName: string, queryParams?: QueryParams) {
    const detail: PageRequest = {
      requestName,
      queryParams,
    };
    furoAppFlowRouter.trigger(detail);
  }

  // helper to open a link by string
  static openExternalLink(target: string) {
    furoAppFlowRouter.trigger({ requestName: "EXTERNAL_LINK", queryParams: { url: target } });
  }
}

export { FuroAppFlow, FuroAppFlowRouter };
