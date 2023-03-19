// Base de Dados
// C:\Users\Roger\AppData\Local\Google\Chrome\User Data\Default\databases\file__0



// **************************** Declara Variáveis
localDB = null;
transacao = null;

xId = 0;
xValorCombustivel = 0;
xMediaConsumo = 0;
xDescontoPorFaixaKm = 0;
xDescontoKm = 0;
xValorKm = 0;
xValorKmCheio = 0;
xValorKmCobrado = 0;
xDistancia = 0;
xPedagio = 0;
xAjudante = 0;
xOutros = 0;
xPorcentagemDesconto = 0;
xAjuste = 0;
xCustoKm = 0;
xCustoTotal = 0;
xCustoCombustivel = 0;
xFreteLiquido = 0;
xFreteTotal = 0;
xReceitaLiquida = 0;
xDescontoFreteLiquido = 0;
xDescontoTotal = 0;
xTotalDosServicos = 0;
xAte = 0;
xOrigem = "";
xDestino = "";
xNome = "";
xTelefone = "";
xProposta = "Proposta...";
query = "";
xTextoEmail = "";
xTotalServicosEmail = 0;
xDescontoEmail = 0;
xNovaProposta = 'Sim';
xProcurandoProposta = 'Nao';
xTituloMsgAlerta = "";
xMensagemAlerta = "";

// **************************** Abre Banco de Dados
function onInit(){
	if (!window.openDatabase) { alert("Seu navegador não permite criar banco de dados.");}
	else { initDB(); };
};



// **************************** Cria Tabelas
function initDB() {
	var shortName = 'RciTec';
	var version = '1.0';
	var displayName = 'dbRciTec_Propostas';
	var maxSize = 200000; // Em bytes "65536";

	localDB = window.openDatabase(shortName, version, displayName, maxSize);

	localDB.transaction(function(tx) {tx.executeSql('CREATE TABLE Combustivel(Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ValorCombustivel INTEGER NULL, MediaConsumo INTEGER NULL, DescontoPorFaixaKm INTEGER NULL);');});
	localDB.transaction(function(tx) {tx.executeSql('CREATE TABLE FaixasKM(De INTEGER NULL, Ate INTEGER NULL, ValorKmCobrado INTEGER NULL);');});
	localDB.transaction(function(tx) {tx.executeSql('CREATE TABLE Propostas(Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, Origem TEXT NULL, Destino TEXT NULL, Nome TEXT NULL, Telefone TEXT NULL, ValorLitroCombustivel INTEGER NULL, Distancia INTEGER NULL, Pedagio INTEGER NULL, Ajudante INTEGER NULL, Outros INTEGER NULL, PorcentagemDesconto TEXT NULL, Ajuste INTEGER NULL, MediaConsumo INTEGER NULL, DescontoPorFaixaKm INTEGER NULL, DataRegistro INTEGER NULL, Busca TEXT NULL);');});
	
	initTabelas();
    initApp();
};



// **************************** Inicia Tabelas
function initTabelas() {
	query = "SELECT * FROM Combustivel;";
	localDB.transaction(function(transaction){
			transaction.executeSql(query, [], function(transaction, results){
			var row = results.rows.item(0);
			xValorCombustivel = row['ValorCombustivel'];
			xMediaConsumo = row['MediaConsumo'];
			xDescontoPorFaixaKm = row['DescontoPorFaixaKm'];
			document.FormApp.ValorCombustivel.value = row['ValorCombustivel'].toFixed(2);
            document.FormConfigurar.ConfigValorCombustivel.value = row['ValorCombustivel'].toFixed(2);
            document.FormConfigurar.ConfigMediaConsumo.value = row['MediaConsumo'].toFixed(2);
            document.FormConfigurar.ConfigDescontoPorFaixaKm.value = row['DescontoPorFaixaKm'].toFixed(2);
		}, function(transaction, error){alert("Erro: " + error.code + ' | ' + error.message);})
	});

    setTimeout(function(){if (xValorCombustivel == 0){
            localDB.transaction(function(tx) {tx.executeSql('INSERT or REPLACE INTO Combustivel (Id, ValorCombustivel, MediaConsumo, DescontoPorFaixaKm) VALUES (1, 9.99, 8, 5);');});
            setTimeout(function(){location.reload();},1000);
    };},500);
    
    setTimeout(function(){AtualizaTabelaFaixasKm();},1000);
};


// **************************** Inicia App
function initApp() {
    window.onbeforeunload = function() {};
    
    document.getElementById("DivFormApp").style.visibility = "visible";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "visible";
	document.getElementById("DivFormPopUpApp").style.visibility = "hidden";
	document.getElementById("DivFormFiltrar").style.visibility = "hidden";
	document.getElementById("DivFormConfigurar").style.visibility = "hidden";
	document.getElementById("DivFormMail").style.visibility = "hidden";
	document.getElementById("DivFormGerarMail").style.visibility = "hidden";
	document.getElementById("Alerta").style.visibility = "hidden";
	
    document.getElementById("Buscar").disabled = false;
    document.getElementById("Limpar").disabled = false;
    document.getElementById("Clonar").disabled = true;
    document.getElementById("Gravar").disabled = true;
    document.getElementById("Alterar").disabled = true;
    document.getElementById("Excluir").disabled = true;
    
    //setTimeout(function(){document.getElementById("ValorCombustivel").select();},100);
};



