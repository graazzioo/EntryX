# ============================================================
# EntryX — простой статический HTTP-сервер для разработки
# Запуск:  powershell -ExecutionPolicy Bypass -File server.ps1
# Сайт:    http://127.0.0.1:8000/
# ============================================================

$port = 8000
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "Serving $root at http://127.0.0.1:$port/ (Ctrl+C to stop)"

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $local = [Uri]::UnescapeDataString($ctx.Request.Url.LocalPath).TrimStart('/')
    if ($local -eq '') { $local = 'index.html' }

    $full = [System.IO.Path]::GetFullPath((Join-Path $root $local))

    # Защита от выхода за пределы корня
    if (-not $full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
      $ctx.Response.StatusCode = 403
      $ctx.Response.Close()
      continue
    }

    if (Test-Path $full -PathType Container) {
      $full = Join-Path $full 'index.html'
    }

    if (Test-Path $full) {
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $ext = [System.IO.Path]::GetExtension($full).ToLower()

      $mime = switch ($ext) {
        '.html'  { 'text/html; charset=utf-8' }
        '.css'   { 'text/css; charset=utf-8' }
        '.js'    { 'application/javascript; charset=utf-8' }
        '.json'  { 'application/json; charset=utf-8' }
        '.svg'   { 'image/svg+xml' }
        '.woff2' { 'font/woff2' }
        '.png'   { 'image/png' }
        '.jpg'   { 'image/jpeg' }
        '.webp'  { 'image/webp' }
        default  { 'application/octet-stream' }
      }

      $ctx.Response.ContentType = $mime
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
    }
  } catch {
    $ctx.Response.StatusCode = 500
  } finally {
    $ctx.Response.Close()
  }
}