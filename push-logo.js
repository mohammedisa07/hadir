const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting logo push process...\n');

try {
    // Check if logo file exists
    const logoPath = path.join(__dirname, 'public', 'logo.jpg');
    if (!fs.existsSync(logoPath)) {
        console.error('❌ Logo file not found at:', logoPath);
        process.exit(1);
    }
    console.log('✅ Logo file found');

    // Add logo to Git
    console.log('📝 Adding logo to Git...');
    execSync('git add public/logo.jpg', { stdio: 'inherit' });
    console.log('✅ Logo added to Git');

    // Commit the logo
    console.log('💾 Committing logo...');
    execSync('git commit -m "Add logo.jpg for receipt and cart display"', { stdio: 'inherit' });
    console.log('✅ Logo committed');

    // Push to GitHub
    console.log('🚀 Pushing to GitHub...');
    execSync('git push', { stdio: 'inherit' });
    console.log('✅ Logo pushed to GitHub successfully!');

    console.log('\n🎉 Logo has been successfully added to your repository!');
    console.log('The logo should now display in your Hadir\'s Cafe app.');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
} 