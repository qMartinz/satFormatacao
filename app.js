let sheetId;
let info = {};
let loading = false;

async function spreadsheetsGet(sheetId, range, callback){
    await new Promise(resolve => setTimeout(() => {
        gapi.client.load('sheets', 'v4', function() {
            gapi.client.sheets.spreadsheets.get({
                spreadsheetId: sheetId,
                ranges: range,
                includeGridData: true
            }).then((response) => {
                callback(response);
                resolve();
            }, (error) => {
                console.error('Error on spreadsheet get', error);
            });
        });
    }));
}

async function changeOptions(){
    spreadsheetsGet('1VNOx2dAiFEhxrO2bofBCyr6Qs-BVBc7dyV0SuGzXDbU', 'Dispositivos!A4:A', function(response) {
        const rowData = response.result.sheets[0].data[0].rowData;
        const select = document.getElementById('cs');
        
        var first = select.firstElementChild;
        select.innerHTML = "";
        select.append(first);
        
        rowData.forEach(row => {
            const value = row["values"][0]["formattedValue"];
            if (value !== undefined) {
                const opt = document.createElement('option');
                opt.value = value;
                opt.textContent = value
                
                select.appendChild(opt);
            };
        });

        setCustomSelect();
    });
}

document.getElementById("osoriginalc").addEventListener('change', function(e) {
    if (e.target.checked) {
        document.getElementById('oscrack').hidden = true;
        document.getElementById('desativardefenderc').checked = false;
        document.getElementById('crackc').checked = false;
    } else {
        document.getElementById('oscrack').hidden = false;
    }
});

function changeSetor(e) {        
    if (e.value > 0) {
        showExtraItems(Number(e.value));
        return;
    }

    showExtraItems(getSetorId(info.setor));
}

async function changeComputer(e){ 
    await setIdByName(e.value);
        
    spreadsheetsGet(sheetId, 'A2:F5', function(response) {
        info.nome = response.result.sheets[0].data[0].rowData[0]["values"][0]["formattedValue"];
        info.ambiente = response.result.sheets[0].data[0].rowData[0]["values"][1]["formattedValue"];
        info.modelo = response.result.sheets[0].data[0].rowData[0]["values"][2]["formattedValue"];
        info.usuario = response.result.sheets[0].data[0].rowData[0]["values"][3]["formattedValue"];
        info.tipo = response.result.sheets[0].data[0].rowData[0]["values"][4]["formattedValue"];
        info.ultformatacao = response.result.sheets[0].data[0].rowData[0]["values"][5]["formattedValue"];
        info.setor = response.result.sheets[0].data[0].rowData[3]["values"][1]["formattedValue"];
        
        showExtraItems(getSetorId(info.setor));
    });
}

function showExtraItems(setor){
    document.getElementById('verifbackup').hidden = true;
    document.getElementById('verifbackupc').checked = false;
    document.getElementById('clone').hidden = true;
    document.getElementById('clonec').checked = false;
    document.getElementById('softadm').hidden = true;
    document.getElementById('softadm').querySelectorAll('input').forEach(element => element.checked = false);
    document.getElementById('softlab').hidden = true;
    document.getElementById('softlab').querySelectorAll('input').forEach(element => element.checked = false);
    
    switch (setor){
        case 1:
        document.getElementById('verifbackup').hidden = false;
        document.getElementById('clone').hidden = false;
        document.getElementById('softadm').hidden = false;
        break;
        case 2:
        document.getElementById('softlab').hidden = false;
        break;
    }
}

function setIdByName(name){
    return new Promise(resolve => setTimeout(() => {
        spreadsheetsGet('1VNOx2dAiFEhxrO2bofBCyr6Qs-BVBc7dyV0SuGzXDbU', 'Dispositivos!A4:K', function(response){
            const rowData = response.result.sheets[0].data[0].rowData;
            
            rowData.forEach(row => {
                const nome = row["values"][0]["formattedValue"];
                if (nome !== undefined && nome === name) {
                    sheetId = row["values"][10]["formattedValue"];
                    resolve();
                };
            });
        });
    }));
}

