#!/usr/bin/env node

/**
 * Soundex Algorithm Script
 *
 * This script implements the Soundex phonetic algorithm for name matching.
 * It can be run from the command line or used as a module.
 *
 * Usage:
 *   node soundex.js "John" "Michael" "Smith" "Jr"
 *   node soundex.js --compare "John,Michael,Smith,Jr" "Jon,Michael,Smyth,Jr"
 */

/**
 * Generate Soundex code for a single name
 * @param {string} name - The name to encode
 * @returns {string} - 4-character Soundex code (e.g., "S530")
 */
function generateSoundexCode(name) {
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
}

/**
 * Generate Soundex codes for all name components
 * @param {string} firstname - First name
 * @param {string} middlename - Middle name
 * @param {string} lastname - Last name
 * @param {string} extname - Extension name (e.g., Jr., Sr., III)
 * @returns {Object} - Object containing Soundex codes for each name component
 */
function generateSoundex(firstname, middlename, lastname, extname) {
  return {
    firstname: generateSoundexCode(firstname),
    middlename: generateSoundexCode(middlename),
    lastname: generateSoundexCode(lastname),
    extname: generateSoundexCode(extname),
  };
}

/**
 * Generate a combined Soundex code from all name components
 * @param {string} firstname - First name
 * @param {string} middlename - Middle name
 * @param {string} lastname - Last name
 * @param {string} extname - Extension name
 * @returns {string} - Combined Soundex code (e.g., "S530-J500-M240-J600")
 */
function generateCombinedSoundex(firstname, middlename, lastname, extname) {
  const codes = generateSoundex(firstname, middlename, lastname, extname);
  return `${codes.lastname}-${codes.firstname}-${codes.middlename}-${codes.extname}`;
}

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
 * Compare two names using Soundex algorithm with binary character-by-character comparison
 * @param {Object} name1 - First name object with firstname, middlename, lastname, extname
 * @param {Object} name2 - Second name object
 * @returns {Object} - Comparison results with binary representation and match scores
 */
function compareSoundex(name1, name2) {
  const soundex1 = generateSoundex(name1.firstname, name1.middlename, name1.lastname, name1.extname);
  const soundex2 = generateSoundex(name2.firstname, name2.middlename, name2.lastname, name2.extname);

  // Create concatenated codes: lastname + firstname + middlename + extname
  const combined1 = soundex1.lastname + soundex1.firstname + soundex1.middlename + soundex1.extname;
  const combined2 = soundex2.lastname + soundex2.firstname + soundex2.middlename + soundex2.extname;

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
 * Calculate similarity score between two names (0-100) using binary comparison
 * @param {Object} name1 - First name object
 * @param {Object} name2 - Second name object
 * @returns {number} - Similarity score (0-100) based on character-by-character match
 */
function calculateSimilarityScore(name1, name2) {
  const comparison = compareSoundex(name1, name2);
  return comparison.percentage;
}

/**
 * Display help information
 */
function displayHelp() {
  console.log(`
Soundex Algorithm Script
========================

Usage:
  node soundex.js <firstname> <middlename> <lastname> <extname>
  node soundex.js --compare "firstname,middlename,lastname,extname" "firstname,middlename,lastname,extname"
  node soundex.js --help

Examples:
  # Generate Soundex codes for a name
  node soundex.js "John" "Michael" "Smith" "Jr"

  # Compare two names
  node soundex.js --compare "John,Michael,Smith,Jr" "Jon,Michael,Smyth,Jr"

Options:
  --compare   Compare two names using Soundex algorithm
  --help      Display this help message
`);
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    displayHelp();
    process.exit(0);
  }

  if (args[0] === "--compare") {
    if (args.length < 3) {
      console.error("Error: --compare requires two name arguments");
      console.error(
        'Usage: node soundex.js --compare "firstname,middlename,lastname,extname" "firstname,middlename,lastname,extname"',
      );
      process.exit(1);
    }

    const [fn1, mn1, ln1, en1] = args[1].split(",").map((s) => s.trim());
    const [fn2, mn2, ln2, en2] = args[2].split(",").map((s) => s.trim());

    const name1 = { firstname: fn1, middlename: mn1, lastname: ln1, extname: en1 };
    const name2 = { firstname: fn2, middlename: mn2, lastname: ln2, extname: en2 };

    const comparison = compareSoundex(name1, name2);
    const score = calculateSimilarityScore(name1, name2);

    console.log("\n=== Soundex Comparison Results ===\n");
    console.log("Name 1:", `${fn1} ${mn1} ${ln1} ${en1}`);
    console.log("Soundex 1:", comparison.soundex1);
    console.log("Combined 1:", comparison.combined1);
    console.log("\nName 2:", `${fn2} ${mn2} ${ln2} ${en2}`);
    console.log("Soundex 2:", comparison.soundex2);
    console.log("Combined 2:", comparison.combined2);
    console.log("\n=== Binary Comparison ===");
    console.log("Binary:", comparison.binaryComparison);
    console.log("Pattern:", comparison.binaryComparison.replace(/1/g, "✓").replace(/0/g, "✗"));
    console.log("Matches:", `${comparison.matches}/${comparison.total}`);
    console.log("\n=== Field Match Results ===");
    console.log("First Name Match:", comparison.firstname ? "✓" : "✗");
    console.log("Middle Name Match:", comparison.middlename ? "✓" : "✗");
    console.log("Last Name Match:", comparison.lastname ? "✓" : "✗");
    console.log("Extension Match:", comparison.extname ? "✓" : "✗");
    console.log("Full Match:", comparison.fullMatch ? "✓" : "✗");
    console.log("\nSimilarity Score:", `${score}%`);
  } else {
    if (args.length < 4) {
      console.error("Error: Please provide all 4 name components");
      console.error("Usage: node soundex.js <firstname> <middlename> <lastname> <extname>");
      process.exit(1);
    }

    const [firstname, middlename, lastname, extname] = args;
    const codes = generateSoundex(firstname, middlename, lastname, extname);
    const combined = generateCombinedSoundex(firstname, middlename, lastname, extname);

    console.log("\n=== Soundex Codes ===\n");
    console.log("Full Name:", `${firstname} ${middlename} ${lastname} ${extname}`);
    console.log("\nIndividual Codes:");
    console.log("  First Name:", `${firstname} → ${codes.firstname}`);
    console.log("  Middle Name:", `${middlename} → ${codes.middlename}`);
    console.log("  Last Name:", `${lastname} → ${codes.lastname}`);
    console.log("  Extension:", `${extname} → ${codes.extname}`);
    console.log("\nCombined Code:", combined);
  }
}

// Export functions for use as a module
module.exports = {
  generateSoundexCode,
  generateSoundex,
  generateCombinedSoundex,
  compareSoundexCodes,
  compareSoundex,
  calculateSimilarityScore,
};
