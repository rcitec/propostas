// Base de Dados
// C:\Users\Roger\AppData\Local\Google\Chrome\User Data\Default\databases\file__0


// **************************** Declara Vari�veis
xProposta = "Proposta...";
xClonar = "Nao";
xEmail = false;
xNovaProposta = 'Sim';
xProcurandoProposta = 'Nao';



// **************************** Abre Banco de Dados
function onInit(){
	if (!window.openDatabase) {alert("Seu navegador n�o permite criar banco de dados.");}
	else { initDB(); };
};



// **************************** Cria Tabelas
function initDB() {
    xAuth = window.location.href.substr(window.location.href.length-31,1);

    if (xAuth == "?") {
	   var shortName = 'RciTec';
	   var version = '1.0';
	   var displayName = 'dbRciTec_Propostas';
	   var maxSize = 200000; // Em bytes "65536";

	   localDB = window.openDatabase(shortName, version, displayName, maxSize);

	   localDB.transaction(function(tx) {tx.executeSql('CREATE TABLE Combustivel(Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ValorCombustivel INTEGER NULL, MediaConsumo INTEGER NULL, PercentualMaximoKm INTEGER NULL, PercentualMinimoKm INTEGER NULL, NomeUsuario TEXTE NULL, TelefoneUsuario TEXTE NULL, Auth TEXTE NULL);');});
	   localDB.transaction(function(tx) {tx.executeSql('CREATE TABLE Propostas(Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, Origem TEXT NULL, Destino TEXT NULL, Nome TEXT NULL, Telefone TEXT NULL, ValorLitroCombustivel INTEGER NULL, Distancia INTEGER NULL, Pedagio INTEGER NULL, Ajudante INTEGER NULL, Outros INTEGER NULL, PorcentagemDesconto TEXT NULL, Ajuste INTEGER NULL, MediaConsumo INTEGER NULL, PercentualMaximoKm INTEGER NULL, PercentualMinimoKm INTEGER NULL, DescontoFreteLiquido INTEGER NULL, TotalDosServicos INTEGER NULL, DataRegistro INTEGER NULL, Busca TEXT NULL, Email INTEGER FALSE);');});

    //localDB.transaction(function(tx) {tx.executeSql('ALTER TABLE Propostas ADD COLUMN Auth TEXT NULL;');});

        initApp();
    }
    else {
        alert("N�o Autenticado, efetue o Login!");
        location='index.html';
        return;
    };
};



// **************************** Inicia App
function initApp() {
    query = "SELECT * FROM Combustivel;";
    localDB.transaction(function(transaction){

    transaction.executeSql(query, [], function(transaction, results){
        var row = results.rows.item(0);
        xAuth = window.location.href.substr(window.location.href.length-30,30);

        if (xAuth == row['Auth']) {
            xNomeUsuario = row['NomeUsuario'];
            xTelefoneUsuario = row['TelefoneUsuario'];

            document.FormApp.ValorCombustivel.value = row['ValorCombustivel'].toFixed(2);
            document.FormConfigurar.ConfigValorCombustivel.value = row['ValorCombustivel'].toFixed(2);
            document.FormConfigurar.ConfigMediaConsumo.value = row['MediaConsumo'].toFixed(2);
            document.FormConfigurar.ConfigPercentualMaximoKm.value = row['PercentualMaximoKm'].toFixed(2);
            document.FormConfigurar.ConfigPercentualMinimoKm.value = row['PercentualMinimoKm'].toFixed(2);
            document.FormConfigurar.NomeUsuario.value = row['NomeUsuario'];
            document.FormConfigurar.TelefoneUsuario.value = row['TelefoneUsuario'];
            AtualizaValorKm();
        }
        else {
            alert("N�o Autenticado, efetue o Login!");
            location='index.html';
            return;
        };
    }, function(transaction, error){alert("Erro: " + error.code + ' | ' + error.message);})
    });

    window.onbeforeunload = function(){return "";};

    document.getElementById("DivFormApp").style.visibility = "visible";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "visible";
    document.getElementById("DivFundoApp").style.visibility = "hidden";

    document.getElementById("Buscar").disabled = false;
    document.getElementById("Limpar").disabled = false;
    document.getElementById("Clonar").disabled = true;
    document.getElementById("Gravar").disabled = true;
    document.getElementById("Alterar").disabled = true;
    document.getElementById("Excluir").disabled = true;
    document.getElementById("RegistroDataAtual").disabled = true;
};