// **************************** Calcula Viagem
function CalculaViagem() {
    xDistancia = Number(document.FormApp.Distancia.value);
    
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

    // Custo Combustivel
	xOutros = Number(document.FormApp.Outros.value);
	xPorcentagemDesconto = Number(document.FormApp.PorcentagemDesconto.value);
	xAjuste = Number(document.FormApp.Ajuste.value);
	xValorCombustivel = Number(document.FormApp.ValorCombustivel.value);
	xCustoCombustivel = (xDistancia/xMediaConsumo)*xValorCombustivel;
	
    // Frete Liquido
	if (xDistancia>-1 && xDistancia<51){xValorKmCobrado = document.FormConfigurar.ValorKm1.value;};
	if (xDistancia>50 && xDistancia<101){xValorKmCobrado = document.FormConfigurar.ValorKm2.value;};
	if (xDistancia>100 && xDistancia<201){xValorKmCobrado = document.FormConfigurar.ValorKm3.value;};
	if (xDistancia>200 && xDistancia<301){xValorKmCobrado = document.FormConfigurar.ValorKm4.value;};
	if (xDistancia>300 && xDistancia<401){xValorKmCobrado = document.FormConfigurar.ValorKm5.value;};
	if (xDistancia>400 && xDistancia<501){xValorKmCobrado = document.FormConfigurar.ValorKm6.value;};
	if (xDistancia>500 && xDistancia<601){xValorKmCobrado = document.FormConfigurar.ValorKm7.value;};
	if (xDistancia>600 && xDistancia<701){xValorKmCobrado = document.FormConfigurar.ValorKm8.value;};
	if (xDistancia>700 && xDistancia<801){xValorKmCobrado = document.FormConfigurar.ValorKm9.value;};
	if (xDistancia>800 && xDistancia<901){xValorKmCobrado = document.FormConfigurar.ValorKm10.value;};
	if (xDistancia>900 && xDistancia<1001){xValorKmCobrado = document.FormConfigurar.ValorKm11.value;};
	if (xDistancia>1000){xValorKmCobrado = document.FormConfigurar.ValorKm12.value;};
	xFreteLiquido = (xValorKmCobrado*xDistancia);

    // Custo Total
    xPedagio = Number(document.FormApp.Pedagio.value);
    xAjudante = Number(document.FormApp.Ajudante.value);
    xCustoTotal = xCustoCombustivel+xPedagio+xAjudante;

    // Frete Total
    xFreteTotal = xFreteLiquido+xPedagio+xAjudante+xOutros;

    // Desconto Frete Liquido
    xDescontoFreteLiquido = (xValorKmCobrado*xDistancia)*(xPorcentagemDesconto/100);

    // Custo Km
    xCustoKm = xCustoTotal/xDistancia;

    // Total dos Servicos
    xTotalDosServicos = xFreteTotal-xAjuste-xDescontoFreteLiquido;

    // Receita Liquida
    xReceitaLiquida = xTotalDosServicos-xAjuste-xCustoTotal+xOutros;

    // Valor Km
    xValorKm = xTotalDosServicos/xDistancia;

    // Desconto Total
    xDescontoTotal = (100-(100*(xTotalDosServicos/xFreteTotal)));

    // Proposta
    xProposta = "" +
        "*Proposta:* \n \n" +
        "```Origem...``` _*"+document.FormApp.Origem.value+"*_ \n" +
        "```Destino..``` _*"+document.FormApp.Destino.value+"*_ \n" +
        "\n" +
        "```Frete..... +R$``` "+(xFreteTotal-xAjudante).toLocaleString('pt-BR',{style: 'decimal', minimumFractionDigits:2})+" \n" +
        "```Ajudante.. +R$``` "+xAjudante.toLocaleString('pt-BR',{style: 'decimal', minimumFractionDigits:2})+" \n" +
        "```Desconto.. -R$``` "+(xDescontoFreteLiquido+xAjuste).toLocaleString('pt-BR',{style: 'decimal', minimumFractionDigits:2})+" \n" +
        "\n" +
        "*Total dos Serviços R$ "+xTotalDosServicos.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"*";

    document.FormApp.Pedagio.value = parseFloat(document.FormApp.Pedagio.value).toFixed(2);
    document.FormApp.Ajudante.value = parseFloat(document.FormApp.Ajudante.value).toFixed(2);
    document.FormApp.Outros.value = parseFloat(document.FormApp.Outros.value).toFixed(2);
    document.FormApp.PorcentagemDesconto.value = parseFloat(document.FormApp.PorcentagemDesconto.value).toFixed(1);
    document.FormApp.Ajuste.value = parseFloat(document.FormApp.Ajuste.value).toFixed(2);

   	document.FormApp.CustoCombustivel.value = xCustoCombustivel.toFixed(2);
	document.FormApp.FreteLiquido.value=xFreteLiquido.toFixed(2);
	document.FormApp.CustoTotal.value = xCustoTotal.toFixed(2);
    document.FormApp.FreteTotal.value = xFreteTotal.toFixed(2);
    document.FormApp.DescontoFreteLiquido.value = xDescontoFreteLiquido.toFixed(2);
    document.FormApp.CustoKm.value = xCustoKm.toFixed(2);
    document.FormApp.TotalDosServicos.value = xTotalDosServicos.toFixed(2);
    document.FormApp.Margem.value = ((100*(xTotalDosServicos/xCustoTotal))-100).toFixed(1)+"%";
    document.FormApp.ReceitaLiquida.value = xReceitaLiquida.toFixed(2);
    document.FormApp.ValorKm.value = xValorKm.toFixed(2);
    document.FormApp.DescontoTotal.value = xDescontoTotal.toFixed(1);
    document.FormApp.Proposta.value = xProposta;
};



