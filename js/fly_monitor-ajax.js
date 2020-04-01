//refresh tabella Landed/Flying
const REFRESH_TIME = 20000
var autoRefresh = setInterval(listLanded, REFRESH_TIME);

$(document).ready(function () {
	listLanded();
});

function doCall(typeRequest, urlPath, parametri, callbackOnSuccess, callbackOnError, isSpinnerShown) {
	const HOST = 'http://212.237.32.76:3001';
	const AJAX_TIMEOUT = 10000;

	if (isSpinnerShown) {
		showSpinner();
	}

	$.ajax({
		url: HOST + urlPath,
		type: typeRequest,
		data: JSON.stringify(parametri),
		contentType: "application/json",
		dataType: "json",
		success: callbackOnSuccess,
		error: callbackOnError,
		complete: function () {
			if (isSpinnerShown) {
				hideSpinner(1000);
			}
		},
		timeout: AJAX_TIMEOUT
	});
}

function listCreated() {
	clearErroreVolo();

	$("#listButtonId").prop("disabled", true);
	doCall('GET', '/list', undefined, function (resultJson) {
		buildCreatedTable(resultJson);
		$("#listButtonId").prop("disabled", false);
	},
		function () {
			$("#listButtonId").prop("disabled", false);
		},
		true);
}

function listLanded() {
	doCall('GET', '/status', undefined, function (resultJson) {
		buildLandedTable(resultJson, memorizedCurrentPage);
	});
}

function showSpinner() {
	$("[name='spinner']").show();
}

function hideSpinner(hideDelay) {
	var spinner = $("[name='spinner']");
	setTimeout(function () {
		spinner.hide()
	}, hideDelay);
}

function fly(voloId) {
	clearErroreVolo();
	clearInterval(autoRefresh);

	doCall('GET', '/start/' + voloId, undefined,
		function (resultJson) { //success
			getCreatedTableRow(voloId).remove();
			listLanded();
			autoRefresh = setInterval(listLanded, REFRESH_TIME);
		},
		function (xhr, textStatus) { //error
			if (xhr.status == 422) { //nel caso l'aereo e' gia' partito
				setErroreVolo('errore di sincronizzazione: Volo [ID: ' + voloId + '] gia partito');
				getCreatedTableRow(voloId).remove();
			}
			listLanded();
			autoRefresh = setInterval(listLanded, REFRESH_TIME);
		}
	)
}

function setErroreVolo(error) {
	$('#erroreVoloId').html(error);
}

function clearErroreVolo() {
	setErroreVolo('');
}

function getCreatedTableRow(voloId) {
	return $('tr[data-voloId =' + voloId + ']');
}