<!DOCTYPE html>
<html lang="pt_BR">
    <head>
        <meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0">
        <title>rciTec | Bem Vindo |</title>
        <link rel="icon" type="image/png" href="rt.png" />
        
        <?php
                //session_start();
                //session_unset();
                //session_destroy();
                //$msg = null;
                //$showMsg = false;
                
            include 'dados.php';
            
            $versaoJs="1.2";
            echo '<script src="dados.js?' . $versaoJs . '"></script>';
            
            $versaoCss="4.6";
            echo '<link rel="stylesheet" type="text/css" href="style.css?' . $versaoCss . '">';
        ?>
    </head>

<body>

    <!--form method="POST" action="<!--?php echo $_SERVER["PHP_SELF"]; ?>"-->
    <form method="POST" action="<?php auth(); ?>">
        <center><h3>rci Login</h3></center>
        <table align="center" width="100%">
            <tr height="20px"><td colspan="2" style="border-top:1px solid #000000;"></td></tr>
            <tr>
                <td width="30%" align="right">Nome</td>
                <td ><input style="text-align: left; width: 200px;" name="userNome" type='text'></td>
            </tr>
            <tr height="5px"><td colspan="2"></td></tr>
            <tr>
                <td align="right">Senha</td>
                <td><input style="text-align: left; width: 200px;" name='userSenha' type='password'></td>
            </tr>
            <tr height="20px"><td colspan="2"></td></tr>
            <tr>
                <td colspan="2" align="right" style="border-bottom:1px solid #000000;"><button type="submit">Login</button></td>
            </tr>
        </table>
        
        <?php
            session_start();
            //echo "teste " . $_SESSION['showMsg'];
            if ($_SESSION['showMsg']) {echo $_SESSION['$msg'];}
        ?>
    </form>
</body>
</html>