// **************************** Atualiza Combustivel
function AtualizaCombustivel() {
	xValorCombustivel = parseFloat(document.FormApp.ValorCombustivel.value).toFixed(2);
    document.FormApp.ValorCombustivel.value = xValorCombustivel;
    document.FormConfigurar.ConfigValorCombustivel.value = xValorCombustivel;

    AtualizaTabelaFaixasKm();
	setTimeout(function(){CalculaViagem()},200);
};



// **************************** Atualiza Tabela Faixas Km
function AtualizaTabelaFaixasKm() {
    xDescontoKm = 1+(xDescontoPorFaixaKm/100);
	xValorCombustivel = Number(document.FormApp.ValorCombustivel.value);
	xValorKmCheio = ((xValorCombustivel/xMediaConsumo)*3.5).toFixed(2);
	
	document.FormConfigurar.ValorKm1.value = xValorKmCheio;
	document.FormConfigurar.ValorKm2.value = (document.FormConfigurar.ValorKm1.value/xDescontoKm).toFixed(2);
	document.FormConfigurar.ValorKm3.value = (document.FormConfigurar.ValorKm2.value/xDescontoKm).toFixed(2);
	document.FormConfigurar.ValorKm4.value = (document.FormConfigurar.ValorKm3.value/xDescontoKm).toFixed(2);
	document.FormConfigurar.ValorKm5.value = (document.FormConfigurar.ValorKm4.value/xDescontoKm).toFixed(2);
	document.FormConfigurar.ValorKm6.value = (document.FormConfigurar.ValorKm5.value/xDescontoKm).toFixed(2);
	document.FormConfigurar.ValorKm7.value = (document.FormConfigurar.ValorKm6.value/xDescontoKm).toFixed(2);
	document.FormConfigurar.ValorKm8.value = (document.FormConfigurar.ValorKm7.value/xDescontoKm).toFixed(2);
	document.FormConfigurar.ValorKm9.value = (document.FormConfigurar.ValorKm8.value/xDescontoKm).toFixed(2);
	document.FormConfigurar.ValorKm10.value = (document.FormConfigurar.ValorKm9.value/xDescontoKm).toFixed(2);
	document.FormConfigurar.ValorKm11.value = (document.FormConfigurar.ValorKm10.value/xDescontoKm).toFixed(2);
	document.FormConfigurar.ValorKm12.value = (document.FormConfigurar.ValorKm11.value/xDescontoKm).toFixed(2);
};



