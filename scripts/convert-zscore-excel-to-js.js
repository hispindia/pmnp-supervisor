/**
 * Script to convert WHO Z-score Excel data to JSON format
 *
 * Processes multiple Excel files:
 * - WFA (Weight-for-Age) Girls and Boys
 * - HFA (Height-for-Age) Girls and Boys
 *
 * Expected Excel format:
 * Column A: Age (days)
 * Column F-L: Z-scores (-3SD, -2SD, -1SD, Median, +1SD, +2SD, +3SD)
 */

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Define the files to process
const filesToProcess = [
  {
    filename: "wfa-girls-zscore-expanded-tables.xlsx",
    mapName: "femaleMapWFA",
    description: "Weight-for-Age (Girls)",
  },
  {
    filename: "wfa-boys-zscore-expanded-tables.xlsx",
    mapName: "maleMapWFA",
    description: "Weight-for-Age (Boys)",
  },
  {
    filename: "lhfa-girls-zscore-expanded-tables.xlsx",
    mapName: "femaleMapHFA",
    description: "Height-for-Age (Girls)",
  },
  {
    filename: "lhfa-boys-zscore-expanded-tables.xlsx",
    mapName: "maleMapHFA",
    description: "Height-for-Age (Boys)",
  },
];

function processExcelFile(filename, mapName, description) {
  console.log("\n" + "=".repeat(80));
  console.log(`Processing: ${description}`);
  console.log(`File: ${filename}`);
  console.log("=".repeat(80));

  const excelFilePath = path.join(__dirname, filename);

  try {
    // Read the Excel file
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    console.log(`Total rows in Excel: ${data.length}`);

    // Build the map object with age in days as key
    const zScoreMap = {};

    // Extract data from columns F to L (indices 5 to 11 in 0-indexed)
    // Column F = index 5 (-3SD)
    // Column G = index 6 (-2SD)
    // Column H = index 7 (-1SD)
    // Column I = index 8 (Median)
    // Column J = index 9 (+1SD)
    // Column K = index 10 (+2SD)
    // Column L = index 11 (+3SD)

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row && row.length >= 12) {
        const ageInDays = row[0]; // Age in days

        if (ageInDays !== undefined && ageInDays !== null) {
          const zScores = [
            parseFloat(row[5]), // Column F: -3SD
            parseFloat(row[6]), // Column G: -2SD
            parseFloat(row[7]), // Column H: -1SD
            parseFloat(row[8]), // Column I: Median
            parseFloat(row[9]), // Column J: +1SD
            parseFloat(row[10]), // Column K: +2SD
            parseFloat(row[11]), // Column L: +3SD
          ];

          zScoreMap[ageInDays] = zScores;
        }
      }
    }

    console.log(`Total days processed: ${Object.keys(zScoreMap).length}`);
    console.log(
      `Age range: ${Math.min(...Object.keys(zScoreMap).map(Number))} to ${Math.max(...Object.keys(zScoreMap).map(Number))} days`,
    );

    // Generate JavaScript code with proper formatting
    let jsCode = `const ${mapName} = {\n`;

    const sortedDays = Object.keys(zScoreMap)
      .map(Number)
      .sort((a, b) => a - b);

    for (const day of sortedDays) {
      const values = zScoreMap[day].map((v) => v.toString()).join(", ");
      jsCode += `  ${day}: [${values}],\n`;
    }

    jsCode += "};";

    console.log("\nGenerated JavaScript Code (first 5 entries):");
    const preview = jsCode.split("\n").slice(0, 7).join("\n");
    console.log(preview);
    console.log("...");

    // Save to JS file
    const outputJsPath = path.join(__dirname, `${mapName}-generated.js`);
    fs.writeFileSync(outputJsPath, jsCode);
    console.log(`\nSaved JavaScript to: ${outputJsPath}`);

    console.log(`Total entries: ${Object.keys(zScoreMap).length}`);

    return zScoreMap;
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
    return null;
  }
}

// Main execution
console.log("WHO Z-Score Excel to JavaScript Converter");
console.log("==========================================\n");

const allMaps = {};

for (const fileConfig of filesToProcess) {
  const result = processExcelFile(fileConfig.filename, fileConfig.mapName, fileConfig.description);
  if (result) {
    allMaps[fileConfig.mapName] = result;
  }
}

// Generate a combined file with all maps
console.log("\n" + "=".repeat(80));
console.log("Generating combined file...");
console.log("=".repeat(80));

let combinedJs = "// WHO Z-Score Maps - Auto-generated\n";
combinedJs += "// Generated on: " + new Date().toISOString() + "\n\n";

for (const fileConfig of filesToProcess) {
  if (allMaps[fileConfig.mapName]) {
    const mapName = fileConfig.mapName;
    combinedJs += `// ${fileConfig.description}\n`;
    combinedJs += `const ${mapName} = {\n`;

    const sortedDays = Object.keys(allMaps[mapName])
      .map(Number)
      .sort((a, b) => a - b);

    for (const day of sortedDays) {
      const values = allMaps[mapName][day].map((v) => v.toString()).join(", ");
      combinedJs += `  ${day}: [${values}],\n`;
    }

    combinedJs += "};\n\n";
  }
}

combinedJs += "// Export all maps\n";
combinedJs += "module.exports = {\n";
for (const fileConfig of filesToProcess) {
  if (allMaps[fileConfig.mapName]) {
    combinedJs += `  ${fileConfig.mapName},\n`;
  }
}
combinedJs += "};\n";

const combinedOutputPath = path.join(__dirname, "all-zscore-maps-generated.js");
fs.writeFileSync(combinedOutputPath, combinedJs);
console.log(`\nSaved combined file to: ${combinedOutputPath}`);

console.log("\n" + "=".repeat(80));
console.log("Conversion completed successfully!");
console.log("=".repeat(80));
console.log(`\nGenerated files:`);
for (const fileConfig of filesToProcess) {
  if (allMaps[fileConfig.mapName]) {
    console.log(`  - ${fileConfig.mapName}-generated.js`);
  }
}
console.log(`  - all-zscore-maps-generated.js (combined)`);
