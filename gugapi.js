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