/**
 * The server, for a setup without the vite plugin: `createPicoMock` builds it, `startPicoMock` binds
 * it to a port of its own. The plugin is `@furo/vite-pico-mock/vite`, the fixture helpers are
 * `@furo/vite-pico-mock/helpers` and the fixture types `@furo/vite-pico-mock/types`.
 */

export { createPicoMock, startPicoMock, rpcStatus } from "./server.js";
