import db from "../db";

export const TABLE_NAME = "importFile";
export const TABLE_FIELDS = "++id, fileName, importStatus, createdAt, updatedAt";

/**
 * ImportFile Table Schema:
 * ++id          INTEGER  PRIMARY KEY AUTOINCREMENT
 * fileName      TEXT     NOT NULL
 * importStatus  TEXT     NOT NULL DEFAULT 'processing'  // 'processing', 'completed', 'failed'
 * createdAt     TEXT     NOT NULL
 * updatedAt     TEXT     NULL
 */

// Status constants
export const IMPORT_STATUS = {
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
};

/**
 * Find a single import file by ID
 * @param {number} id - The import file ID
 * @returns {Promise<Object|undefined>} The import file record or undefined if not found
 */
export const findOne = async (id) => {
  try {
    return await db[TABLE_NAME].get(id);
  } catch (error) {
    console.error("Error finding import file:", error);
    return undefined;
  }
};

/**
 * Find all import files
 * @returns {Promise<Array>} Array of all import file records
 */
export const findAll = async () => {
  try {
    return await db[TABLE_NAME].toArray();
  } catch (error) {
    console.error("Error finding all import files:", error);
    return [];
  }
};

/**
 * Find import files by status
 * @param {string} status - The status to filter by
 * @returns {Promise<Array>} Array of import file records with the specified status
 */
export const findByStatus = async (status) => {
  try {
    return await db[TABLE_NAME].where("importStatus").equals(status).toArray();
  } catch (error) {
    console.error("Error finding import files by status:", error);
    return [];
  }
};

/**
 * Create a new import file record
 * @param {Object} params - The parameters for creating an import file
 * @param {string} params.fileName - The name of the imported file
 * @param {string} [params.importStatus='processing'] - The initial status of the import
 * @returns {Promise<number>} The ID of the created import file record
 */
export const createImportFile = async ({ fileName, importStatus = IMPORT_STATUS.PROCESSING }) => {
  try {
    if (!fileName) {
      throw new Error("fileName is required");
    }

    const id = await db[TABLE_NAME].add({
      fileName,
      importStatus,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    });

    console.log(`Import file record created with ID: ${id} for file: ${fileName}`);
    return id;
  } catch (error) {
    console.error("Error creating import file record:", error);
    throw error;
  }
};

/**
 * Update the status of an import file
 * @param {number} id - The import file ID
 * @param {string} importStatus - The new status ('processing', 'completed', 'failed')
 * @returns {Promise<void>}
 */
export const updateImportFileStatus = async (id, importStatus) => {
  try {
    if (!id) {
      throw new Error("Import file ID is required");
    }

    if (!Object.values(IMPORT_STATUS).includes(importStatus)) {
      throw new Error(
        `Invalid import status: ${importStatus}. Must be one of: ${Object.values(IMPORT_STATUS).join(", ")}`,
      );
    }

    const updateCount = await db[TABLE_NAME].update(id, {
      importStatus,
      updatedAt: new Date().toISOString(),
    });

    if (updateCount === 0) {
      console.warn(`No import file found with ID: ${id}`);
    } else {
      console.log(`Import file ${id} status updated to: ${importStatus}`);
    }
  } catch (error) {
    console.error("Error updating import file status:", error);
    throw error;
  }
};

/**
 * Get an import file by ID (alias for findOne for backward compatibility)
 * @param {number} id - The import file ID
 * @returns {Promise<Object|null>} The import file record or null if not found
 */
export const getImportFileById = async (id) => {
  try {
    const importFile = await findOne(id);
    return importFile || null;
  } catch (error) {
    console.error("Error getting import file:", error);
    return null;
  }
};

/**
 * Delete an import file by ID
 * @param {number} id - The import file ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export const deleteImportFile = async (id) => {
  try {
    if (!id) {
      throw new Error("Import file ID is required");
    }

    const deleteCount = await db[TABLE_NAME].delete(id);

    if (deleteCount === 0) {
      console.warn(`No import file found with ID: ${id}`);
      return false;
    } else {
      console.log(`Import file ${id} deleted successfully`);
      return true;
    }
  } catch (error) {
    console.error("Error deleting import file:", error);
    throw error;
  }
};

/**
 * Update an import file record
 * @param {number} id - The import file ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<boolean>} True if updated, false if not found
 */
export const updateImportFile = async (id, updates) => {
  try {
    if (!id) {
      throw new Error("Import file ID is required");
    }

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updateCount = await db[TABLE_NAME].update(id, updateData);

    if (updateCount === 0) {
      console.warn(`No import file found with ID: ${id}`);
      return false;
    } else {
      console.log(`Import file ${id} updated successfully`);
      return true;
    }
  } catch (error) {
    console.error("Error updating import file:", error);
    throw error;
  }
};

/**
 * Get import files created within a date range
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @returns {Promise<Array>} Array of import file records within the date range
 */
export const findByDateRange = async (startDate, endDate) => {
  try {
    return await db[TABLE_NAME].where("createdAt").between(startDate, endDate, true, true).toArray();
  } catch (error) {
    console.error("Error finding import files by date range:", error);
    return [];
  }
};

/**
 * Get import files by filename pattern
 * @param {string} pattern - The pattern to search for (case-insensitive)
 * @returns {Promise<Array>} Array of import file records matching the pattern
 */
export const findByFileNamePattern = async (pattern) => {
  try {
    const allFiles = await findAll();
    return allFiles.filter((file) => file.fileName.toLowerCase().includes(pattern.toLowerCase()));
  } catch (error) {
    console.error("Error finding import files by filename pattern:", error);
    return [];
  }
};

/**
 * Get statistics about import files
 * @returns {Promise<Object>} Statistics object with counts by status
 */
export const getImportFileStats = async () => {
  try {
    const allFiles = await findAll();
    const stats = {
      total: allFiles.length,
      processing: 0,
      completed: 0,
      failed: 0,
    };

    allFiles.forEach((file) => {
      if (stats.hasOwnProperty(file.importStatus)) {
        stats[file.importStatus]++;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error getting import file stats:", error);
    return { total: 0, processing: 0, completed: 0, failed: 0 };
  }
};

/**
 * Clear all import file records from the table
 * @returns {Promise<void>}
 */
export const clearTable = async () => {
  try {
    console.log("Clearing ImportFile table");
    await db[TABLE_NAME].clear();
    console.log("ImportFile table cleared successfully");
  } catch (error) {
    console.error("Error clearing ImportFile table:", error);
    throw error;
  }
};

/**
 * Bulk create import file records
 * @param {Array<Object>} importFiles - Array of import file objects
 * @returns {Promise<Array<number>>} Array of created import file IDs
 */
export const bulkCreateImportFiles = async (importFiles) => {
  try {
    if (!Array.isArray(importFiles) || importFiles.length === 0) {
      throw new Error("importFiles must be a non-empty array");
    }

    const now = new Date().toISOString();
    const recordsToCreate = importFiles.map((file) => ({
      fileName: file.fileName,
      importStatus: file.importStatus || IMPORT_STATUS.PROCESSING,
      createdAt: now,
      updatedAt: null,
    }));

    const ids = await db[TABLE_NAME].bulkAdd(recordsToCreate, { allKeys: true });
    console.log(`Bulk created ${ids.length} import file records`);
    return ids;
  } catch (error) {
    console.error("Error bulk creating import files:", error);
    throw error;
  }
};
