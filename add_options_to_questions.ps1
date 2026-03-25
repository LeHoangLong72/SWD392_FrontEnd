$server = "LAPTOP-9G8TCILT\SQLEXPRESS"
$database = "DuolingoJP"

Try {
    $conn = New-Object System.Data.SqlClient.SqlConnection
    $conn.ConnectionString = "Server=$server;Database=$database;Trusted_Connection=true;TrustServerCertificate=true;"
    $conn.Open()
    
    Write-Host "Checking questions without options..`n"
    
    # Find questions without options
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = @"
SELECT q.QuestionId, q.Content, COUNT(o.OptionId) as OptionCount
FROM Questions q
LEFT JOIN QuestionOptions o ON q.QuestionId = o.QuestionId
GROUP BY q.QuestionId, q.Content
HAVING COUNT(o.OptionId) = 0
ORDER BY q.QuestionId
"@
    
    $reader = $cmd.ExecuteReader()
    $questionsWithoutOptions = @()
    while ($reader.Read()) {
        $questionsWithoutOptions += @{
            id = $reader["QuestionId"]
            content = $reader["Content"]
        }
        Write-Host "Found question without options: ID $($reader['QuestionId']) - $($reader['Content'])"
    }
    $reader.Close()
    
    Write-Host "`nAdding options to questions...`n"
    
    foreach ($q in $questionsWithoutOptions) {
        Write-Host "Adding options to Question $($q.id)..."
        
        # Create 4 sample options (1 correct, 3 wrong)
        $options = @(
            @{text="Option A"; correct=$true},
            @{text="Option B"; correct=$false},
            @{text="Option C"; correct=$false},
            @{text="Option D"; correct=$false}
        )
        
        foreach ($i in 0..($options.Count - 1)) {
            $cmd.CommandText = "INSERT INTO QuestionOptions (QuestionId, OptionText, IsCorrect) VALUES (@qid, @text, @correct)"
            $cmd.Parameters.Clear()
            $cmd.Parameters.AddWithValue("@qid", $q.id)
            $cmd.Parameters.AddWithValue("@text", $options[$i].text)
            $cmd.Parameters.AddWithValue("@correct", $options[$i].correct)
            $cmd.ExecuteNonQuery()
        }
        Write-Host "  ✅ Added 4 options"
    }
    
    Write-Host "`n✅ Done! All questions now have options"
    
    $conn.Close()
} Catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
}
