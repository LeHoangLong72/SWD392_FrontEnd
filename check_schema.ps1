$server = "LAPTOP-9G8TCILT\SQLEXPRESS"
$database = "DuolingoJP"

Write-Host "Checking Questions table schema..."

$sql = @"
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Questions'
ORDER BY ORDINAL_POSITION
"@

try {
    $conn = New-Object System.Data.SqlClient.SqlConnection
    $conn.ConnectionString = "Server=$server;Database=$database;Trusted_Connection=true;TrustServerCertificate=true;"
    $conn.Open()
    
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $sql
    $reader = $cmd.ExecuteReader()
    
    Write-Host "`nQuestions Table Schema:"
    Write-Host "========================"
    while ($reader.Read()) {
        $col = $reader["COLUMN_NAME"]
        $type = $reader["DATA_TYPE"]
        $nullable = $reader["IS_NULLABLE"]
        Write-Host "$col ($type) - Nullable: $nullable"
    }
    
    $reader.Close()
    $conn.Close()
} catch {
    Write-Host "❌ Error:"
    Write-Host $_.Exception.Message
}
