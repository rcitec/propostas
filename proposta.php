<!DOCTYPE html>
<html lang="pt_BR">
    <head>
        <meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0">
        <title>rciTec | Proposta |</title>
        <link rel="icon" type="image/png" href="rt.png" />
        <!--script src="dados.js"></script-->
        
        <?php
            // Start the session
            session_start();
            
            // Retrieve the variables from the session
            $userId = $_SESSION['userId'];
            $userNome = $_SESSION['userNome'];
            $userChave = $_SESSION['userChave'];
            $versaoJs = $_SESSION['versaoJs'];
            $versaoCss = $_SESSION['versaoCss'];
            $acessoNegado = "Não";
            
            //echo '<script src="dados.js?' . $versaoJs . '"></script>';
            echo '<link rel="stylesheet" type="text/css" href="style.css?' . $versaoCss . '">';
            
            // Create a connection
            $conn = new mysqli("199.253.28.226", "rcionweb_usr", "j(Fdb{WF-ku*", "rcionweb_propostas");
            
            // Check the connection
            if ($conn->connect_error) {die("<p style='background-color:yellow; padding:5px'>A conexão falhou: " . $conn->connect_error . "</p>");}
            
            $sql = "SELECT * FROM `Users` WHERE `Id` = $userId";
            $result = $conn->query($sql);
            
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $userChaveBD = $row["Chave"];
                if ($userChaveBD <> $userChave) {$acessoNegado = "Sim";}
            } else {$acessoNegado = "Sim";}
            
            if ($acessoNegado == "Sim") {
                echo "<p style='background-color:yellow; padding:5px'>Acesso negado! <br><br>redirecionando para página de login...</p>";
                session_unset();
                session_destroy();
                $conn->close();
                header("Refresh: 2; url=index.php");
                exit;
            }
            
            // Dados Combustível
            $sql = "SELECT * FROM `Combustivel` WHERE IdUser = $userId";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $xValorCombustivel = $row["ValorCombustivel"];
                $xMediaConsumo = $row["MediaConsumo"];
                $xPercMaximoKm = $row["PercMaximoKm"];
                $xPercMinimoKm = $row["PercMinimoKm"];
            }
            
            // Unset all session variables
            //session_unset();
            
            // Destroy the session
            //session_destroy();
            
            // Close the connection
            $conn->close();
        ?>
        
    </head>
        
<script>

