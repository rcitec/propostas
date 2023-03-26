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
xValorMaximoKmCobrado = 0;
xValorMinimoKmCobrado = 0;
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
xClonar = "Nao";
xEmail = false;
xTextoEmail = "";
xTotalServicosEmail = 0;
xDescontoEmail = 0;
xNovaProposta = 'Sim';
xProcurandoProposta = 'Nao';
xTituloMsgAlerta = "";
xMensagemAlerta = "";
xNomeUsuario = "";
xTelefoneUsuario = "";

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

	localDB.transaction(function(tx) {tx.executeSql('CREATE TABLE Combustivel(Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ValorCombustivel INTEGER NULL, MediaConsumo INTEGER NULL, DescontoPorFaixaKm INTEGER NULL, NomeUsuario TEXTE NULL, TelefoneUsuario TEXTE NULL);');});
	localDB.transaction(function(tx) {tx.executeSql('CREATE TABLE Propostas(Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, Origem TEXT NULL, Destino TEXT NULL, Nome TEXT NULL, Telefone TEXT NULL, ValorLitroCombustivel INTEGER NULL, Distancia INTEGER NULL, Pedagio INTEGER NULL, Ajudante INTEGER NULL, Outros INTEGER NULL, PorcentagemDesconto TEXT NULL, Ajuste INTEGER NULL, MediaConsumo INTEGER NULL, DescontoPorFaixaKm INTEGER NULL, DescontoFreteLiquido INTEGER NULL, TotalDosServicos INTEGER NULL, DataRegistro INTEGER NULL, Busca TEXT NULL, Email INTEGER FALSE);');});
	
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
			xNomeUsuario = row['NomeUsuario'];
			xTelefoneUsuario = row['TelefoneUsuario'];
			document.FormApp.ValorCombustivel.value = row['ValorCombustivel'].toFixed(2);
            document.FormConfigurar.ConfigValorCombustivel.value = row['ValorCombustivel'].toFixed(2);
            document.FormConfigurar.ConfigMediaConsumo.value = row['MediaConsumo'].toFixed(2);
            document.FormConfigurar.ConfigDescontoPorFaixaKm.value = row['DescontoPorFaixaKm'].toFixed(2);
            document.FormConfigurar.NomeUsuario.value = row['NomeUsuario'];
            document.FormConfigurar.TelefoneUsuario.value = row['TelefoneUsuario'];
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
    xPedagio = Number(document.FormApp.Pedagio.value);
    xAjudante = Number(document.FormApp.Ajudante.value);

    // Valor por Faixa de Km
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

    // Valor Minimo e Máximo do Km Cobrado
	xValorMaximoKmCobrado = document.FormConfigurar.ValorKm1.value;
	xValorMinimoKmCobrado = document.FormConfigurar.ValorKm12.value;

    // Frete Liquido
	xFreteLiquido = (xValorKmCobrado*xDistancia)-((xValorKmCobrado*xDistancia)*(xPorcentagemDesconto/100))-xAjuste+xOutros;
    
    // Frete Total
    xFreteTotal = xValorMaximoKmCobrado*xDistancia;

    // Desconto Frete Liquido
    xDescontoFreteLiquido = xFreteTotal-xFreteLiquido+xOutros;

    // Custo Total
    xCustoTotal = xCustoCombustivel+xPedagio+xAjudante;

    // Custo Km
    xCustoKm = Number((xCustoTotal/xDistancia).toFixed(2));

    // Total dos Servicos
    xTotalDosServicos = xFreteLiquido+xPedagio+xAjudante;

    // Receita Liquida
    xReceitaLiquida = xTotalDosServicos-xAjuste-xCustoTotal+xOutros;

    // Valor Km
    xValorKm = (xFreteLiquido/xDistancia);
    xValorKm = String(xValorKm.toFixed(2));
    xValorKm = Number(xValorKm);

    // Desconto Total
    xDescontoTotal = (xDescontoFreteLiquido/(xFreteTotal+xPedagio+xOutros))*100;
    xDescontoTotal = String(xDescontoTotal.toFixed(2));
    xDescontoTotal = Number(xDescontoTotal);

    document.FormApp.Pedagio.value = parseFloat(document.FormApp.Pedagio.value).toFixed(2);
    document.FormApp.Ajudante.value = parseFloat(document.FormApp.Ajudante.value).toFixed(2);
    document.FormApp.Outros.value = parseFloat(document.FormApp.Outros.value).toFixed(2);
    document.FormApp.PorcentagemDesconto.value = parseFloat(document.FormApp.PorcentagemDesconto.value).toFixed(2);
    document.FormApp.Ajuste.value = parseFloat(document.FormApp.Ajuste.value).toFixed(2);
   	document.FormApp.CustoCombustivel.value = xCustoCombustivel.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
	document.FormApp.FreteLiquido.value=xFreteLiquido.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
	document.FormApp.CustoTotal.value = xCustoTotal.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.FreteTotal.value = xFreteTotal.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.DescontoFreteLiquido.value = xDescontoFreteLiquido.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.CustoKm.value = xCustoKm.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.TotalDosServicos.value = xTotalDosServicos.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})
    document.FormApp.Margem.value = ((100*(xTotalDosServicos/xCustoTotal))-100).toFixed(1)+"%";
    document.FormApp.ReceitaLiquida.value = xReceitaLiquida.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.ValorKm.value = xValorKm.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2});
    document.FormApp.DescontoTotal.value = xDescontoTotal.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"%";

    // Proposta
    xDescontoTotal = String(xDescontoTotal.toFixed(1));
    xDescontoTotal = Number(xDescontoTotal);

    xProposta = "" +
        "*Proposta:* \n \n" +
        "```Origem.:``` _*"+document.FormApp.Origem.value+"*_ \n" +
        "```Destino:``` _*"+document.FormApp.Destino.value+"*_ \n" +
        "\n" +
        "```Frete....: +R$``` "+Number(xFreteTotal+xPedagio+xOutros).toLocaleString('pt-BR',{style: 'decimal', minimumFractionDigits:2})+" \n" +
        "```Desconto.: -R$``` "+xDescontoFreteLiquido.toLocaleString('pt-BR',{style: 'decimal', minimumFractionDigits:2})+" ("+xDescontoTotal.toLocaleString('pt-BR',{style: 'decimal', minimumFractionDigits:1})+ "%)\n" +
        "```Ajudante.: +R$``` "+xAjudante.toLocaleString('pt-BR',{style: 'decimal', minimumFractionDigits:2})+" \n" +
        "\n" +
        "*Total dos Serviços R$ "+xTotalDosServicos.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"*";
    document.FormApp.Proposta.value = xProposta;

    if (xValorKm < xValorMinimoKmCobrado-.005) {
        xTituloMsgAlerta = "Atenção !";
        xMensagemAlerta = "O Valor do Km Cobrado está abaixo do Mínimo.";
        Alerta();
    };
};



