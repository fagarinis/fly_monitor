var memorizedLandedResultJson;
var memorizedCurrentPage = 1;
var memorizedtotalPages;

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

function buildLandedTable(resultJson, selectedPage = 1, pageSize = 10) {
	clearLandedTable();
	var resultTable = $("#landedTableId");

	if (resultJson) {
		resultJson = sortJsonByStartDate(resultJson);
		memorizedLandedResultJson = resultJson;
	}
	else {
		resultJson = memorizedLandedResultJson;
	}

	let startIndex = (selectedPage - 1) * pageSize;
	let endIndex = startIndex + pageSize;
	for (let i = startIndex; i < resultJson.length && i < endIndex; i++) {
		resultTable.append(buildLandedTableRow(resultJson[i]));
	}

	let totalRows = resultJson.length;
	memorizedtotalPages = Math.ceil(totalRows / pageSize);

	buildLandedTableNavigationSection(memorizedtotalPages, selectedPage);
}

function selectPage(page){
	if(page == null){
		return;
	}
	memorizedCurrentPage = page;
	$("nav[aria-label = landedTableNavigation] ul li[value ="+page+"]").addClass('active');
}

function sortJsonByStartDate(json){
	return json.sort(function (a, b) {
		return (new Date(b.startDate)) - (new Date(a.startDate));
	});
}

function buildLandedTableNavigationSection(totalPages, selectedPage, pageGroupSize = 15) {
	$("nav[aria-label = landedTableNavigation]").remove();

	let navigationSection = $("<nav>").attr('aria-label', 'landedTableNavigation');
	let list = $('<ul>').addClass('pagination justify-content-center');
	navigationSection.append(list);
	
	let startPage = Math.max(1, selectedPage - Math.ceil(pageGroupSize/2));
	let endPage = Math.min(totalPages, startPage + pageGroupSize);

	let numberOfPagesShown = endPage - startPage
	if(numberOfPagesShown < pageGroupSize){
		let pagesMissing = pageGroupSize - numberOfPagesShown;
		startPage = Math.max(1, startPage - (pagesMissing));
	}
	
	list.append(createChangePageButton('First', 1, totalPages));
	list.append(createChangePageButton('Previous', selectedPage-1, totalPages));
	for (let i = startPage; i <= endPage; i++) {
		let listItem = $("<li>").addClass('page-item w-25').val(i);
		listItem.append($('<a>').addClass('page-link').html(i));
		listItem.click(function () {
			buildLandedTable(undefined, i);
		});

		list.append(listItem);
	}
	list.append(createChangePageButton('Next', selectedPage+1, totalPages));
	list.append(createChangePageButton('Last', totalPages, totalPages));

	$("#landedTableId").after(navigationSection);
	selectPage(selectedPage);
	
	return navigationSection;
}

function createChangePageButton(innerHTML, pageOnClick, totalPages){
	let button = $("<li>").addClass('page-item').append($('<a>').addClass('page-link').html(innerHTML));
	if(pageOnClick <= 0 || pageOnClick > totalPages){
		return button.addClass('disabled');
	}

	button.click(function(){
		if(pageOnClick <= 0 || pageOnClick > totalPages){
			return;
		}
		buildLandedTable(undefined, pageOnClick);
	});

	return button;
}

function clearLandedTable() {
	$("#landedTableId").empty();
}

function buildLandedTableRow(jsonEntry) {
	let { _id, tratta, status, startDate, endDate } = jsonEntry;

	let tableRow = $('<tr>').addClass('row');

	if (status.toUpperCase() == 'FLYING') {
		tableRow.addClass('bg-success');
		status += tripleDotAnimation() + '&#9992;'; 
	}

	[_id, tratta, status, startDate, endDate].forEach(param =>
		tableRow.append($('<td>').addClass('col col-2').append($('<small>').html(param))));

	return tableRow;
}

function tripleDotAnimation(){
	return '<span class="one">.</span><span class="two">.</span><span class="three">.</span> '
}