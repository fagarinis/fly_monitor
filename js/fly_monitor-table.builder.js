function buildCreatedTable(resultJson) {
	clearCreatedTable();
	let resultTable = $("#createdTableId");

	for (let i = 0; i < resultJson.length; i++) {
		resultTable.append(buildCreatedTableRow(resultJson[i]));
	}
}

function clearCreatedTable() {
	$("#createdTableId").empty();
}

function buildCreatedTableRow(jsonEntry) {
	let { _id, tratta, status } = jsonEntry;

	if (status.toUpperCase() == 'CREATED') {
		status = createFlyButton(jsonEntry._id);
	}

	let tableRow = $('<tr>').attr('data-voloId', _id).addClass('row');

	[_id, tratta, status].forEach(param =>
		tableRow.append($('<td>').addClass('col col-2').append($('<small>').html(param))));

	return tableRow;
}

function createFlyButton(idVolo) {
	var flyButton = $('<button>');

	flyButton.data('idVolo', idVolo).addClass('btn btn-sm btn-success').html('FLY');
	flyButton.click(function () {
		fly(idVolo);
	});

	return flyButton;
}


function buildLandedTable(resultJson) {
	clearLandedTable();
	var resultTable = $("#landedTableId");

	resultJson = resultJson.sort(function (a, b) {
		return (new Date(b.startDate)) - (new Date(a.startDate));
	});

	for (var i = 0; i < resultJson.length; i++) {
		resultTable.append(buildLandedTableRow(resultJson[i]));
	}
}

function clearLandedTable() {
	$("#landedTableId").empty();
}

function buildLandedTableRow(jsonEntry) {
	let { _id, tratta, status, startDate, endDate } = jsonEntry;

	if (status.toUpperCase() == 'FLYING') {
		//add ... animation
		status += '<span class="one">.</span><span class="two">.</span><span class="three">.</span> &#9992;';
	}

	let tableRow = $('<tr>').addClass('row');

	[_id, tratta, status, startDate, endDate].forEach(param =>
		tableRow.append($('<td>').addClass('col col-2').append($('<small>').html(param))));

	return tableRow;
}