// **************************** Calcula Viagem
function CalculaViagem() {
    xDistancia = Number(document.FormApp.Distancia.value);
    xPedagio = Number(document.FormApp.Pedagio.value);
    xAjudante = Number(document.FormApp.Ajudante.value);
    xOutros = Number(document.FormApp.Outros.value);
    xPorcentagemDesconto = Number(document.FormApp.PorcentagemDesconto.value);
    xAjuste = Number(document.FormApp.Ajuste.value);

    xValorCombustivel = Number(document.FormApp.ValorCombustivel.value);
    xMediaConsumo = Number(document.FormConfigurar.ConfigMediaConsumo.value);
    xValorMaximoKm = Number(document.FormConfigurar.ValorMaximoKm.value);
	xValorMinimoKm = Number(document.FormConfigurar.ValorMinimoKm.value);

    if (xDistancia<1){
        document.getElementById("Gravar").disabled = true;
        document.getElementById("Alterar").disabled = true;
        document.getElementById("Excluir").disabled = true;
        document.getElementById("Clonar").disabled = true;
        return;
    };
    
    if (xNovaProposta == 'Sim'){
        document.getElementById("Gravar").disabled = false;        
    }
    else {
        document.getElementById("Gravar").disabled = true;
        document.getElementById("Alterar").disabled = false;
        document.getElementById("Excluir").disabled = false;
        document.getElementById("Clonar").disabled = false;
    };

    // Custo Km
    xCustoKm = xValorCombustivel/xMediaConsumo;

    // Custo Combust�vel
    xCustoCombustivel = (xDistancia*xCustoKm);

    // Custo Total
    xCustoTotal = xCustoCombustivel+xPedagio+xAjudante;

    // Valor Km Cobrado
    xDescontoKm = (xValorMaximoKm-xValorMinimoKm)/1000;
    if (xDistancia < 1001) {xValorKmCobrado = xValorMaximoKm-(xDistancia*xDescontoKm);}
    else {xValorKmCobrado = xValorMaximoKm-(1000*xDescontoKm);};

    // Frete L�quido
    xFreteLiquido = ((xDistancia*xValorKmCobrado)-((xDistancia*xValorKmCobrado)*(xPorcentagemDesconto/100))+xOutros-xAjuste);

    // Frete Total
    xFreteTotal = (xDistancia*xValorMaximoKm)+xOutros;

    // Desconto Frete
    xDescontoFreteLiquido = xFreteTotal-xFreteLiquido;

    // % Desconto Total
    xPercDescontoTotal = (xDescontoFreteLiquido/(xFreteTotal+xPedagio+xAjudante))*100;

    // Valor Km
    xValorKm = xFreteLiquido/xDistancia;

    // TOTAL DOS SERVI�OS
    xTotalDosServicos = xFreteLiquido+xPedagio+xAjudante;

    // Receita L�quida
    xReceitaLiquida = xTotalDosServicos-xAjuste-xCustoTotal;

    xCustoKm = xCustoKm.toFixed(2);
    xCustoCombustivel = xCustoCombustivel.toFixed(2);
    xCustoTotal = xCustoTotal.toFixed(2);
    xValorKmCobrado = xValorKmCobrado.toFixed(2);
    xFreteLiquido = xFreteLiquido.toFixed(2);
    xFreteTotal = xFreteTotal.toFixed(2);
    xDescontoFreteLiquido = xDescontoFreteLiquido.toFixed(2);
    xPercDescontoTotal = xPercDescontoTotal.toFixed(2);
    xValorKm = xValorKm.toFixed(2);
    xTotalDosServicos = xTotalDosServicos.toFixed(2);
    xReceitaLiquida = xReceitaLiquida.toFixed(2);

    document.FormApp.CustoCombustivel.value = Number(xCustoCombustivel).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.FreteLiquido.value=Number(xFreteLiquido).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.CustoTotal.value = Number(xCustoTotal).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.FreteTotal.value = Number(xFreteTotal).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.DescontoFreteLiquido.value = Number(xDescontoFreteLiquido).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.DescontoTotal.value = Number(xPercDescontoTotal).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"%";
    document.FormApp.CustoKm.value = Number(xCustoKm).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.ValorKm.value = Number(xValorKm).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.ReceitaLiquida.value = Number(xReceitaLiquida).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.TotalDosServicos.value = Number(xTotalDosServicos).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.Margem.value = Number((100*(xTotalDosServicos/xCustoTotal)-100)).toFixed(1)+"%";

    // Proposta
    xProposta = "" +
        "*Proposta:* \n \n" +
        "```Origem.:``` _*"+document.FormApp.Origem.value+"*_ \n" +
        "```Destino:``` _*"+document.FormApp.Destino.value+"*_ \n" +
        "\n" +
        "```Frete....: +R$``` "+(Number(xFreteTotal)+Number(xPedagio)).toLocaleString('pt-BR',{style: 'decimal', minimumFractionDigits:2})+" \n" +
        "```Ajudante.: +R$``` "+Number(xAjudante).toLocaleString('pt-BR',{style: 'decimal', minimumFractionDigits:2})+" \n" +
        "```Desconto.: -R$``` "+Number(xDescontoFreteLiquido).toLocaleString('pt-BR',{style: 'decimal', minimumFractionDigits:2})+" ("+Number(xPercDescontoTotal).toLocaleString('pt-BR',{style: 'decimal', minimumFractionDigits:1})+ "%)\n" +
        "\n" +
        "*Total dos Servi�os R$ "+Number(xTotalDosServicos).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"*";
    document.FormApp.Proposta.value = xProposta;

    if (xValorKm < xValorMinimoKm-.005) {
        xTituloMsgAlerta = "Aten��o !";
        xMensagemAlerta = "O Valor do Km Cobrado est� abaixo do M�nimo.";
        Alerta();
    };
};



// **************************** Formata Inputs FormApp
function FormataInputs() {
    document.FormApp.Pedagio.value = parseFloat(document.FormApp.Pedagio.value).toFixed(2);
    document.FormApp.Ajudante.value = parseFloat(document.FormApp.Ajudante.value).toFixed(2);
    document.FormApp.Outros.value = parseFloat(document.FormApp.Outros.value).toFixed(2);
    document.FormApp.PorcentagemDesconto.value = parseFloat(document.FormApp.PorcentagemDesconto.value).toFixed(2);
    document.FormApp.Ajuste.value = parseFloat(document.FormApp.Ajuste.value).toFixed(2);
};



// **************************** Atualiza Combustivel
function AtualizaCombustivel() {
	xValorCombustivel = parseFloat(document.FormApp.ValorCombustivel.value).toFixed(2);
    document.FormApp.ValorCombustivel.value = xValorCombustivel;
    document.FormConfigurar.ConfigValorCombustivel.value = xValorCombustivel;

    AtualizaValorKm();
	setTimeout(function(){CalculaViagem()},300);
};



// **************************** Atualiza Valor Km
function AtualizaValorKm() {
	xValorCombustivel = Number(document.FormApp.ValorCombustivel.value);
	xMediaConsumo = Number(document.FormConfigurar.ConfigMediaConsumo.value);
	xConfigPercentualMaximoKm = Number(document.FormConfigurar.ConfigPercentualMaximoKm.value);
	xConfigPercentualMinimoKm = Number(document.FormConfigurar.ConfigPercentualMinimoKm.value);

	xValorMaximoKm = ((xValorCombustivel/xMediaConsumo)*xConfigPercentualMaximoKm).toFixed(2);
	xValorMinimoKm = ((xValorCombustivel/xMediaConsumo)*xConfigPercentualMinimoKm).toFixed(2);

    document.FormConfigurar.CustoKm.value = (xValorCombustivel/xMediaConsumo).toFixed(2);
    document.FormConfigurar.DescontoKm.value = ((xValorMaximoKm-xValorMinimoKm)/1000).toFixed(5);
    document.FormConfigurar.ValorMaximoKm.value = xValorMaximoKm;
    document.FormConfigurar.ValorMinimoKm.value = xValorMinimoKm;
};