// **************************** Calcula Viagem
function CalculaViagem(form){
    if (form.Distancia.value <= 0) {return;}
    
    //Gravar.disabled = false;
    document.getElementById("Gravar").disabled = false;
    
    var xValorCombustivel = form.ValorCombustivel.value;
    var xDistancia = form.Distancia.value;
    var xPedagio = form.Pedagio.value;
    var xAjudante = form.Ajudante.value;
    var xOutros = form.Outros.value;
    var xPercDesconto = form.PercDesconto.value;
    var xAjuste = form.Ajuste.value;
    
    var xMediaConsumo = "<?echo $xMediaConsumo;?>";
    var xPercMaximoKm = "<?echo $xPercMaximoKm;?>";
	var xPercMinimoKm = "<?echo $xPercMinimoKm;?>";
	
	// Converte String
	xValorCombustivel = xValorCombustivel.replace(",", "");
    xValorCombustivel = xValorCombustivel.replace(".", "");
    xValorCombustivel = xValorCombustivel/100;
    
    xDistancia = xDistancia.replace(".", "");
    
    xPedagio = xPedagio.replace(",", "");
    xPedagio = xPedagio.replace(".", "");
    xPedagio = xPedagio/100;
    
    xAjudante = xAjudante.replace(",", "");
    xAjudante = xAjudante.replace(".", "");
    xAjudante = xAjudante/100;
    
    xOutros = xOutros.replace(",", "");
    xOutros = xOutros.replace(".", "");
    xOutros = xOutros/100;
    
    xPercDesconto = xPercDesconto.replace(",", "");
    xPercDesconto = xPercDesconto.replace(".", "");
    xPercDesconto = xPercDesconto/100;
    
    xAjuste = xAjuste.replace(",", "");
    xAjuste = xAjuste.replace(".", "");
    xAjuste = xAjuste/100;
	
	// Custo Km
    var xCustoKm = xValorCombustivel/xMediaConsumo;
    
    // Valor Km
    xValorMaximoKm = xCustoKm*xPercMaximoKm;
    xValorMinimoKm = xCustoKm*xPercMinimoKm;
    
    // Valor Km Cobrado
    var xDescontoKm = (xValorMaximoKm-xValorMinimoKm)/1000;
    if (xDistancia < 1001) {var xValorKmCobrado = xValorMaximoKm-(xDistancia*xDescontoKm);}
    else {var xValorKmCobrado = xValorMaximoKm-(1000*xDescontoKm);};

	// Custo Combustível
    var xCustoCombustivel = (xDistancia*xCustoKm);
    
    // Custo Total
    var xCustoTotal = xCustoCombustivel+xPedagio+xAjudante;
    
    // Frete Líquido
    var xFreteLiquido = ((xDistancia*xValorKmCobrado)-((xDistancia*xValorKmCobrado)*(xPercDesconto/100))+xOutros-xAjuste);
    
    // Frete Total
    var xFreteTotal = (xDistancia*xValorMaximoKm)+xPedagio+xOutros-xAjuste;
    
    // Desconto Total
    var xDescontos = xFreteTotal-xFreteLiquido-xPedagio;    // ((xFreteTotal-xFreteLiquido)/(xFreteTotal+xPedagio+xAjudante))*100;
    
    // TOTAL DOS SERVIÇOS
    var xTotalDosServicos = xFreteLiquido+xPedagio+xAjudante;
    
    // Receita Liquida
    var xReceitaLiquida = xTotalDosServicos - xCustoTotal;
    
    // % Desconto
    var xPdesconto = (xDescontos/xFreteTotal)*100;
    
    // Custo Total por Km
    var xKmCustoTotal = xCustoTotal / xDistancia;
    
    // Total dos Serviços por Km
    var xKmTotalDosServicos = xTotalDosServicos / xDistancia;
    
    // Atualiza Formulário
    form.CustoTotal.value = xCustoTotal.toLocaleString('pt-BR', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2});
    form.KmCustoTotal.value = "R$ " + xKmCustoTotal.toLocaleString('pt-BR', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2}) + " /Km";
    form.FreteTotal.value = xFreteTotal.toLocaleString('pt-BR', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2});
    form.Descontos.value = xDescontos.toLocaleString('pt-BR', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2});
    form.Pdesconto.value = xPdesconto.toLocaleString('pt-BR', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2}) + "%";
    form.FreteLiquido.value = xFreteLiquido.toLocaleString('pt-BR', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2});
    form.ReceitaLiquida.value = xReceitaLiquida.toLocaleString('pt-BR', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2});
    form.TotalServicos.value = "R$ " + xTotalDosServicos.toLocaleString('pt-BR', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2});
    form.KmTotalServicos.value =  "R$ " + xKmTotalDosServicos.toLocaleString('pt-BR', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2}) + " /Km";
    
    // Texto Proposta Whatsapp
    var xProposta = "" +
        "*Proposta:* \n \n" +
        "```Origem.:``` _*"+form.Origem.value+"*_ \n" +
        "```Destino:``` _*"+form.Destino.value+"*_ \n" +
        "\n" +
        "```Frete....: +R$``` "+form.FreteTotal.value+" \n" +
        "```Ajudante.: +R$``` "+form.Ajudante.value+" \n" +
        "```Desconto.: -R$``` "+form.Descontos.value+" ("+form.Pdesconto.value+ ")\n" +
        "\n" +
        "*Total dos Serviços R$ "+form.TotalServicos.value+"*";
    form.PropostaWhats.value = xProposta;

    if ((xFreteLiquido/xDistancia) <= xValorMinimoKm) {
        //xTituloMsgAlerta = "Atenção !";
        //xMensagemAlerta = "O Valor do Km Cobrado está abaixo do Mínimo.";
        //Alerta();
        alert("O Valor do Km Cobrado está abaixo do Mínimo.");
    }
    
    // teste form.PropostaWhats.value = xPdesconto;
}

