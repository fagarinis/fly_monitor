//refresh tabella Landed/Flying
const REFRESH_TIME = 20000;
var autoRefresh = setInterval(listLanded, REFRESH_TIME);

$(document).ready(function () {
	listLanded();
});

function doCall(typeRequest, urlPath, parametri, callbackOnSuccess, callbackOnError, spinnerName) {
	const HOST = 'http://212.237.32.76:3001';
	const AJAX_TIMEOUT = 10000;

	if (spinnerName) {
		showSpinnerByName(spinnerName);
	}

	$.ajax({
		url: HOST + urlPath,
		type: typeRequest,
		data: JSON.stringify(parametri),
		contentType: "application/json",
		dataType: "json",
		success: callbackOnSuccess,
		error: callbackOnError,
		complete: function (jqXHR, textStatus) {
			if (spinnerName && textStatus != "pending") {
				hideSpinnerByName(spinnerName, 1000);
			}
		},
		timeout: AJAX_TIMEOUT
	});
}

function disableListButton(){
	$("#listButtonId").prop("disabled", true);
}

function enableListButton(){
	$("#listButtonId").prop("disabled", false);
}

function setErroreVolo(error) {
	$('#erroreVoloId').html(error);
}

function clearErroreVolo() {
	setErroreVolo('');
}

function listCreated() {
	clearErroreVolo();

	disableListButton()
	doCall('GET', '/list', undefined, 
		function onSuccess(resultJson) {
			buildCreatedTable(resultJson);
			enableListButton();
	},	function  onError() {
			enableListButton();
	}, 'spinner');
}

function listLanded() {
	doCall('GET', '/status', undefined, function onSuccess(resultJson) {
		buildLandedTable(resultJson, memorizedCurrentPage);
	}, undefined, 'spinnerLanded');
}

function showSpinnerByName(spinnerName) {
	$("[name='"+spinnerName+"']").show();
}

function hideSpinnerByName(spinnerName, hideDelay) {
	let spinner = $("[name='"+spinnerName+"']");
	setTimeout(function () {
		spinner.hide();
	}, hideDelay);
}

function getCreatedTableRow(voloId) {
	return $('tr[data-voloId =' + voloId + ']');
}

function removeCreatedTableRow(voloId){
	getCreatedTableRow(voloId).remove();
}

function fly(voloId) {
	clearErroreVolo();
	clearInterval(autoRefresh);

	doCall('GET', '/start/' + voloId, undefined,
		function onSuccess(resultJson) {
			removeCreatedTableRow(voloId);
			listLanded();
			autoRefresh = setInterval(listLanded, REFRESH_TIME);
		},
		function onError(xhr, textStatus) {
			if (xhr.status == 422) { //nel caso l'aereo e' gia' partito
				setErroreVolo('errore di sincronizzazione: Volo [ID: ' + voloId + '] gia partito');
				removeCreatedTableRow(voloId);
			}
			listLanded();
			autoRefresh = setInterval(listLanded, REFRESH_TIME);
		}
	)
}

