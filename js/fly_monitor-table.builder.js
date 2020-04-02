var memorizedLandedResultJson;
var memorizedCurrentPage = 1;
var memorizedtotalPages;
var memorizedSelectedPageGroup = 1;

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

function buildLandedTable(resultJson, selectedPage = 1, pageSize = 10, selectedPageGroup) {
	clearLandedTable();
	if(selectedPageGroup){
		memorizedSelectedPageGroup = selectedPageGroup;
	}
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

	buildLandedTableNavigationSection(memorizedtotalPages, selectedPage, selectedPageGroup);
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

function buildLandedTableNavigationSection(totalPages, selectedPage, pageGroup = 1, pageGroupSize = 9) {
	$("nav[aria-label = landedTableNavigation]").remove();

	memorizedSelectedPageGroup = pageGroup;

	let navigationSection = $("<nav>").attr('aria-label', 'landedTableNavigation');
	let list = $('<ul>').addClass('pagination ');
	navigationSection.append(list);

	//pageGroup, pagine  (pageGroupSize = 9)
	// 1, 1 - 9
	// 2, 10 - 18
	// 3, 19 - 27
	// 4, 28 - 36
	
	let startPage = 1 + pageGroupSize * (pageGroup - 1) ;
	let endPage = pageGroupSize * pageGroup;
	
	list.append(createChangePageGroupButton('&laquo;', pageGroup-1, totalPages, pageGroupSize));
	for (let i = startPage; i <= totalPages && i <= endPage; i++) {
		let listItem = $("<li>").addClass('page-item').val(i);
		listItem.append($('<a>').addClass('page-link').html(i));
		listItem.click(function () {
			buildLandedTable(undefined, i, undefined, pageGroup);
		});

		list.append(listItem);
	}
	list.append(createChangePageGroupButton('&raquo;', pageGroup+1, totalPages, pageGroupSize));

	$("#landedTableId").after(navigationSection);
	selectPage(selectedPage);
	
	return navigationSection;
}

function createChangePageGroupButton(innerHTML, pageGroupOnClick, totalPages, pageGroupSize){
	totalePagesGroup = Math.ceil(totalPages / pageGroupSize);
	if(pageGroupOnClick <= 0 || pageGroupOnClick> totalePagesGroup){
		return;
	}

	let button = $("<li>").addClass('page-item').append($('<a>').addClass('page-link').html(innerHTML));
	button.click(function(){
		buildLandedTableNavigationSection(totalPages, memorizedCurrentPage, pageGroupOnClick);
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