// **************************** Op��o Buscar
function BuscaProposta() {
    document.getElementById("DivFormApp").style.visibility = "hidden";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "hidden";
    document.getElementById("DivFundoApp").style.visibility = "visible";

    xProcurandoProposta = 'Sim';
    
    if (document.FormFiltrar.ProcurarPor.value == ""){
        document.getElementById("DivFormFiltrar").style.visibility = "hidden";
        query = "SELECT * FROM Propostas ORDER by SUBSTR(DataRegistro,19,12) DESC;";
    }
    else {
        document.getElementById("DivFormFiltrar").style.visibility = "hidden";

        query = "SELECT * FROM Propostas WHERE Busca LIKE '%"+document.FormFiltrar.ProcurarPor.value+"%' ORDER by SUBSTR(DataRegistro,19,12) DESC;";
    };

	localDB.transaction(function(transaction){
			transaction.executeSql(query, [], function(transaction, results){

			var tabela = "<hr>" +
            	"<table class='TabelasApp' cellpadding='0px' width='100%'>" ;
            	for (var i = 0; i < results.rows.length; i++) {
            		var row = results.rows.item(i);

            		if (row['Email'] == 0){var xCorFonte = "black"} else{var xCorFonte = "blue"};

                    xData = row['DataRegistro'];
                    xResultado = (xData.substr(0,17) + " | " + row['Origem'] + " X " + row['Destino'] + " | " + row['Nome']).substr(0,58);

            		tabela +=
            			"<tr height='25px' style='color:"+xCorFonte+";'>" +
                            "<td style='font-size: 10pt; align:left; width:12px; color:red;' onclick='ExcluiProposta("+ row['Id'] +");'><b>X</b></td>" +
                            "<td onclick='RegisroSelecionado("+ row['Id'] +")'>"+xResultado+"</td>" +
            			"</tr>";
            	};
                    tabela +=
                    "<tr height='30px'><td colspan='2'><hr></td></tr>" +
                    "<tr>" +                        
                        "<td colspan='2' align='center'>" +
                            "<input type='button' value='  Voltar  ' onclick='FecharBusca()'/>��������" +
                            "<input type='button' value='�Limpar Marca��es eMail�' onclick='LimpaStatusEmail()'/>��������" +
                            "<input type='button' value='  Filtrar  ' onclick='FiltrarBusca()'/>" +
                            "<br>" +
                        "</td>" +
                    "</tr>" +
                "</table>" +
                "<br><hr>" ;

                document.FormFiltrar.ProcurarPor.value = "";
            	document.getElementById("DivFundoApp").innerHTML = tabela;
            }, function(transaction, error){return;}
        )
	});
    window.scrollTo(0, 0);
};



// **************************** Registro Selecionado
function RegisroSelecionado(clicked_id) {
    xId=clicked_id;
    xNovaProposta = 'Nao';
    xProcurandoProposta = 'Nao';

    document.getElementById("Gravar").disabled = true;
    document.getElementById("Alterar").disabled = false;
    document.getElementById("Excluir").disabled = false;
    document.getElementById("Clonar").disabled = false;
    document.getElementById("RegistroDataAtual").disabled = false;
    
    FecharBusca();
    
	query = "SELECT * FROM Propostas WHERE Id = "+xId+";";

	localDB.transaction(function(transaction){
			transaction.executeSql(query, [], function(transaction, results){
			var row = results.rows.item(0);

			document.FormApp.ValorCombustivel.value = row['ValorLitroCombustivel'].toFixed(2);
			document.FormApp.Distancia.value = row['Distancia'];
			document.FormApp.Pedagio.value = row['Pedagio'].toFixed(2);
			document.FormApp.Ajudante.value = row['Ajudante'].toFixed(2);
			document.FormApp.Outros.value = row['Outros'].toFixed(2);
			document.FormApp.PorcentagemDesconto.value = row['PorcentagemDesconto'];
			document.FormApp.Ajuste.value = row['Ajuste'].toFixed(2);
			document.FormApp.Origem.value = row['Origem'];
			document.FormApp.Destino.value = row['Destino'];
			document.FormApp.Nome.value = row['Nome'];
			document.FormApp.Telefone.value = row['Telefone'];
			document.FormApp.Email.checked = row['Email'];
            document.getElementById("RegistroDataAtual").value = "Id "+row['Id']+" - "+row['DataRegistro'].substr(0,16);
            document.FormConfigurar.ConfigValorCombustivel.value = row['ValorLitroCombustivel'].toFixed(2);
            document.FormConfigurar.ConfigMediaConsumo.value = row['MediaConsumo'].toFixed(2);
            document.FormConfigurar.ConfigPercentualMaximoKm.value = row['PercentualMaximoKm'].toFixed(2);
            document.FormConfigurar.ConfigPercentualMinimoKm.value = row['PercentualMinimoKm'].toFixed(2);
            xMediaConsumo = row['MediaConsumo'].toFixed(2);

			setTimeout(function(){AtualizaCombustivel()},250);

		}, function(transaction, error){alert("Erro: " + error.code + ' | ' + error.message);})
	});
};



// **************************** Filtrar Busca
function FiltrarBusca() {
    document.getElementById("DivFundoApp").innerHTML = "";
    document.getElementById("DivFormFiltrar").style.visibility = "visible";
    document.getElementById("ProcurarPor").select();
};



// **************************** Fechar Busca
function FecharBusca() {
    xProcurandoProposta = 'Nao';

    document.getElementById("DivFundoApp").innerHTML = "";
    document.getElementById("DivFormApp").style.visibility = "visible";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "visible";
};



// **************************** Formata N�mero para 2 digitos decimais
function FormataNumero(xNumero) {
    xNumero.value = parseFloat(xNumero.value).toFixed(2);
};



// **************************** Altera Data do Registro
function AlteraDataAutal() {
    window.scrollTo(0, 0);

    document.getElementById("DivFormApp").style.visibility = "hidden";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "hidden";
    document.getElementById("DivFundoApp").style.visibility = "visible";
    document.getElementById("DivFormAlterarData").style.visibility = "visible";
    document.getElementById("AlterarData").select();
};