// **************************** Opção Buscar
function BuscaProposta() {
    window.onbeforeunload = function() {return "";};
    document.getElementById("DivFormApp").style.visibility = "hidden";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "hidden";
    document.getElementById("DivFormPopUpApp").style.visibility = "visible";

    xProcurandoProposta = 'Sim';
    
    if (document.FormFiltrar.ProcurarPor.value == ""){
        document.getElementById("DivFormFiltrar").style.visibility = "hidden";
        query = "SELECT * FROM Propostas ORDER by DataRegistro DESC;";
    }
    else {
        document.getElementById("DivFormFiltrar").style.visibility = "hidden";
        document.getElementById("DivFormPopUpApp").style.visibility = "visible";

        query = "SELECT * FROM Propostas WHERE Busca LIKE '%"+document.FormFiltrar  .ProcurarPor.value+"%' ORDER by DataRegistro DESC;";
    };

	localDB.transaction(function(transaction){
			transaction.executeSql(query, [], function(transaction, results){

			var tabela = "<hr>" +
            	"<table class='TabelasApp' cellpadding='0px' width='100%'>" ;
            	for (var i = 0; i < results.rows.length; i++) {
            		var row = results.rows.item(i);
                    xData = row['DataRegistro'];                    
                    xResultado = (xData.substr(0,17) + " | " + row['Origem'] + " X " + row['Destino'] + " - " + row['Nome']).substr(0,55);

            		tabela +=
            			"<tr height='25px' onclick='RegisroSelecionado("+ row['Id'] +")'>" +
                            "<td colspan='2' style='font-size: 10pt;'><a href='#' onclick='ExcluiProposta();'><b>X </b></a>"+ xResultado + "</td>" +
            			"</tr>" ;
            	};
                    tabela +=
                    "<tr height='30px'><td colspan='2'><hr></td></tr>" +
                    "<tr>" +                        
                        "<td align='left'>" +
                            "<input class='Botao' type='button' value='  Voltar  ' onclick='FecharBusca()'/>" +
                        "</td>" +
                        "<td align='right'>" +
                            "<input class='Botao' type='button' value='  Filtrar  ' onclick='FiltrarBusca()'/>" +
                        "</td>" +
                    "</tr>" +
                "</table>" +
                "<br><hr>" ;

                document.FormFiltrar.ProcurarPor.value = "";
            	document.getElementById("DivFormPopUpApp").innerHTML = tabela;
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
    
    window.onbeforeunload = function() {};
    document.getElementById("DivFormPopUpApp").style.visibility = "hidden";
    document.getElementById("DivFormApp").style.visibility = "visible";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "visible";

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
            document.FormConfigurar.ConfigValorCombustivel.value = row['ValorLitroCombustivel'].toFixed(2);
            document.FormConfigurar.ConfigMediaConsumo.value = MediaConsumo = row['MediaConsumo'].toFixed(2);
            document.FormConfigurar.ConfigDescontoPorFaixaKm.value = row['DescontoPorFaixaKm'].toFixed(2);

			setTimeout(function(){AtualizaCombustivel()},100);

		}, function(transaction, error){alert("Erro: " + error.code + ' | ' + error.message);})
	});
	//document.getElementById("ValorCombustivel").select();
};



// **************************** Filtrar Busca
function FiltrarBusca() {
    document.getElementById("DivFormPopUpApp").style.visibility = "hidden";
    document.getElementById("DivFormFiltrar").style.visibility = "visible";
    //document.getElementById("ProcurarPor").select();
};



// **************************** Fechar Busca
function FecharBusca() {
    xProcurandoProposta = 'Nao';

    window.onbeforeunload = function() {};
    document.getElementById("DivFormPopUpApp").style.visibility = "hidden";
    document.getElementById("DivFormFiltrar").style.visibility = "hidden";
    document.getElementById("DivFormApp").style.visibility = "visible";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "visible";
    //document.getElementById("ValorCombustivel").select();
};



