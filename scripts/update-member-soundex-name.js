#!/usr/bin/env node

/**
 * Script to update Tracked Entities with Soundex Name Field
 *
 * This script:
 * 1. Fetches all tracked entities from DHIS2 with paging (using tracker API)
 * 2. Generates Soundex codes from name fields
 * 3. Updates each tracked entity with the new Soundex name field
 *
 * Usage:
 *   node scripts/update-member-soundex-name.js [baseUrl]
 *   node scripts/update-member-soundex-name.js https://dhis2.world/pmnp
 */

require("dotenv").config();
const https = require("https");
const http = require("http");
const { URL } = require("url");
const { generateSoundex } = require("./soundex.js");

// Configuration from .env or command line
const BASE_URL = process.argv[2] || process.env.VITE_BASE_URL || "https://dhis2.world/pmnp";
const USERNAME = process.env.VITE_USERNAME;
const PASSWORD = process.env.VITE_PASSWORD;

// DHIS2 Attribute UIDs
const ATTRIBUTE_UIDS = {
  FIRST_NAME: "PIGLwIaw0wy", // First name
  MIDDLE_NAME: "WC0cShCpae8", // Middle name
  LAST_NAME: "IENWcinF8lM", // Last name
  EXTENSION_NAME: "nyVsU3fTk2b", // Extension name
  SOUNDEX_NAME: "mDdoqGKJDOU", // HHM Soundex Name
};

// Paging configuration
const PAGE_SIZE = 10;
const TOTAL_PAGES_LIMIT = null; // Set to a number to limit pages, null for all

// Statistics
const stats = {
  totalFetched: 0,
  totalUpdated: 0,
  totalFailed: 0,
  totalSkipped: 0,
  startTime: Date.now(),
};

/**
 * Make HTTP/HTTPS request with authentication
 */