// **************************** Grava nova Data do Registro
function GravaNovaData() {
    document.getElementById("DivFormApp").style.visibility = "visible";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "visible";
    document.getElementById("DivFundoApp").style.visibility = "hidden";
    document.getElementById("DivFormAlterarData").style.visibility = "hidden";

    if (document.FormAlterarData.AlterarData.value == ""){return;};

    xAgora = new Date();
    var dia = xAgora.getDate();
    if (xAgora.getHours()<10){var hora = String(xAgora.getHours()).padStart(2, '0');} else{var hora = xAgora.getHours()};
    if (xAgora.getMinutes()<10){var minuto = String(xAgora.getMinutes()).padStart(2, '0');} else{var minuto = xAgora.getMinutes()};
    xAgora = hora+":"+minuto;

    xAgoraInvertida = document.FormAlterarData.AlterarData.value;
    var dia = xAgoraInvertida.substr(0,2);
    var mes = xAgoraInvertida.substr(3,2);
    var ano = xAgoraInvertida.substr(6,4);
    xAgoraInvertida = ano+mes+dia+hora+minuto;

    document.getElementById("RegistroDataAtual").value = "Id "+xId+" - "+document.FormAlterarData.AlterarData.value+" "+xAgora;

    localDB.transaction(function(tx) {tx.executeSql('UPDATE Propostas SET DataRegistro="'+document.FormAlterarData.AlterarData.value+' '+xAgora+' ['+xAgoraInvertida+']'+'" WHERE Id='+xId+';');});
};



// **************************** Op��o Gravar / Alterar
function GravaProposta() {
    xAgora = new Date();
    var dia = xAgora.getDate();
    if (xAgora.getDate()<10){var dia = String(xAgora.getDate()).padStart(2, '0');} else{var dia = xAgora.getDate()};
    if (xAgora.getMonth()+1<10){var mes = String(xAgora.getMonth()+1).padStart(2, '0');} else{var mes = xAgora.getMonth()+1()};
    var ano = xAgora.getFullYear();
    if (xAgora.getHours()<10){var hora = String(xAgora.getHours()).padStart(2, '0');} else{var hora = xAgora.getHours()};
    if (xAgora.getMinutes()<10){var minuto = String(xAgora.getMinutes()).padStart(2, '0');} else{var minuto = xAgora.getMinutes()};
    xAgora = dia+"/"+mes+"/"+ano+" "+hora+":"+minuto;
    xAgoraInvertida = ano+mes+dia+hora+minuto;

    xOrigem = document.FormApp.Origem.value;
    xDestino = document.FormApp.Destino.value;
    xNome = document.FormApp.Nome.value;
    xTelefone = document.FormApp.Telefone.value;
    xEmail = document.FormApp.Email.checked;
    xDistancia = Number(document.FormApp.Distancia.value);
    xPedagio = Number(document.FormApp.Pedagio.value);
	xAjudante = Number(document.FormApp.Ajudante.value);
	xOutros = Number(document.FormApp.Outros.value);
    xPorcentagemDesconto = Number(document.FormApp.PorcentagemDesconto.value);
	xAjuste = Number(document.FormApp.Ajuste.value);
	xMediaConsumo = Number(document.FormConfigurar.ConfigMediaConsumo.value);
    xPercentualMaximoKm = Number(document.FormConfigurar.ConfigPercentualMaximoKm.value);
    xPercentualMinimoKm = Number(document.FormConfigurar.ConfigPercentualMinimoKm.value);
    xValorCombustivel = Number(document.FormApp.ValorCombustivel.value);
    xDescontoFreteLiquido = document.FormApp.DescontoFreteLiquido.value.replace(".","");
    xTotalDosServicos = document.FormApp.TotalDosServicos.value.replace(".","");
    xDescontoFreteLiquido = xDescontoFreteLiquido.replace(",",".");
    xTotalDosServicos = xTotalDosServicos.replace(",",".");
    var xClonando = xClonar;

    if (xNovaProposta == 'Sim'){
        localDB.transaction(function(tx) {tx.executeSql('INSERT INTO Propostas (Origem, Destino, Nome, Telefone, ValorLitroCombustivel, Distancia, Pedagio, Ajudante, Outros, PorcentagemDesconto, Ajuste, MediaConsumo, PercentualMaximoKm, PercentualMinimoKm, DescontoFreteLiquido, TotalDosServicos, DataRegistro, Busca, Email) VALUES ("'+xOrigem+'", "'+xDestino+'", "'+xNome+'", "'+xTelefone+'", '+xValorCombustivel+', '+xDistancia+', '+xPedagio+', '+xAjudante+', '+xOutros+', '+xPorcentagemDesconto+', '+xAjuste+', '+xMediaConsumo+', '+xPercentualMaximoKm+', '+xPercentualMinimoKm+', '+xDescontoFreteLiquido+', '+xTotalDosServicos+', "'+xAgora+' ['+xAgoraInvertida+']'+'", "'+xOrigem+' '+xDestino+' '+xNome+' '+xTelefone+'", '+xEmail+');');});
        
        query = "SELECT Id FROM Propostas WHERE Id = (SELECT MAX(ID) FROM Propostas);";
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], function(transaction, results){
            var row = results.rows.item(0);
            xId = row['Id'];

            xTituloMsgAlerta = "Ok";

            if (xClonando == "Sim") {xMensagemAlerta = "Proposta Clonada para Id "+xId;}
            else {xMensagemAlerta = "Proposta "+xId+" Gravada";};
            Alerta();

            document.getElementById("RegistroDataAtual").disabled = false;
            document.getElementById("RegistroDataAtual").value = "Id "+xId+" - "+document.FormAlterarData.AlterarData.value+" "+xAgora;
        }, function(transaction, error){alert("Erro: " + error.code + ' | ' + error.message);
            window.scrollTo(0, 0);
            return;})
        });

        xClonar = "Nao";
        xNovaProposta = 'Nao';

        // Atualiza Combustivel, M�dia Consumo e Desconto Por FaixaKm
        xValorCombustivel = Number(document.FormApp.ValorCombustivel.value);
        localDB.transaction(function(tx) {tx.executeSql('UPDATE Combustivel SET ValorCombustivel='+xValorCombustivel+', MediaConsumo='+xMediaConsumo+', PercentualMaximoKm='+xPercentualMaximoKm+', PercentualMinimoKm='+xPercentualMinimoKm+';');});

        document.getElementById("Gravar").disabled = true;
        document.getElementById("Alterar").disabled = false;
        document.getElementById("Excluir").disabled = false;
        document.getElementById("Clonar").disabled = false;
    }
    else {
        localDB.transaction(function(tx) {tx.executeSql('UPDATE Propostas SET Origem="'+xOrigem+'", Destino="'+xDestino+'", Nome="'+xNome+'", Telefone="'+xTelefone+'", ValorLitroCombustivel='+xValorCombustivel+', Distancia='+xDistancia+', Pedagio='+xPedagio+', Ajudante='+xAjudante+', Outros='+xOutros+', PorcentagemDesconto='+xPorcentagemDesconto+', Ajuste='+xAjuste+', MediaConsumo='+xMediaConsumo+', PercentualMaximoKm='+xPercentualMaximoKm+', PercentualMinimoKm='+xPercentualMinimoKm+', DescontoFreteLiquido='+xDescontoFreteLiquido+', TotalDosServicos='+xTotalDosServicos+', DataRegistro="'+xAgora+' ['+xAgoraInvertida+']'+'", Busca="'+xOrigem+' '+xDestino+' '+xNome+' '+xTelefone+'", Email='+xEmail+' WHERE Id='+xId+';');});

        xTituloMsgAlerta = "Ok";
        xMensagemAlerta = "Proposta "+xId+" Alterada";
        Alerta();

        document.getElementById("RegistroDataAtual").value = "Id "+xId+" - "+document.FormAlterarData.AlterarData.value+" "+xAgora;
    };

    window.scrollTo(0, 0);
};