// **************************** Opção Gravar / Alterar
function GravaProposta() {
    xAgora = new Date();
    var dia = xAgora.getDate();
    if (xAgora.getDate()<10){var dia = String(xAgora.getDate()).padStart(2, '0');} else{var dia = xAgora.getDate()};
    if (xAgora.getMonth()+1<10){var mes = String(xAgora.getMonth()+1).padStart(2, '0');} else{var mes = xAgora.getMonth()+1()};
    var ano = xAgora.getFullYear();
    var hora = xAgora.getHours();
    if (xAgora.getMinutes()<10){var minuto = String(xAgora.getMinutes()).padStart(2, '0');} else{var minuto = xAgora.getMinutes()};
    xAgora = dia+"/"+mes+"/"+ano+" "+hora+":"+minuto;

    xOrigem = document.FormApp.Origem.value;
    xDestino = document.FormApp.Destino.value;
    xNome = document.FormApp.Nome.value;
    xTelefone = document.FormApp.Telefone.value;
    xDistancia = Number(document.FormApp.Distancia.value);
    xPedagio = Number(document.FormApp.Pedagio.value);
	xAjudante = Number(document.FormApp.Ajudante.value);
	xOutros = Number(document.FormApp.Outros.value);
    xPorcentagemDesconto = Number(document.FormApp.PorcentagemDesconto.value);
	xAjuste = Number(document.FormApp.Ajuste.value);
	xMediaConsumo = Number(document.FormConfigurar.ConfigMediaConsumo.value);
    xDescontoPorFaixaKm = Number(document.FormConfigurar.ConfigDescontoPorFaixaKm.value);
    xValorCombustivel = Number(document.FormApp.ValorCombustivel.value);

    if (xNovaProposta == 'Sim'){
        localDB.transaction(function(tx) {tx.executeSql('INSERT INTO Propostas (Origem, Destino, Nome, Telefone, ValorLitroCombustivel, Distancia, Pedagio, Ajudante, Outros, PorcentagemDesconto, Ajuste, MediaConsumo, DescontoPorFaixaKm, DataRegistro, Busca) VALUES ("'+xOrigem+'", "'+xDestino+'", "'+xNome+'", "'+xTelefone+'", '+xValorCombustivel+', '+xDistancia+', '+xPedagio+', '+xAjudante+', '+xOutros+', '+xPorcentagemDesconto+', '+xAjuste+', '+xMediaConsumo+', '+xDescontoPorFaixaKm+', "'+xAgora+'", "'+xOrigem+' '+xDestino+' '+xNome+' '+xTelefone+'");');});
        
        query = "SELECT Id FROM Propostas WHERE ID = (SELECT MAX(ID) FROM Propostas);";
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], function(transaction, results){
            var row = results.rows.item(0);
            xId = row['Id'];
        }, function(transaction, error){alert("Erro: " + error.code + ' | ' + error.message);
            window.scrollTo(0, 0);
            //document.getElementById("ValorCombustivel").select();
            return;})
        });

        xNovaProposta = 'Nao';

        // Atualiza Combustivel, Média Consumo e Desconto Por FaixaKm
        xValorCombustivel = Number(document.FormApp.ValorCombustivel.value);
        localDB.transaction(function(tx) {tx.executeSql('UPDATE Combustivel SET ValorCombustivel='+xValorCombustivel+', MediaConsumo='+xMediaConsumo+', DescontoPorFaixaKm='+xDescontoPorFaixaKm+';');});

        document.getElementById("Gravar").disabled = true;
        document.getElementById("Alterar").disabled = false;
        document.getElementById("Excluir").disabled = false;
        document.getElementById("Clonar").disabled = false;

        xTituloMsgAlerta = "Ok !";
        xMensagemAlerta = "Proposta Gravada";
        Alerta();
    }
    else {
        localDB.transaction(function(tx) {tx.executeSql('UPDATE Propostas SET Origem="'+xOrigem+'", Destino="'+xDestino+'", Nome="'+xNome+'", Telefone="'+xTelefone+'", ValorLitroCombustivel='+xValorCombustivel+', Distancia='+xDistancia+', Pedagio='+xPedagio+', Ajudante='+xAjudante+', Outros='+xOutros+', PorcentagemDesconto='+xPorcentagemDesconto+', Ajuste='+xAjuste+', MediaConsumo='+xMediaConsumo+', DescontoPorFaixaKm='+xDescontoPorFaixaKm+', DataRegistro="'+xAgora+'", Busca="'+xOrigem+' '+xDestino+' '+xNome+' '+xTelefone+'" WHERE Id='+xId+';');});
        
        xTituloMsgAlerta = "Ok !";
        xMensagemAlerta = "Proposta "+xId+" Alterada";
        Alerta();
    };
    window.scrollTo(0, 0);
    //document.getElementById("ValorCombustivel").select();
};



// **************************** Opção Excluir
function ExcluiProposta() {
    if (confirm("\n Deseja realmente excluir esta Proposta ?") == true) {
        localDB.transaction(function(tx) {tx.executeSql('DELETE FROM Propostas WHERE Id = '+xId+';');});

        xTituloMsgAlerta = "Ok !";
        xMensagemAlerta = "Proposta "+xId+" Apagada";
        Alerta();

        if (xProcurandoProposta == "Nao"){
            window.onbeforeunload = function() {};
            setTimeout(function(){location.reload()},200);
        };
    };
    if (xProcurandoProposta == "Sim"){setTimeout(function(){BuscaProposta()},200);};
};



// **************************** Opção Configurar
function ConfigurarApp() {
    window.scrollTo(0, 0);

    window.onbeforeunload = function() {return "";};
    document.getElementById("DivFormApp").style.visibility = "hidden";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "hidden";
    document.getElementById("DivFormConfigurar").style.visibility = "visible";
    //document.getElementById("ConfigValorCombustivel").select();
};



// **************************** Opção Gravar Configurar App
function GravarConfigApp() {
    xValorCombustivel = parseFloat(document.FormConfigurar.ConfigValorCombustivel.value).toFixed(2);
    xMediaConsumo = parseFloat(document.FormConfigurar.ConfigMediaConsumo.value).toFixed(2);
    xDescontoPorFaixaKm = parseFloat(document.FormConfigurar.ConfigDescontoPorFaixaKm.value).toFixed(2);

    document.getElementById("ConfigOk").value = "Ok! Gravado";
    setTimeout(function(){document.getElementById("ConfigOk").value = "Gravar";},3000);
    
    document.FormApp.ValorCombustivel.value = xValorCombustivel;
    document.FormConfigurar.ConfigValorCombustivel.value = xValorCombustivel;
    document.FormConfigurar.ConfigMediaConsumo.value = xMediaConsumo;
    document.FormConfigurar.ConfigDescontoPorFaixaKm.value = xDescontoPorFaixaKm;

    window.scrollTo(0, 0);
    
    // Atualiza Combustivel, Média Consumo e Desconto Por FaixaKm
    xValorCombustivel = Number(document.FormApp.ValorCombustivel.value);
    localDB.transaction(function(tx) {tx.executeSql('UPDATE Combustivel SET ValorCombustivel='+xValorCombustivel+', MediaConsumo='+xMediaConsumo+', DescontoPorFaixaKm='+xDescontoPorFaixaKm+';');});
    
    AtualizaTabelaFaixasKm();
    setTimeout(function(){CalculaViagem()},200);
};



