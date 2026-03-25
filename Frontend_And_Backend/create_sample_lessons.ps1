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
    
    if ($lessonCount -eq 0) {
        Write-Host "Creating sample Lesson..."
        
        # Create a lesson with parameterized query to avoid encoding issues
        $cmd.CommandText = "INSERT INTO Lessons (LessonName, BaseXP, QuestionType) VALUES (@name, @xp, @type)"
        $cmd.Parameters.AddWithValue("@name", "Hiragana Basic")
        $cmd.Parameters.AddWithValue("@xp", 50)
        $cmd.Parameters.AddWithValue("@type", "Basic")
        $cmd.ExecuteNonQuery()
        Write-Host "Lesson created"
        
        # Get the new lesson ID
        $cmd.CommandText = "SELECT @@IDENTITY"
        $lessonId = $cmd.ExecuteScalar()
        Write-Host "Lesson ID: $lessonId"
        
        # Create 5 sample questions
        $cmd.Parameters.Clear()
        for ($i = 1; $i -le 5; $i++) {
            $qtext = "Question $i"
            $cmd.CommandText = "INSERT INTO Questions (LessonId, Content, OrderIndex, QuestionType) VALUES (@lid, @content, @order, @type)"
            $cmd.Parameters.Clear()
            $cmd.Parameters.AddWithValue("@lid", $lessonId)
            $cmd.Parameters.AddWithValue("@content", $qtext)
            $cmd.Parameters.AddWithValue("@order", $i)
            $cmd.Parameters.AddWithValue("@type", "Multiple Choice")
            $cmd.ExecuteNonQuery()
        }
        Write-Host "Questions created"
    } else {
        Write-Host "Lessons already exist"
    }
    
    $conn.Close()
    Write-Host "Done!"
} Catch {
    Write-Host "Error: $($_.Exception.Message)"
}
