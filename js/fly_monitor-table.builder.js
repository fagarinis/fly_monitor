var memorizedLandedResultJson;
var memorizedCurrentPage = 1;

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

function buildLandedTable(resultJson, page = 1, pageSize = 10) {
	clearLandedTable();
	var resultTable = $("#landedTableId");

	if (resultJson) {
		resultJson = sortJsonByStartDate(resultJson);
		memorizedLandedResultJson = resultJson;
	}
	else {
		
		resultJson = memorizedLandedResultJson;
	}

	let startIndex = (page - 1) * pageSize;
	let endIndex = startIndex + pageSize;
	for (let i = startIndex; i < resultJson.length && i < endIndex; i++) {
		resultTable.append(buildLandedTableRow(resultJson[i]));
	}

	let totalRows = resultJson.length;
	let totalPages = Math.ceil(totalRows / pageSize);

	buildLandedTableNavigationSection(totalPages, page);
}

function selectPage(page){
	memorizedCurrentPage = page;
	$("nav[aria-label = landedTableNavigation] ul li[value ="+page+"]").addClass('active');
}

function sortJsonByStartDate(json){
	return json.sort(function (a, b) {
		return (new Date(b.startDate)) - (new Date(a.startDate));
	});
}

function buildLandedTableNavigationSection(totalPages, selectedPage) {
	let navigationSection = $("<nav>").attr('aria-label', 'landedTableNavigation');
	let list = $('<ul>').addClass('pagination pagination-sm');
	navigationSection.append(list);

	for (let i = 1; i <= totalPages; i++) {
		let listItem = $("<li>").addClass('page-item').val(i);
		listItem.append($('<a>').addClass('page-link p-1').html(i))
		listItem.click(function () {
			buildLandedTable(undefined, i);
		});

		list.append(listItem);
	}

	$("#landedTableId").after(navigationSection);
	selectPage(selectedPage);
	
	return navigationSection;
}

function clearLandedTable() {
	$("#landedTableId").empty();
	$("nav[aria-label = landedTableNavigation]").remove();
}

function buildLandedTableRow(jsonEntry) {
	let { _id, tratta, status, startDate, endDate } = jsonEntry;

	let tableRow = $('<tr>').addClass('row');

	if (status.toUpperCase() == 'FLYING') {
		//add ... animation
		tableRow.addClass('bg-success');
		status += '<span class="one">.</span><span class="two">.</span><span class="three">.</span> &#9992;';
	}

	[_id, tratta, status, startDate, endDate].forEach(param =>
		tableRow.append($('<td>').addClass('col col-2').append($('<small>').html(param))));

	return tableRow;
}