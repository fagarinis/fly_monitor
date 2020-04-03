//-----------Globals Variables-----------//
var memorizedLandedResultJson;
var memorizedCurrentPage = 1;
var memorizedtotalPages;
//---------------------------------------//

function createTableRow() {
	return $('<tr>');
}

function createTableData(innerHTML) {
	return $('<td>').append($('<small>').html(innerHTML));
}

//-----------Created Table---------------//
function buildCreatedTableRow(voloJSON) {
	let tableRow = createTableRow().attr('data-voloId', voloJSON._id);

	[voloJSON._id, voloJSON.tratta, createFlyButton(voloJSON._id)]
		.forEach(param => tableRow.append(createTableData(param)));

	return tableRow;
}

function emptyCreatedTable() {
	return $("#createdTableId").empty();
}

function buildCreatedTable(JSON) {
	let CreatedTable = emptyCreatedTable();
	JSON.forEach(voloJSON => CreatedTable.append(buildCreatedTableRow(voloJSON)));
}

function createFlyButton(idVolo) {
	var flyButton = $('<button>');

	flyButton.data('idVolo', idVolo).addClass('btn btn-sm btn-success').html('FLY');
	flyButton.click(function () {
		fly(idVolo);
	});

	return flyButton;
}

//-----------Landed/Flying Table----------//
function emptyLandedTable() {
	return $("#landedTableId").empty();
}

function sortJsonByStartDate(json) {
	return json.sort(function (a, b) {
		return (new Date(b.startDate)) - (new Date(a.startDate));
	});
}

function isValidPage(page) {
	return page >= 1 && page <= memorizedtotalPages;
}

function landedTableChangePage(page) {
	if (!isValidPage(page)) {
		return;
	}
	buildLandedTable(undefined, page);
}

function tripleDotAnimation() {
	return '<span class="one">.</span><span class="two">.</span><span class="three">.</span> '
}

function buildLandedTableRow(voloJSON) {
	let { _id, tratta, status, startDate, endDate } = voloJSON;

	let tableRow = createTableRow();

	if (status.toUpperCase() == 'FLYING') {
		tableRow.addClass('bg-success');
		status += tripleDotAnimation() + '&#9992;';
	}

	[_id, tratta, status, startDate, endDate]
		.forEach(param => tableRow.append(createTableData(param)));

	return tableRow;
}

function calculateStartAndEndLandedRowIndex(selectedPage, pageSize, totalRows){
	let startRowIndex = Math.max((selectedPage - 1) * pageSize, 1);
	let endRowIndex = Math.min(startRowIndex + pageSize, totalRows - 1);

	return [startRowIndex, endRowIndex];

}

function buildLandedTable(JSON, selectedPage = 1, pageSize = 10) {
	var landedTable = emptyLandedTable();

	if (JSON) { //ricostruisci la tabella se viene passato un JSON
		JSON = sortJsonByStartDate(JSON);
		memorizedLandedResultJson = JSON;
	}
	else { 		//altrimenti usa il JSON memorizzato precedentemente
		JSON = memorizedLandedResultJson;
	}

	let totalRows = JSON.length;
	memorizedtotalPages = Math.ceil(totalRows / pageSize);

	let [startRowIndex, endRowIndex] = calculateStartAndEndLandedRowIndex(selectedPage, pageSize, totalRows);

	for (let i = startRowIndex; i < endRowIndex; i++) {
		landedTable.append(buildLandedTableRow(JSON[i]));
	}

	buildLandedTableNavigationSection(selectedPage);
}

//--------Navigation Section------------//

function emptyNavigationSection() {
	$("nav[aria-label = landedTableNavigation]").remove();
	return $("<nav>").attr('aria-label', 'landedTableNavigation');
}

function createChangePageButton(innerHTML, pageOnClick) {
	let button = $("<li>").addClass('page-item').append($('<a>').addClass('page-link').html(innerHTML));
	if (!isValidPage(pageOnClick)) {
		return button.addClass('disabled');
	}

	button.click(function () {
		landedTableChangePage(pageOnClick);
	});

	return button;
}

function calculateStartAndEndPages(selectedPage, numberOfPageButtons) {
	let startPage = Math.max(1, selectedPage - Math.ceil(numberOfPageButtons / 2));
	let endPage = Math.min(memorizedtotalPages, startPage + numberOfPageButtons);

	startPage = Math.max(1, Math.min(startPage, endPage - numberOfPageButtons));

	return [startPage, endPage];
}

function buildNavigationButtonList(selectedPage, numberOfPageButtons) {
	let navButtonList = $('<ul>').addClass('pagination justify-content-center');
	let [startPage, endPage] = calculateStartAndEndPages(selectedPage, numberOfPageButtons);

	navButtonList.append(createChangePageButton('First', 1).attr('name','first'));
	navButtonList.append(createChangePageButton('Previous', selectedPage - 1));
	for (let i = startPage; i <= endPage; i++) {
		let listItem = createChangePageButton(i, i).val(i).addClass('w-25');
		navButtonList.append(listItem);
	}
	navButtonList.append(createChangePageButton('Next', selectedPage + 1));
	navButtonList.append(createChangePageButton('Last', memorizedtotalPages).attr('name','last'));

	return navButtonList;
}

function disableButtonByName(name){
	return $("nav[aria-label = landedTableNavigation] ul li[name =" + name + "]").addClass('disabled');
}

function ActivatePageButton(page) {
	if (page == null) {
		return;
	}
	
	$("nav[aria-label = landedTableNavigation] ul li[value =" + page + "]").addClass('active');

	if(page == 1){
		disableButtonByName('first');
	}
	else if(page == memorizedtotalPages){
		disableButtonByName('last');
	}

	memorizedCurrentPage = page;
}

function buildLandedTableNavigationSection(selectedPage, numberOfPageButtons = 15) {
	let navigationSection = emptyNavigationSection();
	let navButtonList = buildNavigationButtonList(selectedPage, numberOfPageButtons);

	navigationSection.append(navButtonList);

	$("#landedTableId").after(navigationSection);
	ActivatePageButton(selectedPage);

	return navigationSection;
}