function makeRequest(url, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === "https:";
    const client = isHttps ? https : http;

    const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      rejectUnauthorized: false, // For self-signed certificates
    };

    if (data) {
      const payload = JSON.stringify(data);
      options.headers["Content-Length"] = Buffer.byteLength(payload);
    }

    const req = client.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed);
          } catch (e) {
            resolve(body);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body.substring(0, 500)}`));
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Fetch tracked entities with paging using tracker API
 */
// https://dhis2.world/pmnp/api/tracker/trackedEntities.json?paging=true&pageSize=10&page=1&totalPages=true&orgUnit=Oyq1wCBL4h5&ouMode=SELECTED&program=VVLirjoOGbj&fields=:all,!enrollments
async function fetchTrackedEntities(page = 1) {
  const url = `${BASE_URL}/api/tracker/trackedEntities.json?paging=true&pageSize=${PAGE_SIZE}&page=${page}&totalPages=true&orgUnit=Oyq1wCBL4h5&ouMode=SELECTED&program=VVLirjoOGbj&fields=:all,!enrollments`;

  console.log(`\n📥 Fetching page ${page} (${PAGE_SIZE} per page)...`);

  try {
    const response = await makeRequest(url);

    return response;
  } catch (error) {
    console.error(`❌ Error fetching page ${page}:`, error.message);
    throw error;
  }
}

/**
 * Get attribute value from tracked entity
 */
function getAttributeValue(trackedEntity, attributeId) {
  const attr = trackedEntity.attributes?.find((a) => a.attribute === attributeId);
  return attr?.value || "";
}

/**
 * Generate Soundex name for a tracked entity
 */
function generateSoundexName(trackedEntity) {
  const firstname = getAttributeValue(trackedEntity, ATTRIBUTE_UIDS.FIRST_NAME);
  const middlename = getAttributeValue(trackedEntity, ATTRIBUTE_UIDS.MIDDLE_NAME);
  const lastname = getAttributeValue(trackedEntity, ATTRIBUTE_UIDS.LAST_NAME);
  const extname = getAttributeValue(trackedEntity, ATTRIBUTE_UIDS.EXTENSION_NAME);

  const soundexCodes = generateSoundex(firstname, middlename, lastname, extname);

  // Concatenate: firstname + middlename + lastname + extname
  const combinedSoundex =
    soundexCodes.firstname + soundexCodes.middlename + soundexCodes.lastname + soundexCodes.extname;

  return {
    combinedSoundex,
    soundexCodes,
    names: { firstname, middlename, lastname, extname },
  };
}

/**
 * Update tracked entity with Soundex name using tracker API
 * Returns the updated tracked entity object instead of sending immediately
 */
function prepareTrackedEntityUpdate(trackedEntity, soundexValue) {
  const teiId = trackedEntity.trackedEntity;

  // Keep all existing attributes and add/update the Soundex attribute
  const existingAttributes = trackedEntity.attributes || [];
  const soundexAttrIndex = existingAttributes.findIndex((a) => a.attribute === ATTRIBUTE_UIDS.SOUNDEX_NAME);

  let updatedAttributes;
  if (soundexAttrIndex >= 0) {
    // Update existing Soundex attribute
    updatedAttributes = [...existingAttributes];
    updatedAttributes[soundexAttrIndex] = {
      ...updatedAttributes[soundexAttrIndex],
      value: soundexValue,
    };
  } else {
    // Add new Soundex attribute
    updatedAttributes = [
      ...existingAttributes,
      {
        attribute: ATTRIBUTE_UIDS.SOUNDEX_NAME,
        valueType: "TEXT",
        value: soundexValue,
      },
    ];
  }

  return {
    ...trackedEntity, // Keep all existing data from the tracked entity
    attributes: updatedAttributes, // Replace attributes with updated version
  };
}

/**
 * Send batch update to server
 */
async function sendBatchUpdate(trackedEntities) {
  if (trackedEntities.length === 0) {
    console.log("\n⚠️  No tracked entities to update");
    return { success: 0, failed: 0 };
  }

  const payload = {
    trackedEntities: trackedEntities,
  };

  const url = `${BASE_URL}/api/tracker?async=false&importStrategy=UPDATE`;

  try {
    console.log(`\n📤 Sending batch update for ${trackedEntities.length} tracked entities...`);
    const response = await makeRequest(url, "POST", payload);

    console.log("Response:", JSON.stringify(response, null, 2));

    // Check for errors in response
    if (response.status === "ERROR") {
      console.error("❌ Batch update failed:", JSON.stringify(response.validationReport || response, null, 2));
      return { success: 0, failed: trackedEntities.length };
    }

    const stats = response.stats || {};
    const updated = stats.updated || 0;
    const ignored = stats.ignored || 0;
    const failed = trackedEntities.length - updated;

    console.log(`✅ Batch update completed: ${updated} updated, ${ignored} ignored, ${failed} failed`);

    return { success: updated, failed: failed };
  } catch (error) {
    console.error(`❌ Failed to send batch update:`, error.message);
    return { success: 0, failed: trackedEntities.length };
  }
}

/**
 * Process a single tracked entity
 * Returns the prepared update or null if should be skipped
 */
function processTrackedEntity(trackedEntity, index, total) {
  const teiId = trackedEntity.trackedEntity;

  try {
    const soundexData = generateSoundexName(trackedEntity);

    // Skip if no name data
    if (!soundexData.names.firstname && !soundexData.names.lastname) {
      console.log(`  ⏭️  [${index + 1}/${total}] Skipping TEI ${teiId} - No name data`);
      stats.totalSkipped++;
      return null;
    }

    // Check if already has the same Soundex value
    const existingSoundex = getAttributeValue(trackedEntity, ATTRIBUTE_UIDS.SOUNDEX_NAME);
    if (existingSoundex === soundexData.combinedSoundex) {
      console.log(`  ⏭️  [${index + 1}/${total}] Skipping TEI ${teiId} - Already up to date`);
      stats.totalSkipped++;
      return null;
    }

    const fullName = [
      soundexData.names.firstname,
      soundexData.names.middlename,
      soundexData.names.lastname,
      soundexData.names.extname,
    ]
      .filter(Boolean)
      .join(" ");

    console.log(`  🔄 [${index + 1}/${total}] Preparing TEI ${teiId}`);
    console.log(`     Name: ${fullName}`);
    console.log(`     Soundex: ${soundexData.combinedSoundex}`);

    // Prepare the update (don't send yet)
    const preparedUpdate = prepareTrackedEntityUpdate(trackedEntity, soundexData.combinedSoundex);
    return preparedUpdate;
  } catch (error) {
    console.error(`  ❌ [${index + 1}/${total}] Error processing TEI ${teiId}:`, error.message);
    stats.totalFailed++;
    return null;
  }
}

/**
 * Process all tracked entities with paging
 */
async function processAllTrackedEntities() {
  console.log("🚀 Starting Soundex Name Update Process");
  console.log("========================================");
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Username: ${USERNAME}`);
  console.log(`Page Size: ${PAGE_SIZE}`);
  console.log("========================================\n");

  let currentPage = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    try {
      // Check page limit
      if (TOTAL_PAGES_LIMIT && currentPage > TOTAL_PAGES_LIMIT) {
        console.log(`\n⚠️  Reached page limit (${TOTAL_PAGES_LIMIT}). Stopping.`);
        break;
      }

      // Fetch page
      const response = await fetchTrackedEntities(currentPage);
      const trackedEntities = response.instances || [];

      console.log(
        `📊 Page ${currentPage}/${response.pageCount || "?"}: Found ${trackedEntities.length} tracked entities`,
      );
      console.log(`   Total in system: ${response.total || "unknown"}`);

      stats.totalFetched += trackedEntities.length;

      // Collect updates for this page only
      const pagePreparedUpdates = [];

      // Process each tracked entity in this page
      for (let i = 0; i < trackedEntities.length; i++) {
        const preparedUpdate = processTrackedEntity(trackedEntities[i], i, trackedEntities.length);
        if (preparedUpdate) {
          pagePreparedUpdates.push(preparedUpdate);
        }
      }

      // Send batch update for this page
      if (pagePreparedUpdates.length > 0) {
        console.log(`\n   📦 Prepared ${pagePreparedUpdates.length} updates for this page`);

        const result = await sendBatchUpdate(pagePreparedUpdates);
        stats.totalUpdated += result.success;
        stats.totalFailed += result.failed;
      } else {
        console.log(`\n   ⚠️  No updates needed for this page`);
      }

      // Check if there are more pages
      hasMorePages = response.page < response.pageCount;

      if (hasMorePages) {
        currentPage++;
        console.log(`\n⏭️  Moving to next page (${currentPage})...\n`);
      } else {
        console.log(`\n✅ All pages processed!`);
      }
    } catch (error) {
      console.error(`\n❌ Error processing page ${currentPage}:`, error.message);
      console.log("⚠️  Stopping process due to error.");
      break;
    }
  }

  // Print final statistics
  const elapsedTime = ((Date.now() - stats.startTime) / 1000).toFixed(2);

  console.log("\n========================================");
  console.log("📊 FINAL STATISTICS");
  console.log("========================================");
  console.log(`Total Fetched:  ${stats.totalFetched}`);
  console.log(`Total Updated:  ${stats.totalUpdated} ✅`);
  console.log(`Total Skipped:  ${stats.totalSkipped} ⏭️`);
  console.log(`Total Failed:   ${stats.totalFailed} ❌`);
  console.log(`Elapsed Time:   ${elapsedTime}s`);
  console.log("========================================\n");
}

// Validate environment variables
if (!USERNAME || !PASSWORD) {
  console.error("❌ Error: Missing credentials in .env file");
  console.error("Please set VITE_USERNAME and VITE_PASSWORD in .env");
  process.exit(1);
}

// Run the script
processAllTrackedEntities()
  .then(() => {
    console.log("✅ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
