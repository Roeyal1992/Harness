# Harness stop hook — fires a capture reminder every N turns
$counterFile = 'c:\Users\roalfassi\OneDrive - Deloitte (O365D)\Studio\Harness\.claude\hooks\.turn-counter'
$threshold = 4

$n = if (Test-Path $counterFile) {
    [int]((Get-Content $counterFile -Raw).Trim()) + 1
} else {
    1
}

if ($n -ge $threshold) {
    Write-Host ''
    Write-Host 'Harness: anything worth capturing from recent turns? Run /self-improve to log friction, feedback, or a success.' -ForegroundColor Cyan
    Write-Host ''
    Set-Content $counterFile 0
} else {
    Set-Content $counterFile $n
}
