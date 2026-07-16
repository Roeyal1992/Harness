# Transcript Format Handling

## Preferred format

Plain UTF-8 `.txt` — readable directly with the Read tool, no conversion needed.

To produce this from a Word/Teams export:
- File → Save As → Plain Text
- In the encoding dialog, select **UTF-8**
- Teams transcript structure (speaker name / timestamp / speech) is preserved

---

## HTML with Windows-1255 encoding (Teams export default)

Teams exports Hebrew transcripts as `.htm` files encoded in Windows-1255. The Read tool will return garbled characters. Use PowerShell to decode:

```powershell
$path = "path\to\transcript.htm"
$enc = [System.Text.Encoding]::GetEncoding(1255)
$bytes = [System.IO.File]::ReadAllBytes($path)
$content = $enc.GetString($bytes)
$text = $content -replace '<[^>]+>', ' ' `
                 -replace '&quot;', '"' `
                 -replace '&amp;', '&' `
                 -replace '&#160;', ' ' `
                 -replace '\s+', ' '
$text | Out-File -FilePath "path\to\output.txt" -Encoding utf8
```

Run this for each transcript file, then read the resulting `.txt` files normally.

---

## PDF

Use the Read tool with `pages` parameter if the transcript is long (>10 pages requires explicit page ranges).

Hebrew RTL PDFs can have unreliable text extraction order. If extracted text appears scrambled or out of order, ask the operator to re-export as plain text instead.

---

## DOCX

The Read tool cannot read DOCX directly. Options:

1. Ask the operator to save as plain UTF-8 `.txt` (preferred)
2. If PowerShell is available:

```powershell
# Requires Word COM object — only works if Word is installed
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("path\to\transcript.docx")
$doc.SaveAs2("path\to\output.txt", 2)  # 2 = plain text
$doc.Close()
$word.Quit()
```

---

## Plain text with non-UTF-8 encoding

If a `.txt` file reads as garbled, it may be encoded in Windows-1255 or Windows-1252. Detect and convert:

```powershell
$bytes = [System.IO.File]::ReadAllBytes("path\to\file.txt")
$enc = [System.Text.Encoding]::GetEncoding(1255)  # or 1252 for Western European
$text = $enc.GetString($bytes)
$text | Out-File -FilePath "path\to\output-utf8.txt" -Encoding utf8
```
