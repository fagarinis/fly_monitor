
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
	$("#listButtonId").prop("disabled",true);
	doCall('GET', '/list', undefined, function (resultJson) {
		buildCreatedTable(resultJson);
		$("#listButtonId").prop("disabled",false);
	}, 
	function(){
		$("#listButtonId").prop("disabled",false);
	}, 
	
	true);
}

function listLanded() {
	doCall('GET', '/status', undefined, function (resultJson) {
		buildLandedTable(resultJson);
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

function fly(buttonHTML) {
	var id = buttonHTML.id;
	clearInterval(autoRefresh);

	//remove row
	buttonHTML.parentElement.parentElement.remove();

	doCall('GET', '/start/' + id, undefined, function (resultJson) {
		listLanded();
		autoRefresh = setInterval(listLanded, REFRESH_TIME);
	})
}