// **************************** Atualiza Combustivel
function AtualizaCombustivel() {
	xValorCombustivel = parseFloat(document.FormApp.ValorCombustivel.value).toFixed(2);
    document.FormApp.ValorCombustivel.value = xValorCombustivel;
    document.FormConfigurar.ConfigValorCombustivel.value = xValorCombustivel;

    AtualizaTabelaFaixasKm();
	setTimeout(function(){CalculaViagem()},300);
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
    document.getElementById("DivFormApp").style.visibility = "hidden";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "hidden";
    document.getElementById("DivFundoApp").style.visibility = "visible";

    xProcurandoProposta = 'Sim';
    
    if (document.FormFiltrar.ProcurarPor.value == ""){
        document.getElementById("DivFormFiltrar").style.visibility = "hidden";
        query = "SELECT * FROM Propostas ORDER by DataRegistro DESC;";
    }
    else {
        document.getElementById("DivFormFiltrar").style.visibility = "hidden";

        query = "SELECT * FROM Propostas WHERE Busca LIKE '%"+document.FormFiltrar.ProcurarPor.value+"%' ORDER by DataRegistro DESC;";
    };

	localDB.transaction(function(transaction){
			transaction.executeSql(query, [], function(transaction, results){

			var tabela = "<hr>" +
            	"<table class='TabelasApp' cellpadding='0px' width='100%'>" ;
            	for (var i = 0; i < results.rows.length; i++) {
            		var row = results.rows.item(i);

            		if (row['Email'] == 0){var xCorFonte = "black"} else{var xCorFonte = "blue"};

                    xData = row['DataRegistro'];
                    xResultado = (xData.substr(0,17) + " | " + row['Origem'] + " X " + row['Destino'] + " | " + row['Nome']).substr(0,60);

            		tabela +=
            			"<tr height='25px' style='color:"+xCorFonte+";'>" +
                            "<td style='font-size: 10pt; align:left; width:12px; color:red;' onclick='ExcluiProposta();'><b>X</b></td>" +
                            "<td onclick='RegisroSelecionado("+ row['Id'] +")'>"+xResultado+"</td>" +
            			"</tr>";
            	};
                    tabela +=
                    "<tr height='30px'><td colspan='2'><hr></td></tr>" +
                    "<tr>" +                        
                        "<td colspan='2' align='center'>" +
                            "<input type='button' value='  Voltar  ' onclick='FecharBusca()'/>        " +
                            "<input type='button' value=' Limpar Marcações eMail ' onclick='LimpaStatusEmail()'/>        " +
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
            document.getElementById("RegistroDataAtual").value = "Id "+row['Id']+" - "+row['DataRegistro'];
            document.FormConfigurar.ConfigValorCombustivel.value = row['ValorLitroCombustivel'].toFixed(2);
            document.FormConfigurar.ConfigMediaConsumo.value = row['MediaConsumo'].toFixed(2);
            document.FormConfigurar.ConfigDescontoPorFaixaKm.value = row['DescontoPorFaixaKm'].toFixed(2);
            xMediaConsumo = row['MediaConsumo'].toFixed(2);
            xDescontoPorFaixaKm = row['DescontoPorFaixaKm'].toFixed(2);

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



// **************************** Formata Número para 2 digitos decimais
function FormataNumero(xNumero) {
    xNumero.value = parseFloat(xNumero.value).toFixed(2);
};



// **************************** Altera Data do Registro
function AlteraDataAutal() {
    document.getElementById("DivFormApp").style.visibility = "hidden";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "hidden";
    document.getElementById("DivFundoApp").style.visibility = "visible";
    document.getElementById("DivFormAlterarData").style.visibility = "visible";
    document.getElementById("AlterarData").select();
}



// **************************** Grava nova Data do Registro
function GravaNovaData() {
    document.getElementById("DivFormApp").style.visibility = "visible";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "visible";
    document.getElementById("DivFundoApp").style.visibility = "hidden";
    document.getElementById("DivFormAlterarData").style.visibility = "hidden";

    if (document.FormAlterarData.AlterarData.value == ""){Return;};

    xAgora = new Date();
    var dia = xAgora.getDate();
    if (xAgora.getHours()<10){var hora = String(xAgora.getHours()).padStart(2, '0');} else{var hora = xAgora.getHours()};
    if (xAgora.getMinutes()<10){var minuto = String(xAgora.getMinutes()).padStart(2, '0');} else{var minuto = xAgora.getMinutes()};
    xAgora = hora+":"+minuto;

    document.getElementById("RegistroDataAtual").value = "Id "+xId+" - "+document.FormAlterarData.AlterarData.value+" "+xAgora;

    localDB.transaction(function(tx) {tx.executeSql('UPDATE Propostas SET DataRegistro="'+document.FormAlterarData.AlterarData.value+' '+xAgora+'" WHERE Id='+xId+';');});
}



// **************************** Opção Gravar / Alterar
function GravaProposta() {
    xAgora = new Date();
    var dia = xAgora.getDate();
    if (xAgora.getDate()<10){var dia = String(xAgora.getDate()).padStart(2, '0');} else{var dia = xAgora.getDate()};
    if (xAgora.getMonth()+1<10){var mes = String(xAgora.getMonth()+1).padStart(2, '0');} else{var mes = xAgora.getMonth()+1()};
    var ano = xAgora.getFullYear();
    if (xAgora.getHours()<10){var hora = String(xAgora.getHours()).padStart(2, '0');} else{var hora = xAgora.getHours()};
    if (xAgora.getMinutes()<10){var minuto = String(xAgora.getMinutes()).padStart(2, '0');} else{var minuto = xAgora.getMinutes()};
    xAgora = dia+"/"+mes+"/"+ano+" "+hora+":"+minuto;

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
    xDescontoPorFaixaKm = Number(document.FormConfigurar.ConfigDescontoPorFaixaKm.value);
    xValorCombustivel = Number(document.FormApp.ValorCombustivel.value);
    xDescontoFreteLiquido = Number(document.FormApp.DescontoFreteLiquido.value);
    xTotalDosServicos = Number(document.FormApp.TotalDosServicos.value);
    var xClonando = xClonar;

    if (xNovaProposta == 'Sim'){
        localDB.transaction(function(tx) {tx.executeSql('INSERT INTO Propostas (Origem, Destino, Nome, Telefone, ValorLitroCombustivel, Distancia, Pedagio, Ajudante, Outros, PorcentagemDesconto, Ajuste, MediaConsumo, DescontoPorFaixaKm, DescontoFreteLiquido, TotalDosServicos, DataRegistro, Busca, Email) VALUES ("'+xOrigem+'", "'+xDestino+'", "'+xNome+'", "'+xTelefone+'", '+xValorCombustivel+', '+xDistancia+', '+xPedagio+', '+xAjudante+', '+xOutros+', '+xPorcentagemDesconto+', '+xAjuste+', '+xMediaConsumo+', '+xDescontoPorFaixaKm+', '+xDescontoFreteLiquido+', '+xTotalDosServicos+', "'+xAgora+'", "'+xOrigem+' '+xDestino+' '+xNome+' '+xTelefone+'", '+xEmail+');');});
        
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

        // Atualiza Combustivel, Média Consumo e Desconto Por FaixaKm
        xValorCombustivel = Number(document.FormApp.ValorCombustivel.value);
        localDB.transaction(function(tx) {tx.executeSql('UPDATE Combustivel SET ValorCombustivel='+xValorCombustivel+', MediaConsumo='+xMediaConsumo+', DescontoPorFaixaKm='+xDescontoPorFaixaKm+';');});

        document.getElementById("Gravar").disabled = true;
        document.getElementById("Alterar").disabled = false;
        document.getElementById("Excluir").disabled = false;
        document.getElementById("Clonar").disabled = false;
    }
    else {
        localDB.transaction(function(tx) {tx.executeSql('UPDATE Propostas SET Origem="'+xOrigem+'", Destino="'+xDestino+'", Nome="'+xNome+'", Telefone="'+xTelefone+'", ValorLitroCombustivel='+xValorCombustivel+', Distancia='+xDistancia+', Pedagio='+xPedagio+', Ajudante='+xAjudante+', Outros='+xOutros+', PorcentagemDesconto='+xPorcentagemDesconto+', Ajuste='+xAjuste+', MediaConsumo='+xMediaConsumo+', DescontoPorFaixaKm='+xDescontoPorFaixaKm+', DescontoFreteLiquido='+xDescontoFreteLiquido+', TotalDosServicos='+xTotalDosServicos+', DataRegistro="'+xAgora+'", Busca="'+xOrigem+' '+xDestino+' '+xNome+' '+xTelefone+'", Email='+xEmail+' WHERE Id='+xId+';');});

        xTituloMsgAlerta = "Ok";
        xMensagemAlerta = "Proposta "+xId+" Alterada";
        Alerta();

        document.getElementById("RegistroDataAtual").value = "Id "+xId+" - "+document.FormAlterarData.AlterarData.value+" "+xAgora;
    };

    window.scrollTo(0, 0);
};



// **************************** Opção Excluir
function ExcluiProposta() {
    window.onbeforeunload = function(){};
    if (confirm("\n Deseja realmente excluir esta Proposta ?") == true) {
        localDB.transaction(function(tx) {tx.executeSql('DELETE FROM Propostas WHERE Id = '+xId+';');});

        xTituloMsgAlerta = "Ok";
        xMensagemAlerta = "Proposta "+xId+" Apagada";
        Alerta();

        if (xProcurandoProposta == "Nao"){
            setTimeout(function(){location.reload()},1000);
        };
    };
    if (xProcurandoProposta == "Sim"){setTimeout(function(){BuscaProposta()},200);};
};



// **************************** Opção Configurar
function ConfigurarApp() {
    window.scrollTo(0, 0);

    document.getElementById("DivFormApp").style.visibility = "hidden";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "hidden";
    document.getElementById("DivFundoApp").style.visibility = "visible";
    document.getElementById("DivFormConfigurar").style.visibility = "visible";
};



// **************************** Opção Gravar Configurar App
function GravarConfigApp() {
    xValorCombustivel = parseFloat(document.FormConfigurar.ConfigValorCombustivel.value).toFixed(2);
    xMediaConsumo = parseFloat(document.FormConfigurar.ConfigMediaConsumo.value).toFixed(2);
    xDescontoPorFaixaKm = parseFloat(document.FormConfigurar.ConfigDescontoPorFaixaKm.value).toFixed(2);

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



// **************************** Opção Gravar Nome e Telefone Usuário App
function GravarDadosUsuarioApp() {
    xNomeUsuario = document.FormConfigurar.NomeUsuario.value;
    xTelefoneUsuario = document.FormConfigurar.TelefoneUsuario.value;
    localDB.transaction(function(tx) {tx.executeSql('UPDATE Combustivel SET NomeUsuario="'+xNomeUsuario+'", TelefoneUsuario="'+xTelefoneUsuario+'";');});
};



// **************************** Opção Voltar Configurar App
function VoltarConfigApp() {
    window.scrollTo(0, 0);

    document.getElementById("DivFormApp").style.visibility = "visible";
    document.getElementById("DivOpcoesHomeApp").style.visibility = "visible";
    document.getElementById("DivFormConfigurar").style.visibility = "hidden";
};



// **************************** Opção Limpar
function LimpaProposta() {
    window.onbeforeunload = function(){};
    location.reload();
    window.scrollTo(0, 0);
};



// **************************** Opção Clonar
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
    if(xNomeUsuario == "" || xTelefoneUsuario == "" || xNomeUsuario == null || xTelefoneUsuario == null){
        xTituloMsgAlerta = "Atenção !";
        xMensagemAlerta = "Necessário preencher os Dados do Usuário.";
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
                eval("document.FormCriarMail.Valor"+x).value = (row['TotalDosServicos'] + row['DescontoFreteLiquido']).toFixed(2);
                eval("document.FormCriarMail.Desconto"+x).value = row['DescontoFreteLiquido'].toFixed(2);
                eval("document.FormCriarMail.Nome"+x).value = "<br><i style='font-size: 8pt;'> Autorizado: "+row['Nome']+"<i/>";
                xDescontoEmail += row['DescontoFreteLiquido']+row['Ajuste'];
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

    xPixel = 0;
    var xLinha = 1;
    var xSomaTotalServicos = 0;
    var xSomaDesconto = 0;
    var xSomaValorReceber = 0;

    xTextoEmail = "<table cellspacing='0px' style='margin-left:auto; margin-right:auto; align:center; font-family:calibri; font-size:10pt; color:#8D8D8D; background: RGB(255, 255, 255);'>"
                + "<tr style='height:12px;'><td colspan='4'></td></tr>"
                + "<tr><td colspan='4'> Prezados, anexo Documentação referente a:</td></tr>"
                + "<tr style='height:12px;'><td colspan='4'></td></tr>";
    for (var i = 1; i < 11; i++) {
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
                if(xDesconto > 0){
                    xTextoEmail += "<tr bgcolor="+xCorLinha+" style='height:25px;'>"
                                    + "<td rowspan='3' style='width:10%; text-align:center; min-width:50px; max-width:50px;'>"+String(xData)+"</td>"
                                    + "<td rowspan='3' style='width:62%;'>"+xDescricao+eval("document.FormCriarMail.Nome"+i).value+"</td>"
                                    + "<td style='width:25%; text-align:right; vertical-align:bottom; min-width:80px; max-width:150px;'>R$ "+xTotalServicos.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "</td>"
                                    + "<td style='width:3%; text-align:left; vertical-align:bottom; min-width:05px; max-width:10px;'>+</td></tr>"
                                    + "<tr bgcolor="+xCorLinha+" style='height:25px;'>"
                                    + "<td style='width:25%; text-align:right; vertical-align:center; min-width:80px; max-width:150px; color:#FF3C3C;'>R$ "+xDesconto.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "</td>"
                                    + "<td style='width:3%; text-align:left; vertical-align:center; min-width:10px; max-width:10px;'>-</td></tr>"
                                    + "<tr bgcolor="+xCorLinha+" style='height:25px;'>"
                                    + "<td style='width:25%; text-align:right; vertical-align:top; min-width:80px; max-width:150px; color:#7D7DFF;'>R$ "+xValorReceber.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2}) + "</td>"
                                    + "<td style='width:3%; text-align:left; vertical-align:top; min-width:10px; max-width:10px;'>=</td></tr>";
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
                    + "<tr style='width:25%; height:25px; text-align: right; min-width:70px; max-width:150px;'><td colspan='2' ><b>Total dos Serviços:</b></td><td><b>R$ "+xSomaTotalServicos.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"</b></td>"
                    + "<td style='text-align:left; min-width:10px; max-width:80px;'></td></tr>";
    } else {
        var xPercDesconto = (xSomaDesconto/xSomaTotalServicos)*100;
        var xPercDesconto = String(xPercDesconto.toFixed(1));
        var xPercDesconto = Number(xPercDesconto);

        xTextoEmail += "<tr><td colspan='4' style='padding-top:4px; border-top:1px solid #D3D3D3;'></td></tr>"
                    + "<tr style='width:25%; height:25px; text-align: right; min-width:70px; max-width:150px;'><td colspan='2' >Total dos Serviços:</td><td>R$ "+xSomaTotalServicos.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"</td>"
                    + "<td style='text-align:left; min-width:10px; max-width:80px;'></td></tr>"
                    + "<tr style='width:25%; text-align: right; min-width:80px; max-width:150px;'><td colspan='2'>Descontos ("+xPercDesconto.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:1})+"%): </td><td style='text-align:right;'>R$ "+xSomaDesconto.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"</td>"
                    + "<td style='text-align:left; min-width:10px; max-width:10px;'></td></tr>"
                    + "<tr><td colspan='2'></td><td style='border-top:1px solid #D3D3D3;'></td></tr>"
                    + "<tr style='padding-top:3px; width:25%; height:25px; text-align: right; min-width:70px; max-width:140px;'><td colspan='2'><b>Total à Receber:</b></td><td style='text-align:right;'><b>R$ "+xSomaValorReceber.toLocaleString('pt-BR', {style: 'decimal', minimumFractionDigits:2})+"</b></td>"
                    + "<td style='text-align:left; min-width:10px; max-width:10px;'></td></tr>";
    };

    xTextoEmail += "<tr style='height: 5px;'><td colspan='4'></td></tr>"
                + "<tr><td colspan='4' style='border-top:1px solid #D3D3D3;'></td></tr>"
                + "<tr><td colspan='4' style='height:23px; padding-top: 5px;'> Pagador: <b>" + document.FormCriarMail.Pagador.value + "</b></td></tr>"
                + "<tr><td colspan='4' style='height:23px;'> Vencimento: <b>" + document.FormCriarMail.Vencimento.value + "</b></td></tr>"
                + "<tr><td colspan='4' style='height:23px; padding-bottom:8px;'> Código de Barras: <font size=1pt><b>" + document.FormCriarMail.CodigoDeBarras.value + "</b></font></td></tr>"
                + "<tr><td colspan='4' style='border-top: 1px solid #D3D3D3;'></td></tr>"
                + "<tr><td colspan='4' style='height:15px;'></td></tr>"
                + "<tr><td colspan='4' style='height:30px;'> Atenciosamente,</td></tr>"
                + "<tr><td colspan='4' style='height:12px;'></td></tr>"
                + "<tr><td colspan='4'> <i>"+xNomeUsuario+"</i></td></tr>"
                + "<tr><td colspan='4'> <font size=1pt><i>"+xTelefoneUsuario.substr(0,4)+" </font><b>"+xTelefoneUsuario.substr(4,10)+"</b></i></td></tr>"
                + "<tr><td colspan='4' style='border-top:1px solid #D3D3D3;'></td></tr>"
                + "<tr style='height: 8px;'><td colspan='4'></tr></td>"
                + "<tr><td colspan='4'> </tr></td>"
            + "</table>"
            + "<center id='BotoesMail' style='background:RGB(205, 205, 205); border-radius:10px;'>"
                + "<br>"
                + "<input id='VoltarMailApp' value='Voltar' style='width:70px; text-align:center' type='button' onClick='VoltarMail()'>     "
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
    document.getElementById("CopiarMailApp").value = "** Copiado! Agora é só colar **";

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



// **************************** Máscara para Telefones
function MascaraTelefone(Telefone){
    window.addEventListener("keydown", function(event) {
        if (event.key == "Backspace") {Return;} 
        else {
            if (Telefone.value==" "){ Telefone.value = "" };
            if (Telefone.value.length == 1){ Telefone.value = "(" + Telefone.value };
            if (Telefone.value.length == 3){ Telefone.value += ")" };
            if (Telefone.value.length == 9){ Telefone.value += "-" };
        };
    });
};



// **************************** Máscara para Datas
function MascaraData(Data){
    window.addEventListener("keydown", function(event) {

        if (event.key == "Backspace") {Return;} 
        else {
            if (Data.value==" "){ Data.value = "" };
            if (Data.value.length == 2){ Data.value += "/" };
            if (Data.value.length == 6){ Data.value = Data.value.substr(0,5) + "/" + Data.value.substr(5,5)};
        };
    });
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

            setTimeout(function(){location.reload();},1000);
        };
    };
};
