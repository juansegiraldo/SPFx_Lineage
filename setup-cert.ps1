# Script para configurar certificados de desarrollo SPFx
Write-Host "Configurando certificados de desarrollo para SPFx..."

# Navegar al directorio del proyecto
Set-Location "D:\Users\juan.giraldo\Desktop\CodingCamp\LineageSPFx\data-lineage-spfx"

# Intentar generar el certificado
Write-Host "Generando certificado de desarrollo..."
gulp trust-dev-cert

if ($LASTEXITCODE -eq 0) {
    Write-Host "Certificado configurado correctamente"
    Write-Host "Ahora puedes ejecutar: gulp serve-deprecated --nobrowser"
} else {
    Write-Host "Error configurando certificado. Intenta ejecutar PowerShell como administrador"
    Write-Host "O ejecuta manualmente: gulp trust-dev-cert"
}
