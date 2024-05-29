/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// import { offlineFallback } from "workbox-recipes";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

// Asset hashes to see if content has changed.
const assetHashes = self.__WB_MANIFEST;
console.log("assetHashes", assetHashes);

// Sets a default Network Only handler, but consider writing your own handlers, too!
// setDefaultHandler(new NetworkFirst());
registerRoute(({ request }) => request.method === "GET", new NetworkFirst());

//cleanup Outdated Caches
cleanupOutdatedCaches();

// pre cache And Route
precacheAndRoute(assetHashes);

// Helps the new service worker immediately take control of all windows and tabs without waiting for any further events.
self.skipWaiting();
clientsClaim();
console.log("end sw set up!");

// HTML to serve when the site is offline
// offlineFallback({
//   pageFallback: "/offline.html",
// });
