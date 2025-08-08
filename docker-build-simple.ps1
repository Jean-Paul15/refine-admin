# Script PowerShell simple pour construire l'image Refine Admin
Write-Host "🚀 Construction de l'image Refine Admin..." -ForegroundColor Cyan

# Chargement des variables d'environnement depuis .env.production
if (Test-Path ".env.production") {
    Write-Host "📄 Chargement des variables depuis .env.production..." -ForegroundColor Green
    $envContent = Get-Content ".env.production"
    foreach ($line in $envContent) {
        if ($line -match "^([^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "✓ $name chargée" -ForegroundColor Gray
        }
    }
}
else {
    Write-Host "⚠️ Fichier .env.production non trouvé" -ForegroundColor Yellow
}

# Vérification des variables
if ($env:VITE_SUPABASE_URL) {
    Write-Host "✅ VITE_SUPABASE_URL: $($env:VITE_SUPABASE_URL)" -ForegroundColor Green
}
else {
    Write-Host "❌ VITE_SUPABASE_URL manquante" -ForegroundColor Red
}

if ($env:VITE_SUPABASE_ANNON_KEY) {
    Write-Host "✅ VITE_SUPABASE_ANNON_KEY: présente" -ForegroundColor Green
}
else {
    Write-Host "❌ VITE_SUPABASE_ANNON_KEY manquante" -ForegroundColor Red
}

# Construction de l'image
Write-Host "🔨 Construction de l'image Docker..." -ForegroundColor Cyan
docker build `
    --build-arg VITE_SUPABASE_URL="$env:VITE_SUPABASE_URL" `
    --build-arg VITE_SUPABASE_ANNON_KEY="$env:VITE_SUPABASE_ANNON_KEY" `
    -t refine-admin:latest `
    .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Image construite avec succès!" -ForegroundColor Green
    Write-Host "🌐 Pour lancer l'application:" -ForegroundColor Yellow
    Write-Host "docker run -p 3000:3000 -d refine-admin:latest" -ForegroundColor Cyan
}
else {
    Write-Host "❌ Erreur lors de la construction" -ForegroundColor Red
    exit 1
}
