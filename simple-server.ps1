# Servidor HTTP simple para servir archivos estáticos
$port = 8080
$path = Get-Location

Write-Host "Iniciando servidor HTTP en puerto $port"
Write-Host "Directorio: $path"
Write-Host "URL: http://localhost:$port/data-lineage-viewer.html"
Write-Host "Presiona Ctrl+C para detener el servidor"

# Crear un listener HTTP
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "Servidor iniciado correctamente en http://localhost:$port"
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") {
            $localPath = "/data-lineage-viewer.html"
        }
        
        $filePath = Join-Path $path $localPath.TrimStart('/')
        
        if (Test-Path $filePath) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            
            # Determinar el tipo de contenido
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($extension) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css" { $response.ContentType = "text/css" }
                ".js" { $response.ContentType = "application/javascript" }
                ".json" { $response.ContentType = "application/json" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            $response.OutputStream.Write($content, 0, $content.Length)
            Write-Host "Servido: $localPath"
        } else {
            $response.StatusCode = 404
            $errorMessage = "Archivo no encontrado: $localPath"
            $errorBytes = [System.Text.Encoding]::UTF8.GetBytes($errorMessage)
            $response.ContentLength64 = $errorBytes.Length
            $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
            Write-Host "404: $localPath"
        }
        
        $response.Close()
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $listener.Stop()
    Write-Host "Servidor detenido"
}
