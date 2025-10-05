/**
 * Soundex Algorithm Implementation
 *
 * Soundex is a phonetic algorithm for indexing names by sound, as pronounced in English.
 * The goal is for homophones to be encoded to the same representation so that they can be matched
 * despite minor differences in spelling.
 *
 * The algorithm produces a character string which identifies a set of names that are
 * (roughly) phonetically alike or sound (roughly) equivalent.
 */

/**
 * Generate Soundex code for a single name
 * @param {string} name - The name to encode
 * @returns {string} - 4-character Soundex code (e.g., "S530")
 */
const generateSoundexCode = (name) => {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "0000";
  }

  // Convert to uppercase and remove non-alphabetic characters
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, "");

  if (cleanName.length === 0) {
    return "0000";
  }

  // Keep the first letter
  let soundex = cleanName[0];

  // Soundex character mapping
  const soundexMap = {
    B: "1",
    F: "1",
    P: "1",
    V: "1",
    C: "2",
    G: "2",
    J: "2",
    K: "2",
    Q: "2",
    S: "2",
    X: "2",
    Z: "2",
    D: "3",
    T: "3",
    L: "4",
    M: "5",
    N: "5",
    R: "6",
  };

  // Process remaining characters
  let previousCode = soundexMap[cleanName[0]] || "0";

  for (let i = 1; i < cleanName.length && soundex.length < 4; i++) {
    const char = cleanName[i];
    const code = soundexMap[char];

    // Skip vowels (A, E, I, O, U) and consonants H, W, Y
    if (!code) {
      previousCode = "0";
      continue;
    }

    // Add code only if it's different from the previous code
    if (code !== previousCode) {
      soundex += code;
      previousCode = code;
    }
  }

  // Pad with zeros to ensure 4 characters
  while (soundex.length < 4) {
    soundex += "0";
  }

  return soundex.substring(0, 4);
};

/**
 * Generate Soundex codes for all name components
 * @param {Object} params - Name parameters
 * @param {string} params.firstname - First name
 * @param {string} params.middlename - Middle name
 * @param {string} params.lastname - Last name
 * @param {string} params.extname - Extension name (e.g., Jr., Sr., III)
 * @returns {Object} - Object containing Soundex codes for each name component
 */
export const generateSoundex = ({ firstname, middlename, lastname, extname }) => {
  return {
    firstname: generateSoundexCode(firstname),
    middlename: generateSoundexCode(middlename),
    lastname: generateSoundexCode(lastname),
    extname: generateSoundexCode(extname),
  };
};

/**
 * Generate a combined Soundex code from all name components
 * @param {Object} params - Name parameters
 * @param {string} params.firstname - First name
 * @param {string} params.middlename - Middle name
 * @param {string} params.lastname - Last name
 * @param {string} params.extname - Extension name
 * @returns {string} - Combined Soundex code (e.g., "J500-M200-S530-J500")
 */
export const generateCombinedSoundex = ({ firstname, middlename, lastname, extname }) => {
  const codes = generateSoundex({ firstname, middlename, lastname, extname });
  return `${codes.lastname}-${codes.firstname}-${codes.middlename}-${codes.extname}`;
};

/**
 * Compare two Soundex codes character by character and generate binary representation
 * @param {string} code1 - First Soundex code (e.g., "C235")
 * @param {string} code2 - Second Soundex code (e.g., "C223")
 * @returns {string} - Binary string where 1 = match, 0 = no match
 */
function compareSoundexCodes(code1, code2) {
  let binary = "";
  const maxLength = Math.max(code1.length, code2.length);

  for (let i = 0; i < maxLength; i++) {
    const char1 = code1[i] || "0";
    const char2 = code2[i] || "0";
    binary += char1 === char2 ? "1" : "0";
  }

  return binary;
}

/**
 * Compare two names using Soundex algorithm
 * @param {Object} name1 - First name object
 * @param {Object} name2 - Second name object
 * @returns {Object} - Comparison results with match scores
 */
function compareSoundex(name1, name2) {
  const soundex1 = generateSoundex(name1.firstname, name1.middlename, name1.lastname, name1.extname);
  const soundex2 = generateSoundex(name2.firstname, name2.middlename, name2.lastname, name2.extname);

  // Create concatenated codes: firstname + middlename + lastname + extname
  const combined1 = soundex1.firstname + soundex1.middlename + soundex1.lastname + soundex1.extname;
  const combined2 = soundex2.firstname + soundex2.middlename + soundex2.lastname + soundex2.extname;

  // Generate binary comparison
  const binaryComparison = compareSoundexCodes(combined1, combined2);

  // Count matches
  const matches = (binaryComparison.match(/1/g) || []).length;
  const total = binaryComparison.length;
  const percentage = Math.round((matches / total) * 100);

  return {
    firstname: soundex1.firstname === soundex2.firstname,
    middlename: soundex1.middlename === soundex2.middlename,
    lastname: soundex1.lastname === soundex2.lastname,
    extname: soundex1.extname === soundex2.extname,
    fullMatch:
      soundex1.firstname === soundex2.firstname &&
      soundex1.middlename === soundex2.middlename &&
      soundex1.lastname === soundex2.lastname &&
      soundex1.extname === soundex2.extname,
    soundex1,
    soundex2,
    combined1,
    combined2,
    binaryComparison,
    matches,
    total,
    percentage,
  };
}

/**
 * Calculate similarity score between two names (0-100)
 * @param {Object} name1 - First name object
 * @param {Object} name2 - Second name object
 * @returns {number} - Similarity score (0-100)
 */
export const calculateSimilarityScore = (name1, name2) => {
  const comparison = compareSoundex(name1, name2);
  let matches = 0;
  let total = 0;

  if (name1.firstname && name2.firstname) {
    total++;
    if (comparison.firstname) matches++;
  }
  if (name1.middlename && name2.middlename) {
    total++;
    if (comparison.middlename) matches++;
  }
  if (name1.lastname && name2.lastname) {
    total++;
    if (comparison.lastname) matches++;
  }
  if (name1.extname && name2.extname) {
    total++;
    if (comparison.extname) matches++;
  }

  return total > 0 ? Math.round((matches / total) * 100) : 0;
};

/**
 * Check if two names are phonetically similar
 * @param {Object} name1 - First name object
 * @param {Object} name2 - Second name object
 * @param {number} threshold - Minimum similarity threshold (0-100), default 75
 * @returns {boolean} - True if names are similar above threshold
 */
export const areSimilarNames = (name1, name2, threshold = 75) => {
  const score = calculateSimilarityScore(name1, name2);
  return score >= threshold;
};

export default {
  generateSoundex,
  generateCombinedSoundex,
  compareSoundex,
  calculateSimilarityScore,
  areSimilarNames,
};
