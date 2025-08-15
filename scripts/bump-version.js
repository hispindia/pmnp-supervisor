const fs = require('fs');
const path = require('path');

/**
 * Bumps version in package.json and manifest.webapp.json
 * Supports semver format (major.minor.patch)
 * @param {string} type - 'major', 'minor', or 'patch' (default)
 */

function bumpVersion(type = 'patch') {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const manifestPath = path.join(__dirname, '../manifest.webapp.json');
  
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Read manifest.webapp.json
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Parse current version from package.json
  const currentVersion = packageJson.version;
  const versionParts = currentVersion.split('.').map(Number);
  
  // Increment version based on type
  switch (type) {
    case 'major':
      versionParts[0] += 1;
      versionParts[1] = 0;
      versionParts[2] = 0;
      break;
    case 'minor':
      versionParts[1] += 1;
      versionParts[2] = 0;
      break;
    case 'patch':
    default:
      versionParts[2] += 1;
      break;
  }
  
  const newVersion = versionParts.join('.');
  
  // Update package.json
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  // Update manifest.webapp.json
  manifest.version = newVersion;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  
  console.log(`✅ Version bumped from ${currentVersion} to ${newVersion} (${type})`);
  console.log(`📦 Updated package.json: ${newVersion}`);
  console.log(`📱 Updated manifest.webapp.json: ${newVersion}`);
  
  return newVersion;
}

// If script is run directly (not imported)
if (require.main === module) {
  const type = process.argv[2] || 'patch';
  bumpVersion(type);
}

module.exports = bumpVersion;
