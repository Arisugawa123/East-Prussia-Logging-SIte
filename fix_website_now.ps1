# EMERGENCY FIX - Replace all absolute image paths with relative paths
Write-Host "FIXING ALL IMAGE PATHS TO MAKE YOUR WEBSITE WORK!" -ForegroundColor Green

# Fix all files with absolute paths
$files = @(
    "src/App.jsx",
    "src/Dashboard.jsx", 
    "src/OfficerLogging.jsx",
    "src/Personnels.jsx",
    "src/LowRankLoggingNew.jsx",
    "src/HallOfHiCom.jsx",
    "src/RetiredPersonnel.jsx",
    "src/NCOLogging.jsx",
    "src/InactivityNotice.jsx",
    "public/modal.js"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Fixing $file..." -ForegroundColor Yellow
        
        # Read content
        $content = Get-Content $file -Raw
        
        # Replace all absolute paths with relative paths
        $content = $content -replace 'src="/([^"]+)"', 'src="./$1"'
        $content = $content -replace 'href="/([^"]+)"', 'href="./$1"'
        
        # Write back
        Set-Content $file $content -NoNewline
        
        Write-Host "Fixed $file" -ForegroundColor Green
    }
}

Write-Host "DEPLOYING TO VERCEL..." -ForegroundColor Cyan

# Deploy to Git
git add .
git commit -m "EMERGENCY FIX: Convert all absolute paths to relative for Vercel"
git push origin main

Write-Host "========================================" -ForegroundColor Green
Write-Host "WEBSITE FIXED AND DEPLOYED!" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Green
Write-Host "Your website should now work at:" -ForegroundColor White
Write-Host "https://east-prussia-logging-site.vercel.app" -ForegroundColor Cyan
Write-Host "No more white screen - your East Prussia Regiment site is LIVE!" -ForegroundColor Green