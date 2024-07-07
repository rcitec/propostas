<?php
// Dados de conexão ao banco de dados MySQL
$servername = "sql10.freemysqlhosting.net";
$username = "sql10718527";
$password = "CWDauKv7pR";
$dbname = "sql10718527";

// Conexão com o MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica se a conexão foi bem sucedida
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

// Exemplo de consulta SQL (substitua com sua lógica)
$sql = "SELECT id, username FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Exibindo os resultados
    while($row = $result->fetch_assoc()) {
        echo "ID: " . $row["id"]. " - Usuário: " . $row["username"]. "<br>";
    }
} else {
    echo "Nenhum resultado encontrado";
}

// Fecha a conexão com o MySQL
$conn->close();
?>