// **************************** Op��o Excluir
function ExcluiProposta(clicked_id) {
    window.onbeforeunload = function(){};
    if (confirm("\n Deseja realmente excluir esta Proposta ?") == true) {
        if (xProcurandoProposta == "Nao"){
            setTimeout(function(){location.reload()},1000);
        };

        if (xProcurandoProposta == "Sim"){
            document.getElementById("Buscar").disabled = false;
            document.getElementById("Limpar").disabled = false;
            document.getElementById("Clonar").disabled = true;
            document.getElementById("Gravar").disabled = false;
            document.getElementById("Alterar").disabled = true;
            document.getElementById("Excluir").disabled = true;
            document.getElementById("RegistroDataAtual").disabled = true;
            document.getElementById("RegistroDataAtual").value = "�";

            xNovaProposta = 'Sim';
            xId=clicked_id;
            setTimeout(function(){BuscaProposta()},1000);
        };

        localDB.transaction(function(tx) {tx.executeSql('DELETE FROM Propostas WHERE Id = '+xId+';');});

        xTituloMsgAlerta = "Ok";
        xMensagemAlerta = "Proposta "+xId+" Apagada";
        Alerta();
    };
};



// **************************** Op��o Configurar
function ConfigurarApp() {
    window.scrollTo(0, 0);

    document.getElementById("DivFormApp").style.visibility = "hidden";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "hidden";
    document.getElementById("DivFundoApp").style.visibility = "visible";
    document.getElementById("DivFormConfigurar").style.visibility = "visible";
};



// **************************** Op��o Gravar Configurar App
function GravarConfigApp() {
    xValorCombustivel = parseFloat(document.FormConfigurar.ConfigValorCombustivel.value).toFixed(2);
    xMediaConsumo = parseFloat(document.FormConfigurar.ConfigMediaConsumo.value).toFixed(2);
    xPercentualMaximoKm = parseFloat(document.FormConfigurar.ConfigPercentualMaximoKm.value).toFixed(2);
    xPercentualMinimoKm = parseFloat(document.FormConfigurar.ConfigPercentualMinimoKm.value).toFixed(2);

    document.FormApp.ValorCombustivel.value = xValorCombustivel;
    document.FormConfigurar.ConfigValorCombustivel.value = xValorCombustivel;
    document.FormConfigurar.ConfigMediaConsumo.value = xMediaConsumo;
    document.FormConfigurar.ConfigPercentualMaximoKm.value = xPercentualMaximoKm;
    document.FormConfigurar.ConfigPercentualMinimoKm.value = xPercentualMinimoKm;

    window.scrollTo(0, 0);

    // Atualiza Combustivel, M�dia Consumo e Desconto Por FaixaKm
    xValorCombustivel = Number(document.FormApp.ValorCombustivel.value);
    localDB.transaction(function(tx) {tx.executeSql('UPDATE Combustivel SET ValorCombustivel='+xValorCombustivel+', MediaConsumo='+xMediaConsumo+', PercentualMaximoKm='+xPercentualMaximoKm+', PercentualMinimoKm='+xPercentualMinimoKm+';');});
    
    AtualizaValorKm();
    setTimeout(function(){CalculaViagem()},200);
};



// **************************** Op��o Gravar Nome e Telefone Usu�rio App
function GravarDadosUsuarioApp() {
    xNomeUsuario = document.FormConfigurar.NomeUsuario.value;
    xTelefoneUsuario = document.FormConfigurar.TelefoneUsuario.value;
    localDB.transaction(function(tx) {tx.executeSql('UPDATE Combustivel SET NomeUsuario="'+xNomeUsuario+'", TelefoneUsuario="'+xTelefoneUsuario+'";');});
};



// **************************** Op��o Voltar Configurar App
function VoltarConfigApp() {
    window.scrollTo(0, 0);

    document.getElementById("DivFormApp").style.visibility = "visible";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "visible";
    document.getElementById("DivFormConfigurar").style.visibility = "hidden";
};



// **************************** Op��o Limpar
function LimpaProposta() {
    window.onbeforeunload = function(){};
    location.reload();
    window.scrollTo(0, 0);
};



// **************************** Op��o Clonar
function ClonaProposta() {
    xClonar = "Sim";
    xNovaProposta = "Sim";
    GravaProposta();
    window.scrollTo(0, 0);
};



// **************************** Altera Status selecionado EMail
function AlteraStatusEmail() {
    localDB.transaction(function(tx) {tx.executeSql('UPDATE Propostas SET Email='+document.FormApp.Email.checked+' WHERE Id='+xId+';');});
    window.scrollTo(0, 0);
};



