$server = "LAPTOP-9G8TCILT\SQLEXPRESS"
$database = "DuolingoJP"

Try {
    $conn = New-Object System.Data.SqlClient.SqlConnection
    $conn.ConnectionString = "Server=$server;Database=$database;Trusted_Connection=true;TrustServerCertificate=true;"
    $conn.Open()
    
    Write-Host "Checking lessons and their questions..`n"
    
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = @"
SELECT 
    l.LessonId, 
    l.LessonName, 
    COUNT(q.QuestionId) as QuestionCount
FROM Lessons l
LEFT JOIN Questions q ON l.LessonId = q.LessonId
GROUP BY l.LessonId, l.LessonName
ORDER BY l.LessonId
"@
    
    $reader = $cmd.ExecuteReader()
    while ($reader.Read()) {
        $id = $reader["LessonId"]
        $name = $reader["LessonName"]
        $qcount = $reader["QuestionCount"]
        $status = if ($qcount -eq 0) { "❌ NO DATA" } else { "✅ $qcount questions" }
        Write-Host "$id. $name - $status"
    }
    
    $reader.Close()
    
    # Now add questions to lessons that don't have any
    Write-Host "`nAdding questions to lessons without data..."
    
    $lessons = @(
        @{id=2; name="Katakana Basic"; questions=@("Chữ ア đọc là gì?", "Chữ イ đọc là gì?", "Chữ ウ đọc là gì?")},
        @{id=3; name="Basic Greetings"; questions=@("'Xin chào' trong tiếng Nhật là gì?", "'Tạm biệt' trong tiếng Nhật là gì?", "'Cảm ơn' trong tiếng Nhật là gì?")},
        @{id=4; name="Numbers"; questions=@("Số 1 trong tiếng Nhật là gì?", "Số 5 trong tiếng Nhật là gì?", "Số 10 trong tiếng Nhật là gì?")}
    )
    
    foreach ($lesson in $lessons) {
        # Check if lesson has questions
        $cmd.CommandText = "SELECT COUNT(*) FROM Questions WHERE LessonId = @lid"
        $cmd.Parameters.Clear()
        $cmd.Parameters.AddWithValue("@lid", $lesson.id)
        $count = $cmd.ExecuteScalar()
        
        if ($count -eq 0) {
            Write-Host "Adding questions to Lesson $($lesson.id)..."
            foreach ($i in 0..($lesson.questions.Count - 1)) {
                $cmd.CommandText = "INSERT INTO Questions (LessonId, Content, OrderIndex, QuestionType) VALUES (@lid, @content, @order, @type)"
                $cmd.Parameters.Clear()
                $cmd.Parameters.AddWithValue("@lid", $lesson.id)
                $cmd.Parameters.AddWithValue("@content", $lesson.questions[$i])
                $cmd.Parameters.AddWithValue("@order", $i + 1)
                $cmd.Parameters.AddWithValue("@type", "Multiple Choice")
                $cmd.ExecuteNonQuery()
            }
            Write-Host "  ✅ Added $($lesson.questions.Count) questions"
        }
    }
    
    $conn.Close()
    Write-Host "`n✅ Done!"
} Catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
}