// **************************** Opção Voltar Configurar App
function VoltarConfigApp() {
    window.scrollTo(0, 0);

    window.onbeforeunload = function() {};
    document.getElementById("DivFormConfigurar").style.visibility = "hidden";
    document.getElementById("DivFormApp").style.visibility = "visible";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "visible";
    document.getElementById("ConfigValorCombustivel").select();
};



// **************************** Opção Limpar
function LimpaProposta() {
    location.reload();
    window.scrollTo(0, 0);
};



// **************************** Opção Clonar
function ClonaProposta() {
    xNovaProposta = 'Sim';
    GravaProposta();
    //document.getElementById("ValorCombustivel").select();
    window.scrollTo(0, 0);
};



// **************************** Criar EMail
function EmailApp() {
    window.onbeforeunload = function() {return "";};
    document.getElementById("DivFormApp").style.visibility = "hidden";
	document.getElementById("DivOpcoesHomeApp").style.visibility = "hidden";
	document.getElementById("DivFormMail").style.visibility = "visible";
    //document.getElementById("DataMail1").select();
    window.scrollTo(0, 0);
};



// **************************** Gerar o corpo do eMail
function GerarMail() {
    DivFormGerarMail.classList.add("PopUpTextoMail");

    window.onbeforeunload = function() {return "";};
	document.getElementById("DivFormMail").style.visibility = "hidden";
	document.getElementById("DivFormGerarMail").style.visibility = "visible";
	document.getElementById("BotoesMail").style.visibility = "visible";

    xTotalServicosEmail = 0;
    xTextoEmail = "<table cellspacing='0px' style='width: 100%; align: center; font-family: calibri; font-size: 10pt; color: #8D8D8D;'>"
                + "<tr style='height: 12px;'><td colspan='3'></tr></td>"
                + "<tr><td colspan='3'> Prezados, anexo Documentação referente a:</tr></td>"
                + "<tr style='height: 12px;'><td colspan='3'></tr></td>";

    if (document.FormCriarMail.DataMail1.value !== "") {
        xTextoEmail += "<tr bgcolor='#F5F5F5' style='height: 40px;'>"
                     + "<td style='text-align:center; width: 45px;'>" + document.FormCriarMail.DataMail1.value + "</td>"
                     + "<td> " + document.FormCriarMail.DescricaoMail1.value + "</td>"
                     + "<td style='text-align: right; width: 115px;'>R$ " + Number(document.FormCriarMail.Valor1.value).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "  </td></tr>";
        xTotalServicosEmail += Number(document.FormCriarMail.Valor1.value);
    };
    if (document.FormCriarMail.DataMail2.value !== "") {
        xTextoEmail += "<tr bgcolor='#FFFFEA' style='height: 40px;'>"
                     + "<td style='text-align:center; width: 45px;'>" + document.FormCriarMail.DataMail2.value + "</td>"
                     + "<td> " + document.FormCriarMail.DescricaoMail2.value + "</td>"
                     + "<td style='text-align: right; width: 115px;'>R$ " + Number(document.FormCriarMail.Valor2.value).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "  </td></tr>";
        xTotalServicosEmail += Number(document.FormCriarMail.Valor2.value);
    };
    if (document.FormCriarMail.DataMail3.value !== "") {
        xTextoEmail += "<tr bgcolor='#F5F5F5' style='height: 40px;'>"
                     + "<td style='text-align:center; width: 45px;'>" + document.FormCriarMail.DataMail3.value + "</td>"
                     + "<td> " + document.FormCriarMail.DescricaoMail3.value + "</td>"
                     + "<td style='text-align: right; width: 115px;'>R$ " + Number(document.FormCriarMail.Valor3.value).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "  </td></tr>";
        xTotalServicosEmail += Number(document.FormCriarMail.Valor3.value);
    };
    if (document.FormCriarMail.DataMail4.value !== "") {
        xTextoEmail += "<tr bgcolor='#FFFFEA' style='height: 40px;'>"
                     + "<td style='text-align:center; width: 45px;'>" + document.FormCriarMail.DataMail4.value + "</td>"
                     + "<td> " + document.FormCriarMail.DescricaoMail4.value + "</td>"
                     + "<td style='text-align: right; width: 115px;'>R$ " + Number(document.FormCriarMail.Valor4.value).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "  </td></tr>";
        xTotalServicosEmail += Number(document.FormCriarMail.Valor4.value);
    };
    if (document.FormCriarMail.DataMail5.value !== "") {
        xTextoEmail += "<tr bgcolor='#F5F5F5' style='height: 40px;'>"
                     + "<td style='text-align:center; width: 45px;'>" + document.FormCriarMail.DataMail5.value + "</td>"
                     + "<td> " + document.FormCriarMail.DescricaoMail5.value + "</td>"
                     + "<td style='text-align: right; width: 115px;'>R$ " + Number(document.FormCriarMail.Valor5.value).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "  </td></tr>";
        xTotalServicosEmail += Number(document.FormCriarMail.Valor5.value);
    };
    if (document.FormCriarMail.DataMail6.value !== "") {
        xTextoEmail += "<tr bgcolor='#FFFFEA' style='height: 40px;'>"
                     + "<td style='text-align:center; width: 45px;'>" + document.FormCriarMail.DataMail6.value + "</td>"
                     + "<td> " + document.FormCriarMail.DescricaoMail6.value + "</td>"
                     + "<td style='text-align: right; width: 115px;'>R$ " + Number(document.FormCriarMail.Valor6.value).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "  </td></tr>";
        xTotalServicosEmail += Number(document.FormCriarMail.Valor6.value);
    };
    if (document.FormCriarMail.DataMail7.value !== "") {
        xTextoEmail += "<tr bgcolor='#F5F5F5' style='height: 40px;'>"
                     + "<td style='text-align:center; width: 45px;'>" + document.FormCriarMail.DataMail7.value + "</td>"
                     + "<td> " + document.FormCriarMail.DescricaoMail7.value + "</td>"
                     + "<td style='text-align: right; width: 115px;'>R$ " + Number(document.FormCriarMail.Valor7.value).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "  </td></tr>";
        xTotalServicosEmail += Number(document.FormCriarMail.Valor7.value);
    };
    if (document.FormCriarMail.DataMail8.value !== "") {
        xTextoEmail += "<tr bgcolor='#FFFFEA' style='height: 40px;'>"
                     + "<td style='text-align:center; width: 45px;'>" + document.FormCriarMail.DataMail8.value + "</td>"
                     + "<td> " + document.FormCriarMail.DescricaoMail8.value + "</td>"
                     + "<td style='text-align: right; width: 115px;'>R$ " + Number(document.FormCriarMail.Valor8.value).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "  </td></tr>";
        xTotalServicosEmail += Number(document.FormCriarMail.Valor8.value);
    };
    if (document.FormCriarMail.DataMail9.value !== "") {
        xTextoEmail += "<tr bgcolor='#F5F5F5' style='height: 40px;'>"
                     + "<td style='text-align:center; width: 45px;'>" + document.FormCriarMail.DataMail9.value + "</td>"
                     + "<td> " + document.FormCriarMail.DescricaoMail9.value + "</td>"
                     + "<td style='text-align: right; width: 115px;'>R$ " + Number(document.FormCriarMail.Valor9.value).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "  </td></tr>";
        xTotalServicosEmail += Number(document.FormCriarMail.Valor9.value);
    };
    if (document.FormCriarMail.DataMail10.value !== "") {
        xTextoEmail += "<tr bgcolor='#FFFFEA' style='height: 40px;'>"
                     + "<td style='text-align:center; width: 45px;'>" + document.FormCriarMail.DataMail10.value + "</td>"
                     + "<td> " + document.FormCriarMail.DescricaoMail10.value + "</td>"
                     + "<td style='text-align: right; width: 115px;'>R$ " + Number(document.FormCriarMail.Valor10.value).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "  </td></tr>";
        xTotalServicosEmail += Number(document.FormCriarMail.Valor10.value);
    };

    xTextoEmail += "<tr style='height: 15px;'><td colspan='3'></td></tr>"
                 + "<tr><td colspan='2' style='text-align: right;'>Total dos Serviços:</td>"
                    + "<td style='text-align: right;'><b>R$ "+xTotalServicosEmail.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"  </b></td></tr>";

    if (Number(document.FormCriarMail.Desconto.value) > 0) {
        xTotalServicosEmail -= document.FormCriarMail.Desconto.value;
        xTextoEmail += "<tr><td colspan='2' style='text-align: right; color: red;'>Desconto:"
                     + "<td colspan='2' style='text-align: right; color: red;'><b>R$ "+Number(document.FormCriarMail.Desconto.value).toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"  </b></td></tr>"
                     + "<tr><td colspan='2'></td><td style='border-top: 1px solid #D3D3D3;'></td></tr>"
                    + "<tr><td colspan='2' style='padding-top: 12px; text-align: right;'>Total à Receber:"
                     + "<td colspan='2' style='text-align: right;'><b>R$ "+xTotalServicosEmail.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"  </b></td></tr>";
    };

    xTextoEmail += "<tr style='height: 10px;'><td colspan='3'></td></tr>"
                + "<tr><td colspan='3' style='border-top: 1px solid #D3D3D3;'></td></tr>"
                + "<tr><td colspan='3' style='height: 23px; padding-top: 5px;'> Pagador: <b>" + document.FormCriarMail.Pagador.value + "</b></td></tr>"
                + "<tr><td colspan='3' style='height: 23px;'> Vencimento: <b>" + document.FormCriarMail.Vencimento.value + "</b></td></tr>"
                + "<tr><td colspan='3' style='height: 23px; padding-bottom: 8px;'> Código de Barras: <font size=1pt><b>" + document.FormCriarMail.CodigoDeBarras.value + "</b></font></td></tr>"
                + "<tr><td colspan='3' style='border-top: 1px solid #D3D3D3;'></td></tr>"
                + "<tr><td colspan='3' style='height: 15px;'></td></tr>"
                + "<tr><td colspan='3' style='height: 30px;'> Atenciosamente,</td></tr>"
                + "<tr><td colspan='3' style='height: 12px;'></td></tr>"
                + "<tr><td colspan='3'> <i>Rogério Xavier</i></td></tr>"
                + "<tr><td colspan='3'> <a href='#' onclick='VoltarMail();'><font size=1pt><i>(15)</font><b>99745-0446</b></i></a></td></tr>"
                + "<tr><td colspan='3' style='border-top: 1px solid #D3D3D3;'></td></tr>"
                + "<tr style='height: 8px;'><td colspan='3'></tr></td>"
                + "<tr><td colspan='3'> </tr></td>";
            + "</table>";

    document.getElementById("TextoEmail").innerHTML = xTextoEmail;

    window.scrollTo(0, 0);
};



