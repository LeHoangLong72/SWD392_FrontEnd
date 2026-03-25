$server = "LAPTOP-9G8TCILT\SQLEXPRESS"
$database = "DuolingoJP"

Try {
    $conn = New-Object System.Data.SqlClient.SqlConnection
    $conn.ConnectionString = "Server=$server;Database=$database;Trusted_Connection=true;TrustServerCertificate=true;"
    $conn.Open()
    
    Write-Host "Checking lessons without questions..`n"
    
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = @"
SELECT 
    l.LessonId, 
    l.LessonName, 
    COUNT(q.QuestionId) as QuestionCount
FROM Lessons l
LEFT JOIN Questions q ON l.LessonId = q.LessonId
GROUP BY l.LessonId, l.LessonName
HAVING COUNT(q.QuestionId) = 0
ORDER BY l.LessonId
"@
    
    $reader = $cmd.ExecuteReader()
    $emptyLessons = @()
    while ($reader.Read()) {
        $emptyLessons += @{
            id = $reader["LessonId"]
            name = $reader["LessonName"]
        }
        Write-Host "Found empty lesson: ID $($reader['LessonId']) - $($reader['LessonName'])"
    }
    $reader.Close()
    
    Write-Host "`nAdding sample questions to each empty lesson...`n"
    
    foreach ($lesson in $emptyLessons) {
        Write-Host "Adding questions to Lesson $($lesson.id) ($($lesson.name))..."
        
        $questions = @(
            "Question 1: What is this?",
            "Question 2: How do you say this?",
            "Question 3: Choose the correct answer"
        )
        
        foreach ($i in 0..($questions.Count - 1)) {
            $cmd.CommandText = "INSERT INTO Questions (LessonId, Content, OrderIndex, QuestionType) VALUES (@lid, @content, @order, @type)"
            $cmd.Parameters.Clear()
            $cmd.Parameters.AddWithValue("@lid", $lesson.id)
            $cmd.Parameters.AddWithValue("@content", $questions[$i])
            $cmd.Parameters.AddWithValue("@order", $i + 1)
            $cmd.Parameters.AddWithValue("@type", "Multiple Choice")
            $cmd.ExecuteNonQuery()
        }
        Write-Host "  ✅ Added $($questions.Count) questions"
    }
    
    Write-Host "`n✅ Done! All lessons now have questions"
    
    $conn.Close()
} Catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
}