// **************************** Limpa Status selecionado EMail
function LimpaStatusEmail() {
    document.FormApp.Email.checked = false;
    localDB.transaction(function(tx) {tx.executeSql('UPDATE Propostas SET Email=false;');});
    setTimeout(function(){BuscaProposta();},500);
};



// **************************** Criar EMail
function EmailApp() {
    if (xNomeUsuario == "" || xTelefoneUsuario == "" || xNomeUsuario == null || xTelefoneUsuario == null){
        xTituloMsgAlerta = "Aten��o !";
        xMensagemAlerta = "Necess�rio preencher os Dados do Usu�rio.";
        Alerta();
        setTimeout(function(){ConfigurarApp()},1000);
        document.getElementById("DivFormMail").style.visibility = "hidden";
        return;
    };

    document.getElementById("DivFormApp").style.visibility = "hidden";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "hidden";
    document.getElementById("DivFundoApp").style.visibility = "visible";
    document.getElementById("DivFormMail").style.visibility = "visible";

    xDescontoEmail = 0;
	query = "SELECT * FROM Propostas WHERE Email=True ORDER by DataRegistro ASC;";
	localDB.transaction(function(transaction){
			transaction.executeSql(query, [], function(transaction, results){
           	for (var i = 0; i < results.rows.length; i++) {
                var row = results.rows.item(i);
                var x = i+1

                eval("document.FormCriarMail.DataMail"+x).value = row['DataRegistro'].substr(0,5);
                eval("document.FormCriarMail.DescricaoMail"+x).value = row['Origem'] + " X " + row['Destino'];
                eval("document.FormCriarMail.Valor"+x).value = (row['TotalDosServicos'] + 
                row['DescontoFreteLiquido']).toFixed(2);
                eval("document.FormCriarMail.Desconto"+x).value = row['DescontoFreteLiquido'].toFixed(2);
                eval("document.FormCriarMail.Nome"+x).value = "<br><i style='font-size: 8pt;'>�Autorizado: "+row['Nome']+"<i/>";
                xDescontoEmail += row['DescontoFreteLiquido'];
                document.FormCriarMail.Desconto.value = xDescontoEmail.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
            };
		}, function(transaction, error){return;})
	});
    window.scrollTo(0, 0);
};



// **************************** Calcula Desconto eMail
function DescontoEmail(xNumero){
    xDescontoEmail = 0;
    if (document.FormCriarMail.DataMail1.value !== ""){xDescontoEmail += Number(document.FormCriarMail.Desconto1.value)};
    if (document.FormCriarMail.DataMail2.value !== ""){xDescontoEmail += Number(document.FormCriarMail.Desconto2.value)};
    if (document.FormCriarMail.DataMail3.value !== ""){xDescontoEmail += Number(document.FormCriarMail.Desconto3.value)};
    if (document.FormCriarMail.DataMail4.value !== ""){xDescontoEmail += Number(document.FormCriarMail.Desconto4.value)};
    if (document.FormCriarMail.DataMail5.value !== ""){xDescontoEmail += Number(document.FormCriarMail.Desconto5.value)};
    if (document.FormCriarMail.DataMail6.value !== ""){xDescontoEmail += Number(document.FormCriarMail.Desconto6.value)};
    if (document.FormCriarMail.DataMail7.value !== ""){xDescontoEmail += Number(document.FormCriarMail.Desconto7.value)};
    if (document.FormCriarMail.DataMail8.value !== ""){xDescontoEmail += Number(document.FormCriarMail.Desconto8.value)};
    if (document.FormCriarMail.DataMail9.value !== ""){xDescontoEmail += Number(document.FormCriarMail.Desconto9.value)};
    if (document.FormCriarMail.DataMail10.value !== ""){xDescontoEmail += Number(document.FormCriarMail.Desconto10.value)};
    document.FormCriarMail.Desconto.value = xDescontoEmail.toFixed(2);

    xNumero.value = parseFloat(xNumero.value).toFixed(2);
};



