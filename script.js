var sheetId;
var computerInfo = function () {
    var info = {};

    gapi.client.load('sheets', 'v4', function() {
        gapi.client.sheets.spreadsheets.get({ spreadsheetId: sheetId, ranges: 'A2:F5', includeGridData: true }).then((response) => {
            info.nome = response.result.sheets[0].data[0].rowData[0]["values"][0]["formattedValue"];
            info.ambiente = response.result.sheets[0].data[0].rowData[0]["values"][1]["formattedValue"];
            info.modelo = response.result.sheets[0].data[0].rowData[0]["values"][2]["formattedValue"];
            info.usuario = response.result.sheets[0].data[0].rowData[0]["values"][3]["formattedValue"];
            info.tipo = response.result.sheets[0].data[0].rowData[0]["values"][4]["formattedValue"];
            info.ultformatacao = response.result.sheets[0].data[0].rowData[0]["values"][5]["formattedValue"];
            info.setor = response.result.sheets[0].data[0].rowData[3]["values"][1]["formattedValue"];

        });
    });

    return info;
}

function changeOptions(){
    gapi.client.load('sheets', 'v4', function() {
        gapi.client.sheets.spreadsheets.get({
            spreadsheetId: '1VNOx2dAiFEhxrO2bofBCyr6Qs-BVBc7dyV0SuGzXDbU',
            ranges: 'Dispositivos!A4:A',
            includeGridData: true
        }).then((response) => {
            const rowData = response.result.sheets[0].data[0].rowData;
            const select = document.getElementById('cs');

            select.innerHTML = "";

            rowData.forEach(row => {
                const value = row["values"][0]["formattedValue"];
                if (value !== undefined) {
                    const opt = document.createElement('option');
                    opt.value = value;
                    opt.textContent = value

                    select.appendChild(opt);
                };
            });
        }, (error) => {
            console.error('oh não!', error);
        });
    });

    document.getElementById('cs').addEventListener('change', function(e){
        setIdByName(e.target.value);
        // TODO isso ta demorando pra rodar ai o switch roda antes de ter as informações necessárias
        var info = computerInfo();

        if (info) {
            console.log("socorro");
            document.getElementById('verifbackup').hidden = true;
            document.getElementById('clone').hidden = true;
            document.getElementById('softadm').hidden = true;
            document.getElementById('softlab').hidden = true;
    
            switch (info.setor){
                case 'Administrativo':
                    document.getElementById('verifbackup').hidden = false;
                    document.getElementById('clone').hidden = false;
                    document.getElementById('softadm').hidden = false;
                    console.log("socorroa");
                    break;
                case 'Laboratório':
                    document.getElementById('softlab').hidden = false;
                    console.log("socorrob");
                    break;
                default:
                    console.log(info.setor, "in", info);
                    break;
            }
        }
    });
}

function setIdByName(name){
    gapi.client.load('sheets', 'v4', function() {
        gapi.client.sheets.spreadsheets.get({
            spreadsheetId: '1VNOx2dAiFEhxrO2bofBCyr6Qs-BVBc7dyV0SuGzXDbU',
            ranges: 'Dispositivos!A4:K',
            includeGridData: true
        }).then((response) => {
            const rowData = response.result.sheets[0].data[0].rowData;

            rowData.forEach(row => {
                const nome = row["values"][0]["formattedValue"];
                if (nome !== undefined && nome === name) sheetId = row["values"][10]["formattedValue"];
            });
        }, (error) => {
            console.error('oh não!', error);
        });
    });
}