function getSetorId(setor){
    switch (setor){
        case 'Administrativo':
        return 1;
        case 'Laboratório':
        return 2;
        default:
        return 3;
    }
}

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById("formatacao").addEventListener('submit', async function(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const action = e.target.action;
    
        var alterarsetor = "Não alterar";
        switch (data.get('setor')) {
            case 1:
                alterarsetor = "Administrativo";
                break;
            case 2:
                alterarsetor = "Laboratório";
                break;
            case 3:
                alterarsetor = "Pedagógico";
                break;
        }

        const values = [
            [new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear(), data.get('ambiente') === "" ? "Não alterar" : data.get('ambiente'), alterarsetor, data.get('usuario') === "" ? "Não alterar" : data.get('usuario')]
        ];

        values[0].push(data.get('verifbackupc') === "on" ? "Feito" : "Não");
        values[0].push(data.get('soprc') === "on" ? "Feito" : "Não");
        values[0].push(data.get('pastatc') === "on" ? "Feito" : "Não");
        values[0].push(data.get('limpextc') === "on" ? "Feito" : "Não");

        var os = "";
        switch (data.get("os")){
            case "win7":
                os = "Windows 7";
                break;
            case "win10":
                os = "Windows 10";
                break;
        }
        values[0].push(os);

        values[0].push(data.get('imgc') === "on" ? "Sim" : "Não");
        values[0].push(data.get('clonec') === "on" ? "Feito" : "Não");

        var driver = "";
        switch (data.get("driver")){
            case "win":
                driver = "Nativos do Windows";
                break;
            case "fab":
                driver = "Fabricante";
                break;
        }
        values[0].push(driver);

        var softwares = [];
        if (data.get('chromec') === 'on') softwares.push('Chrome');
        if (data.get('firefoxc') === 'on') softwares.push('Firefox');
        if (data.get('foxitc') === 'on') softwares.push('Foxit Reader');
        if (data.get('vlcc') === 'on') softwares.push('VLC');
        if (data.get('klitec') === 'on') softwares.push('KLite Codecs');
        if (data.get('runtimesc') === 'on') softwares.push('Runtimes');
        if (data.get('winrarc') === 'on') softwares.push('Winrar');
        if (data.get('officeadmc') === 'on' || data.get('officelab') === 'on') softwares.push('Pacote Office');
        if (data.get('anydeskc') === 'on') softwares.push('Anydesk');
        if (data.get('eduxec') === 'on') softwares.push('Eduxe');
        if (data.get('sigaac') === 'on') softwares.push('Sigaa');
        if (data.get('spoolerc') === 'on') softwares.push('Spoolers de Impressoras');
        if (data.get('backupc') === 'on') softwares.push('Restaurado o Backup');
        if (data.get('profc') === 'on') softwares.push('Necessidades do Professor');

        values[0].push(softwares.toString().replaceAll(",", ", "));

        values[0].push(data.get('desativarfirec') === "on" ? "Sim" : "Não");
        values[0].push(data.get('osoriginalc') === "on" ? "Sim" : "Não");
        values[0].push(data.get('crackc') === "on" || data.get('osoriginalc') === "on" ? "Sim" : "Não");
        values[0].push(data.get('vncc') === "on" ? "Sim" : "Não");
        values[0].push(data.get('bitdefenderc') === "on" ? "Sim" : "Não");
        values[0].push(data.get('updtc') === "on" ? "Sim" : "Não");
        values[0].push(data.get('dominioc') === "on" ? "Colocado" : "Não");
        
        const resource = {
            values,
        };

        var i = 3;

        document.getElementById('submit').disabled = true;

        var load = setInterval(() => {
            if (i > 2) {
                document.getElementById('submit').textContent = 'Carregando';
                i = 0;
            } else {
                document.getElementById('submit').textContent += '.';
                i += 1;
            }
        }, 1000);

        try {
            const result = await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: sheetId,
                range: 'Formatações',
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                resource,
            });
        } catch (err) {
            console.error('Erro ao adicionar dados:', err);
        } finally {
            console.log("finished loading");
            clearInterval(load);
            document.getElementById('submit').textContent = "Finalizar Formatação";
            document.getElementById('submit').disabled = false;
            document.getElementById("formatacao").reset();
            setCustomSelect();
        }

        var dateValue = [
            [ new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear() ]
        ];

        try {
            const result2 = await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: sheetId,
                range: 'Página1!F2',
                values: dateValue,
                valueInputOption: 'USER_ENTERED'
            });
        } catch (err) {
            console.error('Erro ao atualizar planilha', err);
        }

        if (data.get('ambiente') !== ""){
            var ambientevalue = [
                [ data.get('ambiente') ]
            ]

            try {
                const result3 = await gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: sheetId,
                    range: 'Página1!B2',
                    values: ambientevalue,
                    valueInputOption: 'USER_ENTERED'
                });
            } catch (err) {
                console.error('Erro ao atualizar planilha', err);
            }
        }

        if (data.get('usuario') !== ""){
            var usuariovalue = [
                [ data.get('usuario') ]
            ]

            try {
                const result3 = await gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: sheetId,
                    range: 'Página1!D2',
                    values: usuariovalue,
                    valueInputOption: 'USER_ENTERED'
                });
            } catch (err) {
                console.error('Erro ao atualizar planilha', err);
            }
        }

        if (data.get('setor') !== '0'){
            var newsetor = "Não alterar";
            switch (data.get('setor')) {
                case 1:
                    newsetor = "Administrativo";
                    break;
                case 2:
                    newsetor = "Laboratório";
                    break;
                case 3:
                    newsetor = "Pedagógico";
                    break;
            }

            var setorvalue = [
                [ newsetor ]
            ]

            try {
                const result3 = await gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: sheetId,
                    range: 'Página1!B5',
                    values: setorvalue,
                    valueInputOption: 'USER_ENTERED'
                });
            } catch (err) {
                console.error('Erro ao atualizar planilha', err);
            }
        }
    });
});