// **************************** Tela para copiar o corpo do eMail
function CopiarMail() {
    document.getElementById("BotoesMail").style.visibility = "hidden";
    setTimeout(function(){document.getElementById("BotoesMail").style.visibility = "visible";},3000);
    return;

    var email = "xavier.rogerio@gmail.com";
    var assunto = "Ola!";
    var corpo = "Teste";
    window.open("mailto:" + email + "?subject=" + assunto + "&body=" + corpo);
};



// **************************** Continuar editando o eMail
function VoltarMail() {
    DivFormGerarMail.classList.remove("PopUpTextoMail");

	document.getElementById("DivFormGerarMail").style.visibility = "hidden";
	document.getElementById("BotoesMail").style.visibility = "hidden";
	document.getElementById("DivFormMail").style.visibility = "visible";
	//document.getElementById("DataMail1").select();
	window.scrollTo(0, 0);
};



// **************************** Fechar pop do eMail
function FecharMail() {
    window.onbeforeunload = function() {};
	document.getElementById("DivFormMail").style.visibility = "hidden";
	document.getElementById("BotoesMail").style.visibility = "hidden";
    document.getElementById("DivFormApp").style.visibility = "visible";
	document.getElementById("DivOpcoesHomeApp").style.visibility = "visible";
	window.scrollTo(0, 0);
};



