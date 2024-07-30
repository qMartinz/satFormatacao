var sheetId;
var info = {};

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
    });
    
    document.getElementById('cs').addEventListener('change', async function(e){ 
        await setIdByName(e.target.value);
            
        spreadsheetsGet(sheetId, 'A2:F5', function(response) {
            info.nome = response.result.sheets[0].data[0].rowData[0]["values"][0]["formattedValue"];
            info.ambiente = response.result.sheets[0].data[0].rowData[0]["values"][1]["formattedValue"];
            info.modelo = response.result.sheets[0].data[0].rowData[0]["values"][2]["formattedValue"];
            info.usuario = response.result.sheets[0].data[0].rowData[0]["values"][3]["formattedValue"];
            info.tipo = response.result.sheets[0].data[0].rowData[0]["values"][4]["formattedValue"];
            info.ultformatacao = response.result.sheets[0].data[0].rowData[0]["values"][5]["formattedValue"];
            info.setor = response.result.sheets[0].data[0].rowData[3]["values"][1]["formattedValue"];
            console.log("success!", info);
            
            if (info) {                    
                switch (info.setor){
                    case 'Administrativo':
                    showExtraItems(1);
                    break;
                    case 'Laboratório':
                    showExtraItems(2);
                    break;
                    default:
                    showExtraItems(3);
                    break;
                }
            }
        });
    });
    
    document.getElementById("setor").addEventListener('change', function(e) {        
        if (e.target.value > 0) {
            showExtraItems(e.target.value);
            return;
        }
        
        
        showExtraItems(info.setor);
    })
}

function showExtraItems(setor){
    document.getElementById('verifbackup').hidden = true;
    document.getElementById('clone').hidden = true;
    document.getElementById('softadm').hidden = true;
    document.getElementById('softlab').hidden = true;
    
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