$server = "LAPTOP-9G8TCILT\SQLEXPRESS"
$database = "DuolingoJP"

Try {
    $conn = New-Object System.Data.SqlClient.SqlConnection
    $conn.ConnectionString = "Server=$server;Database=$database;Trusted_Connection=true;TrustServerCertificate=true;"
    $conn.Open()
    
    # Check Lessons
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = "SELECT COUNT(*) FROM Lessons"
    $lessonCount = $cmd.ExecuteScalar()
    Write-Host "Lessons in DB: $lessonCount"
    
    # Check if Lesson ID 1 exists
    $cmd.CommandText = "SELECT LessonId, LessonName FROM Lessons WHERE LessonId = 1"
    $reader = $cmd.ExecuteReader()
    if ($reader.Read()) {
        Write-Host "✅ Lesson 1 exists: $($reader['LessonName'])"
    } else {
        Write-Host "❌ Lesson 1 NOT found"
        
        # Create a sample lesson
        Write-Host "`nCreating sample Lesson..."
        $reader.Close()
        
        # First check if we need a LessonName
        $cmd.CommandText = "INSERT INTO Lessons (LessonName, BaseXP, QuestionType) VALUES ('Hiragana cơ bản', 50, 'Basic')"
        $cmd.ExecuteNonQuery()
        Write-Host "✅ Lesson created"
        
        # Get the new ID
        $cmd.CommandText = "SELECT LessonId FROM Lessons WHERE LessonName = 'Hiragana cơ bản' ORDER BY LessonId DESC"
        $newId = $cmd.ExecuteScalar()
        Write-Host "New Lesson ID: $newId"
        
        # Create questions for this lesson
        $questions = @(
            ("Chữ あ đọc là gì?", 1),
            ("Chữ い đọc là gì?", 2),
            ("Chữ う đọc là gì?", 3),
            ("Chữ え đọc là gì?", 4),
            ("Chữ お đọc là gì?", 5)
        )
        
        foreach ($q in $questions) {
            $cmd.CommandText = "INSERT INTO Questions (LessonId, Content, OrderIndex, QuestionType) VALUES ($newId, '$($q[0])', $($q[1]), 'Multiple Choice')"
            $cmd.ExecuteNonQuery()
        }
        Write-Host "✅ Questions created"
    }
    
    $reader.Close()
    $conn.Close()
} Catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
}