// **************************** Copiar Texto da Proposta simulando "Ctrl+x"
function CopiarTextoProposta() {
    document.FormApp.Proposta.select();
    document.execCommand("copy");

    document.getElementById("BotaoCopiarProposta").select()
    document.getElementById("BotaoCopiarProposta").value = "* * * Proposta Copiada ! * * *";
    setTimeout(function(){document.getElementById("BotaoCopiarProposta").value = "Copiar Texto Proposta";},10000);
};



// **************************** Máscara para Telefones
function MascaraTelefone(Telefone){
    if (Telefone.value==" "){ Telefone.value = "" };
    if (Telefone.value.length == 1){ Telefone.value = "(" + Telefone.value };
    if (Telefone.value.length == 3){ Telefone.value += ")" };
    if (Telefone.value.length == 9){ Telefone.value += "-" };
}



// **************************** Máscara para Datas
function MascaraData(Data){
    if (Data.value==" "){ Data.value = "" };
    if (Data.value.length == 2){ Data.value += "/" };
    if (Data.value.length == 5){ Data.value += "/" };
}



// **************************** PopUp de Mensagem de Alerta
function Alerta(){
    document.getElementById("Alerta").style.visibility = "visible";
    var msg_alerta = '<div class="FundoTransparente"></div>'
                    +'<div class="Alerta">'
                        +'<h1>'+xTituloMsgAlerta+'</h1>'
                        +'<p>'+xMensagemAlerta+'</p>'
                        +'<input id="AlertaOk" style="padding:5px 10px;" type="button" value="OK" onclick="FecharAlerta()" />'
                    +'</div>';
    document.getElementById("Alerta").innerHTML = msg_alerta;
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
            localDB.transaction(function(tx) {tx.executeSql('DROP TABLE FaixasKM;');});
            localDB.transaction(function(tx) {tx.executeSql('DROP TABLE Propostas;');});

            xTituloMsgAlerta = "Ok !";
            xMensagemAlerta = "Banco de Dados Apagado";
            Alerta();

            setTimeout(function(){location.reload();},1000);
        };
    };
};