// **************************** Gerar o corpo do eMail
function GerarMail() {
    window.scrollTo(0, 0);
	document.getElementById("DivFormMail").style.visibility = "hidden";
	document.getElementById("DivFormGerarMail").style.visibility = "visible";

    var x=0;
    for (var i = 1; i < 11; i++){
        if (eval("document.FormCriarMail.DataMail"+i).value !== "") {x=x+1};
    };

    xPixel = 0;
    var xLinha = 1;
    var xSomaTotalServicos = 0;
    var xSomaDesconto = 0;
    var xSomaValorReceber = 0;

    xTextoEmail = "<table cellspacing='0px' style='margin-left:auto; margin-right:auto; align:center; font-family:calibri; font-size:10pt; color:#8D8D8D; background: RGB(255, 255, 255);'>"
                + "<tr style='height:12px;'><td colspan='4'></td></tr>"
                + "<tr><td colspan='4'>�Prezados, anexo Documenta��o referente a:</td></tr>"
                + "<tr style='height:12px;'><td colspan='4'></td></tr>";
    for (i = 1; i < 11; i++) {
        var xData = eval("document.FormCriarMail.DataMail"+i).value;
        
        if (xData !== "") {
            var xDescricao = eval("document.FormCriarMail.DescricaoMail"+i).value;
            var xTotalServicos = Number(eval("document.FormCriarMail.Valor"+i).value);
            var xDesconto = Number(eval("document.FormCriarMail.Desconto"+i).value);
            xValorReceber = xTotalServicos - xDesconto;
            xSomaTotalServicos += xTotalServicos;
            xSomaDesconto += xDesconto;
            xSomaValorReceber += xValorReceber;

            if (xLinha == 1){var xCorLinha = "#F5F5F5"; var xLinha=2} else{var xCorLinha = "#FFFFEA"; var xLinha=1};
                if(xDesconto > 0 && x > 1){
                    xTextoEmail += "<tr bgcolor="+xCorLinha+" style='height:25px;'>"
                                    + "<td rowspan='3' style='width:10%; text-align:center; min-width:50px; max-width:50px;'>"+String(xData)+"</td>"
                                    + "<td rowspan='3' style='width:62%;'>"+xDescricao+eval("document.FormCriarMail.Nome"+i).value+"</td>"
                                    + "<td style='width:25%; text-align:right; vertical-align:bottom; min-width:80px; max-width:150px;'>R$ "+xTotalServicos.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "</td>"
                                    + "<td style='width:3%; text-align:left; vertical-align:bottom; min-width:05px; max-width:10px; padding-top:18px;'>+</td></tr>"
                                    + "<tr bgcolor="+xCorLinha+" style='height:25px;'>"
                                    + "<td style='width:25%; text-align:right; vertical-align:center; min-width:80px; max-width:150px; color:#FF8C8C;'>R$ "+xDesconto.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "</td>"
                                    + "<td style='width:3%; text-align:left; vertical-align:center; min-width:10px; max-width:10px;'>-</td></tr>"
                                    + "<tr bgcolor="+xCorLinha+" style='height:25px;'>"
                                    + "<td style='width:25%; text-align:right; vertical-align:top; min-width:80px; max-width:150px; color:#9292FF;'>R$ "+xValorReceber.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "</td>"
                                    + "<td style='width:3%; text-align:left; vertical-align:top; min-width:10px; max-width:10px; padding-bottom:18px;'>=</td></tr>";
                } else{
                    xTextoEmail += "<tr bgcolor="+xCorLinha+" style='height:50px;'>"
                                    + "<td style='width:10%; text-align:center; min-width:50px; max-width:50px;'>"+String(xData)+"</td>"
                                    + "<td style='width:62%;'>"+xDescricao+eval("document.FormCriarMail.Nome"+i).value+"</td>"
                                    + "<td style='width:25%; text-align: right; min-width:80px; max-width:150px;'>R$ "+xValorReceber.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "</td>"
                                    + "<td style='width:3%; text-align:left; min-width:10px; max-width:10px;'>+</td></tr>";
                };

            var xTotChar = (xData + xDescricao + String(xValorReceber)).length;
            if (xPixel < xTotChar){xPixel = xTotChar};
        };
    };

    if (xSomaDesconto == 0) {
        xTextoEmail += "<tr><td colspan='4' style='padding-top:4px; border-top:1px solid #D3D3D3;'></td></tr>"
                    + "<tr style='width:25%; height:25px; text-align: right; min-width:70px; max-width:150px;'><td colspan='2' ><b>Total dos Servi�os:</b></td><td><b>R$ "+xSomaTotalServicos.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"</b></td>"
                    + "<td style='text-align:left; min-width:10px; max-width:80px;'></td></tr>";
    } else {
        var xPercDesconto = (xSomaDesconto/xSomaTotalServicos)*100;
        var xPercDesconto = String(xPercDesconto.toFixed(2));
        var xPercDesconto = Number(xPercDesconto);

        xTextoEmail += "<tr><td colspan='4' style='padding-top:10px; border-top:1px solid #D3D3D3;'></td></tr>"
                    + "<tr style='width:25%; height:25px; text-align: right; min-width:70px; max-width:150px;'><td colspan='2' >Total dos Servi�os:</td><td>R$ "+xSomaTotalServicos.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"</td>"
                    + "<td style='text-align:left; min-width:10px; max-width:80px;'></td></tr>"
                    + "<tr style='width:25%; text-align: right; min-width:80px; max-width:150px;'><td colspan='2'>Descontos ("+xPercDesconto.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:1})+"%): </td><td style='text-align:right;'>R$ "+xSomaDesconto.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"</td>"
                    + "<td style='text-align:left; min-width:10px; max-width:10px;'></td></tr>"
                    + "<tr><td colspan='2'></td><td style='border-top:1px solid #D3D3D3;'></td></tr>"
                    + "<tr style='padding-top:3px; width:25%; height:25px; text-align: right; min-width:70px; max-width:140px;'><td colspan='2'><b>Total a Receber:</b></td><td style='text-align:right;'><b>R$ "+xSomaValorReceber.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"</b></td>"
                    + "<td style='text-align:left; min-width:10px; max-width:10px;'></td></tr>";
    };
    xTextoEmail += "<tr style='height: 5px;'><td colspan='4'></td></tr>"
                + "<tr><td colspan='4' style='border-top:1px solid #D3D3D3;'></td></tr>"
                + "<tr><td colspan='4' style='height:23px; padding-top: 5px;'>�Pagador: <b>" + document.FormCriarMail.Pagador.value + "</b></td></tr>"
                + "<tr><td colspan='4' style='height:23px;'>�Vencimento: <b>" + document.FormCriarMail.Vencimento.value + "</b></td></tr>"
                + "<tr><td colspan='4' style='height:23px; padding-bottom:8px;'>�C�digo de Barras: <font size=1pt><b>" + document.FormCriarMail.CodigoDeBarras.value + "</b></font></td></tr>"
                + "<tr><td colspan='4' style='border-top: 1px solid #D3D3D3;'></td></tr>"
                + "<tr><td colspan='4' style='height:15px;'></td></tr>"
                + "<tr><td colspan='4' style='height:30px;'>�Atenciosamente,</td></tr>"
                + "<tr><td colspan='4' style='height:12px;'></td></tr>"
                + "<tr><td colspan='4'>�<i>"+xNomeUsuario+"</i></td></tr>"
                + "<tr><td colspan='4'>�<font size=1pt><i>"+xTelefoneUsuario.substr(0,4)+" </font><b>"+xTelefoneUsuario.substr(4,10)+"</b></i></td></tr>"
                + "<tr><td colspan='4' style='border-top:1px solid #D3D3D3;'></td></tr>"
                + "<tr style='height: 8px;'><td colspan='4'></tr></td>"
                + "<tr><td colspan='4'>�</tr></td>"
            + "</table>"
            + "<center id='BotoesMail' style='background:RGB(205, 205, 205); border-radius:10px;'>"
                + "<br>"
                + "<input id='VoltarMailApp' value='Voltar' style='width:70px; text-align:center' type='button' onClick='VoltarMail()'>�����"
                + "<input id='CopiarMailApp' value='Copiar Documento' style='width:250px; text-align:center' type='button' onClick='CopiarMail()'>"
                + "<br><br>"
            + "</center>";

    document.getElementById("DivFundoApp").innerHTML = xTextoEmail;
    //document.body.innerHTML = xTextoEmail;

    xPixel *= 15;
    if (xPixel>1000){xPixel=1000};
    if (xPixel<400){xPixel=400};

    window.scrollTo(0, 0);
};



