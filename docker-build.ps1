# Script de build Docker pour Refine Admin (Windows PowerShell)
# Usage: .\docker-build.ps1 [production|development]

param(
    [string]$Mode = "production"
)

Write-Host "🐳 Build Docker pour le mode: $Mode" -ForegroundColor Green

# Fonction de log avec couleurs
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
    exit 1
}

# Vérification des variables d'environnement
# Chargement automatique depuis .env.production si il existe
if (Test-Path ".env.production") {
    Write-Log "Chargement des variables depuis .env.production..."
    Get-Content ".env.production" | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "✓ Variable chargée: $name" -ForegroundColor Gray
        }
    }
}

if (-not $env:VITE_SUPABASE_URL) {
    Write-Warning "VITE_SUPABASE_URL n'est pas définie"
}

if (-not $env:VITE_SUPABASE_ANNON_KEY) {
    Write-Warning "VITE_SUPABASE_ANNON_KEY n'est pas définie"
}

# Tag de l'image
$TAG = "refine-admin:$Mode"

Write-Log "Nettoyage des images existantes..."
try {
    docker rmi $TAG 2>$null
}
catch {
    # Ignore if image doesn't exist
}

Write-Log "Construction de l'image Docker..."
$buildArgs = @(
    "build"
    "--build-arg", "VITE_SUPABASE_URL=$env:VITE_SUPABASE_URL"
    "--build-arg", "VITE_SUPABASE_ANNON_KEY=$env:VITE_SUPABASE_ANNON_KEY"
    "-t", $TAG
    "."
)

& docker @buildArgs

if ($LASTEXITCODE -eq 0) {
    Write-Log "✅ Image construite avec succès: $TAG"
    
    # Affichage des informations sur l'image
    Write-Host ""
    Write-Log "Informations sur l'image:"
    docker images $TAG --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"
    
    Write-Host ""
    Write-Log "Pour démarrer l'application:"
    Write-Host "docker run -p 3000:3000 $TAG" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Log "Pour démarrer avec des variables d'environnement:"
    Write-Host "docker run -p 3000:3000 -e VITE_SUPABASE_URL=`$env:VITE_SUPABASE_URL -e VITE_SUPABASE_ANNON_KEY=`$env:VITE_SUPABASE_ANNON_KEY $TAG" -ForegroundColor Cyan
    
}
else {
    Write-Error "❌ Échec de la construction de l'image"
}
