$baseDir = Get-Location
$pustakaDir = Join-Path $baseDir "Pustaka"
$outputSchedule = Join-Path $baseDir "App\data-schedule.json"

if (-not (Test-Path $pustakaDir)) {
    Write-Host "Error: Folder 'Pustaka' tidak ditemukan!" -ForegroundColor Red
    exit
}

$manifest = @{}

# Cari semua file di dalam folder Pustaka
$files = Get-ChildItem -Path $pustakaDir -Recurse -File

foreach ($file in $files) {
    if ($file.FullName -match '(\d{4}-\d{2}-\d{2})') {
        $dateStr = $Matches[1]
        
        if (-not $manifest.ContainsKey($dateStr)) {
            $relativeFolderPath = $file.DirectoryName.Replace($baseDir.Path, "").TrimStart('\', '/')
            $relativeFolderPath = $relativeFolderPath.Replace('\', '/')

            $pathParts = $relativeFolderPath.Split('/')
            $buku = "Pustaka"
            $minggu = "Umum"
            if ($pathParts.Count -ge 2) { $buku = $pathParts[1] }
            if ($pathParts.Count -ge 3) { $minggu = $pathParts[2] }

            $manifest[$dateStr] = @{
                buku        = $buku
                minggu      = $minggu
                hari        = $file.Directory.Name
                folder_path = $relativeFolderPath
                renungan    = ""
                audio       = ""
                video       = ""
            }
        }

        if ($file.Extension -in @('.html', '.htm', '.txt') -and $file.Name -notmatch '_S|_V') {
            $manifest[$dateStr].renungan = $file.Name
        }
        elseif ($file.Extension -in @('.m4a', '.mp3', '.wav', '.aac') -or $file.Name -match '_S') {
            $manifest[$dateStr].audio = $file.Name
        }
        elseif ($file.Extension -in @('.mp4', '.webm', '.mov') -or $file.Name -match '_V') {
            $manifest[$dateStr].video = $file.Name
        }
    }
}

# Simpan ke data-schedule.json
$jsonContent = $manifest | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($outputSchedule, $jsonContent, [System.Text.Encoding]::UTF8)

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "BERHASIL! Jadwal diperbarui: $outputSchedule" -ForegroundColor Green
Write-Host "Total Tanggal Terdaftar: $($manifest.Count) Hari" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green