// **************************** GRAVAR Proposta
function GravarProposta(form){
    //<?php
    //$sql = "INSERT INTO Propostas(IdUser, Origem, Destino, Nome, Telefone, ValorCombustivel, Distancia, Pedagio, Ajudante, Outros, PercDesconto, Ajuste, MediaConsumo, PercMaximoKm, PercMinimoKm, Desconto, TotalServicos, DataRegistro, Busca, Marcado) VALUES (xIdUser, xOrigem, xDestino, xNome, xTelefone, xValorCombustivel, xDistancia, xPedagio, xAjudante, xOutros, xPercDesconto, xAjuste, xMediaConsumo, xPercMaximoKm, xPercMinimoKm, Desconto, xTotalServicos, xDataRegistro, xBusca, xMarcado)";
    //$stmt = $pdo->prepare($sql);
    //$stmt->execute();
    //?>
    
    //<?"echo $sql = INSERT INTO Propostas(IdUser, Origem, Destino, Nome, Telefone, ValorCombustivel, Distancia, Pedagio, Ajudante, Outros, PercDesconto, Ajuste, MediaConsumo, PercMaximoKm, PercMinimoKm, Desconto, TotalServicos, DataRegistro, Busca, Marcado) VALUES (xIdUser, xOrigem, xDestino, xNome, xTelefone, xValorCombustivel, xDistancia, xPedagio, xAjudante, xOutros, xPercDesconto, xAjuste, xMediaConsumo, xPercMaximoKm, xPercMinimoKm, Desconto, xTotalServicos, xDataRegistro, xBusca, xMarcado)";?>

}

// **************************** Máscara para Valores 9.999,99
function MascaraValor(Valor){
    var newValor = Valor.value;
    var newString=Number(newValor.substr(newValor.length-1,1));
    
    if (isNaN(newString)) {
        if (newValor.substr(newValor.length-1,1) == ",") {
            newValor = newValor.replace(/,/g, "");
            Valor.value = newValor*1+",00";
            return;
        }
        Valor.value = newValor.substr(0,newValor.length-1);
        return;
    }
    
    newValor = newValor.replace(",", "");
    newValor = newValor.replace(".", "");
    Valor.value = (Number(newValor)/100).toLocaleString('pt-BR', {style:'decimal', minimumFractionDigits:2, maximumFractionDigits:2});
}

// **************************** Máscara para Telefone (15)99745-0446
function MascaraTelefone(Telefone){
    var newString=Telefone.value.substr(Telefone.value.length-1,1);
    
    if (newString=="(" || newString==")" || newString=="-") {
        Telefone.value = Telefone.value.substr(0,Telefone.value.length-2);
        return;
    }
    if (Telefone.value.length == 1){ Telefone.value = "(" + Telefone.value }
    if (Telefone.value.length == 3){ Telefone.value += ")" }
    if (Telefone.value.length == 9){ Telefone.value += "-" }
}

</script>



