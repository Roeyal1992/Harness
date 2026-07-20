# Harness stop hook — fires a capture reminder every N turns
$counterFile = 'c:\Users\roalfassi\OneDrive - Deloitte (O365D)\Studio\Harness\.claude\hooks\.turn-counter'
$threshold = 4

$n = if (Test-Path $counterFile) {
    [int]((Get-Content $counterFile -Raw).Trim()) + 1
} else {
    1
}

if ($n -ge $threshold) {
    $reminderFile = Join-Path (Split-Path $counterFile) 'capture-reminder.md'
    $message = if (Test-Path $reminderFile) { (Get-Content $reminderFile -Raw).Trim() } else { "Harness: run /self-improve to log friction, feedback, or a success." }
    @{ hookSpecificOutput = @{ additionalContext = $message } } | ConvertTo-Json -Compress
    Set-Content $counterFile 0
} else {
    Set-Content $counterFile $n
}
