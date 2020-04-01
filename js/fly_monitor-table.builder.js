function buildCreatedTable(resultJson) {
	clearCreatedTable();
	var resultTable = $("#createdTableId");

	var resultRowsString = "";
	for (var i = 0; i < resultJson.length; i++) {
		resultRowsString += buildCreatedTableRow(resultJson[i]);
	}

	resultTable.append(resultRowsString);
}

function clearCreatedTable() {
	$("#createdTableId").empty();
}

function buildCreatedTableRow(jsonEntry) {
	id = jsonEntry._id;
	tratta = jsonEntry.tratta;
	status = jsonEntry.status;

	if (status.toUpperCase() == 'CREATED') {
		status = createFlyButton(jsonEntry._id);
	}

	var tableRow = '<tr>';
	tableRow += '<td><small>' + id + '</small></td>';
	tableRow += '<td><small>' + tratta + '</small></td>';
	tableRow += '<td>' + status + '</td>';
	tableRow += '</tr>';

	return tableRow;
}

function createFlyButton(idVolo) {
	var flyButton = ' <button type="button" id="' + idVolo + '" ';
	flyButton += ' onclick="fly(this)" ';
	flyButton += ' class="btn btn-sm btn-success"><small>FLY</small></button> ';

	return flyButton;
}


function buildLandedTable(resultJson) {
	clearLandedTable();
	var resultTable = $("#landedTableId");

	resultJson = resultJson.sort(function(a, b){
		return (b.status == 'FLYING') - (a.status == 'FLYING');
	});

	var resultRowsString = "";
	for (var i = 0; i < resultJson.length; i++) {
		resultRowsString += buildLandedTableRow(resultJson[i]);
	}

	resultTable.append(resultRowsString);
}

function clearLandedTable() {
	$("#landedTableId").empty();
}

function buildLandedTableRow(jsonEntry) {
	id = jsonEntry._id;
	tratta = jsonEntry.tratta;
	status = jsonEntry.status;

	if (status.toUpperCase() == 'FLYING') {
		status += '<span class="one">.</span><span class="two">.</span><span class="three">.</span> &#9992;';
	}

	var tableRow = '<tr>';
	tableRow += '<td><small>' + id + '</small></td>';
	tableRow += '<td><small>' + tratta + '</small></td>';
	tableRow += '<td>' + status + '</td>';
	tableRow += '</tr>';

	return tableRow;
}