<body>
    <form name="Proposta" onsubmit="return false">
        <div class="container">
            <div class="cols">
                <div class="col1">
                    <div class="inputE">
                        <lin>$ Combustível</lin><br>
                        <input id="ValorCombustivel" value="<?echo $xValorCombustivel;?>" type="text" required onkeyup="MascaraValor(ValorCombustivel)" onchange="CalculaViagem(this.form)">
                    </div>
                    <div class="inputE">
                        <lin>Distância</lin><br>
                        <input id="Distancia" type="text" required onkeyup="CalculaViagem(this.form)">
                    </div>
                    <div class="inputE">
                        <lin>Pedágio</lin><br>
                        <input id="Pedagio" type="text" onkeyup="MascaraValor(Pedagio), CalculaViagem(this.form)">
                    </div>
                    <div class="inputE">
                        <lin>Ajudante</lin><br>
                        <input id="Ajudante" type="text" onkeyup="MascaraValor(Ajudante), CalculaViagem(this.form)">
                    </div>
                    <div class="inputE">
                        <lin>Outros</lin><br>
                        <input id="Outros" type="text" onkeyup="MascaraValor(Outros), CalculaViagem(this.form)">
                    </div>
                    <div class="inputE">
                        <lin>% Desconto</lin><br>
                        <input id="PercDesconto" type="text" onkeyup="MascaraValor(PercDesconto), CalculaViagem(this.form)">
                    </div>
                    <div class="inputE">
                        <lin>Ajuste</lin><br>
                        <input id="Ajuste" type="text" onkeyup="MascaraValor(Ajuste), CalculaViagem(this.form)">
                    </div>
                </div>
                <div class="col2">
                    <div class="proposta">
                        <div class="tproposta">Custo Total</div>
                        <input class="iproposta" id="KmCustoTotal" type="text" disabled>
                        <input class="cproposta" id="CustoTotal" type="text" disabled>
                    </div>
                    <div class="pulaLinha"></div>
                    <div style="display: flex;">
                        <div class="proposta" style="width: 48%;font-size: 8pt;">
                            <div class="tproposta" >Frete Total</div>
                            <input class="cproposta" id="FreteTotal" style="width: 98%;" type="text" disabled>
                        </div>
                        <div style="width: 5px;"></div>
                        <div class="proposta" style="width: 48%; font-size: 8pt;">
                            <div class="tproposta">Desc.</div>
                            <input class="iproposta" id="Pdesconto" type="text" disabled>
                            <input class="cproposta" id="Descontos" style="width: 98%; font-size: 13pt;" type="text" disabled>
                        </div>
                    </div>
                    <div class="pulaLinha"></div>
                    <div style="display: flex;">
                        <div class="proposta" style="width: 48%;font-size: 8pt;">
                            <div class="tproposta">Frete Líquido</div>
                            <input class="cproposta" id="FreteLiquido" style="width: 98%;" type="text" disabled>
                        </div>
                        <div style="width: 5px;"></div>
                        <div class="proposta" style="width: 48%;font-size: 8pt;">
                            <div class="tproposta">Receita Líquida</div>
                            <input class="cproposta" id="ReceitaLiquida" style="width: 98%;" type="text" disabled>
                        </div>
                    </div>
                        <div class="pulaLinha"></div>
                    <div class="proposta">
                        <div class="tproposta">Total dos Serviços</div>
                        <input class="iproposta" id="KmTotalServicos" type="text" disabled>
                        <input class="cproposta" id="TotalServicos" style="font-size: 18pt;" type="text" disabled>
                    </div>
                    <div class="pulaLinha"></div>
                    <div class="inputD" style="width: 238px; text-align: left;">
                        <lin>&nbspOrigem</lin><br>
                        <input style="text-align: left; width: 98%;" id="Origem" placeholder="De" type="text" onchange="CalculaViagem(this.form)">
                    </div>
                    <div class="inputD" style="width: 238px; text-align: left;">
                        <lin>&nbspDestino</lin><br>
                        <input style="text-align: left; width: 98%;" id="Destino" placeholder="Para" type="text" onchange="CalculaViagem(this.form)">
                    </div>
                </div>
            </div>
            <div>
                <div class="nome">
                    <lin>&nbspNome</lin><br>
                    <input id="Nome" style="width: 98%; text-align: left;" type="text">
                </div>
                <div class="telefone">
                    <lin>&nbspTelefone</lin><br>
                    <input id="Telefone" style="width: 96%; text-align: left;" onkeyup="MascaraTelefone(Telefone)" type="text">
                </div>
            </div>
            <div class="opcoes">
                <div class="col1" style="width: 49%; height: 170px;">
                    <div><button class="botao" id="Limpar">Limpar/Novo</button></div>
                    <div class="pulaLinha"></div>
                    <div><button class="botao" id="Buscar">Buscar</button></div>
                    <div class="pulaLinha"></div>
                    <div><button class="botao" id="Clonar" disabled>Clonar</button></div>
                    <div class="pulaLinha"></div>
                    <div><button class="botao" id="Email" disabled>E-Mail</button></div>
                </div>
                <div class="col2" style="width: 49%; height: 170px; text-align: right;">
                    <div><button class="botao" id="Gravar" onclick="GravarProposta()" disabled>Gravar</button></div>
                    <div class="pulaLinha"></div>
                    <div><button class="botao" id="Marcar" disabled>Marcar</button></div>
                    <div class="pulaLinha"></div>
                    <div><button class="botao" id="Excluir" disabled>Excluir</button></div>
                    <div class="pulaLinha"></div>
                    <div><button class="botao" id="Configurar" disabled>Configurar</button></div>
                </div>
            </div>
            <div style="text-align: right; padding: 0px 10px 0px 0px;">
                <lin style="font-size: 11pt;">Proposta:</lin>
                <button class="botao" style="width: 170px; height: 20px; font-size: 9pt;" disabled>Copiar</button>
                <div class="pulaLinha"></div>
                <textarea id="PropostaWhats">Proposta...</textarea>
            </div>
            <div class="pulaLinha"></div>
            <div style="text-align: center;"><button class="botao" style="width: 320px; height: 20px; font-size: 10pt;" disabled>iD</button></div>
            <hr>
            <div style="width: 99%; text-align: right; font-size: 7pt;">
                <?echo 'Rogério Xavier 06/2023 | j' . $versaoJs . '/' . 'c' . $versaoCss;?>
            </div>
        </div>
        
    </form>

</body>
</html>
