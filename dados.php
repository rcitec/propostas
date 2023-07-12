<?php
    function auth() {
        $msg = null;
        $showMsg = false;
        
        // Check if the form is submitted
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $userNome = $_POST["userNome"];
            $userSenha = $_POST["userSenha"];
            
            // Create a connection
            $conn = new mysqli("199.253.28.226", "rcionweb_usr", "j(Fdb{WF-ku*", "rcionweb_propostas"); // }7K)mztD+54g
            
            // Check the connection
            if ($conn->connect_error) {die("<p style='background-color:yellow; padding:5px'>A conexão falhou: " . $conn->connect_error . "</p>");}
            
            // Perform a sample query
            $sql = "SELECT * FROM `Users` WHERE `Nome`=\"$userNome\" and `Senha`=\"$userSenha\";";
            $result = $conn->query($sql);
            
            // Check if the query was successful
            if ($result) {
                // Process the results
                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        // Start a session
                        session_start();
                        
                        // Set the variables in the session
                        $userId = $row["Id"];
                        $userChave = bin2hex(random_bytes(16));
                        
                        $sql = "UPDATE `Users` SET `Chave`=\"$userChave\" WHERE `Id`=\"$userId\";";
                        mysqli_query($conn, $sql);
                        
                        $_SESSION['userId'] = $userId;
                        $_SESSION['userNome'] = $userNome;
                        $_SESSION['userChave'] = $userChave;
                        $_SESSION['versaoJs'] = $versaoJs;
                        $_SESSION['versaoCss'] = $versaoCss;
                        
                        echo "<h3><center>Bem vindo, $userNome!</center></h3>";
                        
                        header("Refresh: 1; url=proposta.php");
                        exit;
                    }
                } else {$_SESSION['showMsg'] = true;
                        $_SESSION['msg'] = "<p style='background-color:yellow; padding:5px'>Informações incorretas, tente novamente...</p>";
                }
            } else {$showMsg = true;
                    $msg = "<p style='background-color:yellow; padding:5px'>Pesquisa no BD falhou: " . $conn->error . "</p>";
                }
            
            // Close the connection
            $conn->close();
            
            return;
            //exit;
        }
    }
?>