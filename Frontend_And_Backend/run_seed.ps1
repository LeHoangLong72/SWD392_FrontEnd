$sqlFilePath = "d:\SWD392\Frontend_And_Backend\backend\DuolingoStyleJP\MyWebApiApp\Scripts\SeedLessonContent.sql"
$server = "LAPTOP-9G8TCILT\SQLEXPRESS"
$database = "DuolingoJP"

Write-Host "Reading SQL file..."
$sql = Get-Content -Path $sqlFilePath -Raw

Write-Host "Connecting to $database on $server..."

try {
    $conn = New-Object System.Data.SqlClient.SqlConnection
    $conn.ConnectionString = "Server=$server;Database=$database;Trusted_Connection=true;TrustServerCertificate=true;"
    $conn.Open()
    
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $sql
    $cmd.ExecuteNonQuery()
    
    Write-Host "✅ SQL seed script executed successfully!"
    
    $conn.Close()
} catch {
    Write-Host "❌ Error executing SQL script:"
    Write-Host $_.Exception.Message
}