// **************************** Limpa campos do Form EMail
function LimpaMail() {
    window.scrollTo(0, 0);

    for (var i=1; i<=10; i++) {
        eval("document.FormCriarMail.DataMail"+i).value = "";
        eval("document.FormCriarMail.DescricaoMail"+i).value = "";
        eval("document.FormCriarMail.Valor"+i).value = null;
        eval("document.FormCriarMail.Desconto"+i).value = null;
        eval("document.FormCriarMail.Nome"+i).value = null;
	};
	document.FormCriarMail.Desconto.value = null;
	document.FormCriarMail.Pagador.value = null;
	document.FormCriarMail.Vencimento.value = null;
	document.FormCriarMail.CodigoDeBarras.value = null;
};



// **************************** Tela para copiar o corpo do eMail
function CopiarMail() {
    DivFundoApp.classList.remove("PopUpApp");
    DivFundoApp.classList.add("TelaCopiaEmail");
	document.getElementById("DivFormMail").style.visibility = "hidden";
	document.getElementById("DivFormGerarMail").style.visibility = "hidden";
	document.getElementById("BotoesMail").style.visibility = "hidden";
 
    eval("document.getElementById('DivFundoApp').style.width = '"+xPixel+"px';");
    document.getElementById("CopiarMailApp").backgroundColor = "RGB(255, 255, 0)";
    document.getElementById("CopiarMailApp").value = "** Copiado! Agora � s� colar **";

    document.execCommand('selectAll', false, null);

    setTimeout(function(){document.execCommand('copy');},250);
    setTimeout(function(){window.getSelection().removeAllRanges();},1000);

    setTimeout(function(){DivFundoApp.classList.add("PopUpApp");},1000);
    setTimeout(function(){document.getElementById("DivFundoApp").style.width = "380px";},1000);
    setTimeout(function(){document.getElementById("BotoesMail").style.visibility = "visible";},1250);    
    setTimeout(function(){document.getElementById("CopiarMailApp").value = "Copiar Documento";},5000);

    window.scrollTo(0, 0);
};



// **************************** Voltar e continuar editando o eMail
function VoltarMail() {
    document.getElementById("DivFundoApp").innerHTML = "";
	document.getElementById("DivFormGerarMail").style.visibility = "hidden";
	document.getElementById("DivFormMail").style.visibility = "visible";
	window.scrollTo(0, 0);
};



// **************************** Fechar pop do eMail
function FecharMail() {
    document.getElementById("DivFormApp").style.visibility = "visible";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "visible";
    document.getElementById("DivFundoApp").style.visibility = "hidden";
    document.getElementById("DivFormMail").style.visibility = "hidden";

   	window.scrollTo(0, 0);
};



// **************************** Copiar Texto da Proposta simulando "Ctrl+c"
function CopiarTextoProposta() {
    document.FormApp.Proposta.select();
    document.execCommand("copy");

    document.getElementById("BotaoCopiarProposta").select()
    document.getElementById("BotaoCopiarProposta").value = "* Proposta Copiada *";
    document.getElementById("Proposta").style.backgroundColor = "RGB(0, 0, 0)";
    document.getElementById("Proposta").style.color = "RGB(255, 255, 255)";
    
    setTimeout(function(){document.getElementById("Proposta").style.backgroundColor = "RGB(255, 255, 255)";},1000);
    setTimeout(function(){document.getElementById("Proposta").style.color = "RGB(0, 0, 0)";},1000);
    setTimeout(function(){document.getElementById("BotaoCopiarProposta").value = "Copiar Texto Proposta";},5000);
};



// **************************** M�scara para Telefones
function MascaraTelefone(Telefone){
    var caracter=Telefone.value.substr(Telefone.value.length-1,1);

    if (caracter=="(" || caracter==")" || caracter=="-") {
        Telefone.value = Telefone.value.substr(0,Telefone.value.length-2);
        return;
    };

    if (Telefone.value.length == 1){ Telefone.value = "(" + Telefone.value };
    if (Telefone.value.length == 3){ Telefone.value += ")" };
    if (Telefone.value.length == 9){ Telefone.value += "-" };
};



// **************************** M�scara para Datas
function MascaraData(Data){
    var caracter=Data.value.substr(Data.value.length-1,1);

    if (caracter=="/") {
        Data.value = Data.value.substr(0,Data.value.length-2);
        return;
    };

    if (Data.value.length == 2){ Data.value += "/" };
    if (Data.value.length == 6){ Data.value = Data.value.substr(0,5) + "/" + Data.value.substr(5,5)};
};



// **************************** PopUp de Mensagem de Alerta
function Alerta(){
    window.scrollTo(0, 0);

    document.getElementById("DivFundoApp").style.visibility = "visible";
    var msg_alerta = '<div id="Alerta" class="Alerta">'
                        +'<h2>'+xTituloMsgAlerta+'</h2>'
                        +'<p>'+xMensagemAlerta+'</p>'
                        +'<br>'
                        +'<input id="AlertaOk" style="padding:5px 10px;" type="button" value="OK" onclick="FecharAlerta()" />'
                    +'</div>';
    document.getElementById("DivFundoApp").innerHTML = msg_alerta;
    document.getElementById("AlertaOk").focus();
}



// **************************** Fecha PopUp de Alerta
function FecharAlerta(){
    xTituloMsgAlerta = "";
    xMensagemAlerta = "";
    document.getElementById("Alerta").style.visibility = "hidden";
}



// **************************** Apaga Banco de Dados
function ApagaBancoDeDados() {
    window.scrollTo(0, 0);

    if (confirm("\n Deseja realmente EXCLUIR este BANCO DE DADOS ?") == true) {
        if (confirm("\n Concordando, EXCLUI TODOS os DADOS, Ok ?") == true) {
            localDB.transaction(function(tx) {tx.executeSql('DROP TABLE Combustivel;');});
            localDB.transaction(function(tx) {tx.executeSql('DROP TABLE Propostas;');});

            xTituloMsgAlerta = "Ok";
            xMensagemAlerta = "Banco de Dados Apagado";
            Alerta();

            setTimeout(function(){location='index.html';},2000);
        };
    };
};
