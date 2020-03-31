function buildCreatedInProgressTable(resultJson) {
	clearCreatedInProgressTable();
	var resultTable = $("#createdInProgressTableId");

	var resultRowsString ="";
	for (var i = 0; i < resultJson.length; i++) {
		resultRowsString += buildCreatedInProgressTableRow(resultJson[i]);
	}

	resultTable.append(resultRowsString);
}

function clearCreatedInProgressTable() {
	$("#createdInProgressTableId").empty();
}

function buildCreatedInProgressTableRow(jsonEntry) {
	tratta = jsonEntry.tratta;
	status = jsonEntry.status;

	if(status.toUpperCase() == 'CREATED'){
		status = createFlyButton( jsonEntry._id);
	}

	var tableRow = '<tr>';
	tableRow += '<td><small>' + tratta + '</small></td>';
	tableRow += '<td>' + status + '</td>';
	tableRow += '</tr>';

	return tableRow;
}

function createFlyButton(idVolo){
	var flyButton = ' <button type="button" id="'+ idVolo + '" ';
	flyButton += ' onclick="fly(this)" ';
	flyButton += ' class="btn btn-sm btn-success"><small>FLY</small></button> ';

	return flyButton;
}


function buildLandedTable(resultJson) {
	clearLandedTable();
	var resultTable = $("#landedTableId");

	var resultRowsString ="";
	for (var i = 0; i < resultJson.length; i++) {
		resultRowsString += buildLandedTableRow(resultJson[i]);
	}

	resultTable.append(resultRowsString);
}

function clearLandedTable() {
	$("#landedTableId").empty();
}

function buildLandedTableRow(jsonEntry) {
	tratta = jsonEntry.tratta;
    status = jsonEntry.status;
    
    if(status.toUpperCase() == 'FLYING'){
		status = status += '<span class="one">.</span><span class="two">.</span><span class="three">.</span>';
	}

	var tableRow = '<tr>';
	tableRow += '<td><small>' + tratta + '</small></td>';
	tableRow += '<td>' + status + '</td>';
	tableRow += '</tr>';

	return tableRow;
}