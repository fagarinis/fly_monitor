
var activeCalls = 0;

const REFRESH_TIME = 5000 //ogni quanti ms si refreshano le tabelle
var autoRefresh;

function doCall(typeRequest, urlPath, parametri, callbackOnSuccess, callbackOnError) {
	const HOST = 'http://212.237.32.76:3001';
	const AJAX_TIMEOUT = 10000;

	activeCalls++;
	showSpinner();
	$.ajax({
		url: HOST + urlPath,
		type: typeRequest,
		data: JSON.stringify(parametri),
		contentType: "application/json",
		dataType: "json",
		success: callbackOnSuccess,
		error: callbackOnError,
		complete: function () {
			activeCalls--;
			hideSpinner(1000);
		},
		timeout: AJAX_TIMEOUT
	});
}

function isBlank(str) {
	return (!str || /^\s*$/.test(str));
}

function list() {
	doCall('GET', '/list', undefined, function (resultJson) {
		buildCreatedInProgressTable(resultJson);
	});

	doCall('GET', '/status', undefined, function (resultJson) {
		buildLandedTable(resultJson);
	});

	setAutoRefresh(true);
}

function showSpinner() {
	$("[name='spinner']").show();
}

function hideSpinner(hideDelay) {
	if (activeCalls > 0) {
		return;
	}
	var spinner = $("[name='spinner']");
	setTimeout(function () {
		spinner.hide()
	}, hideDelay);
}

function fly(buttonHTML) {
	setAutoRefresh(false);
	console.log("vola id: " + buttonHTML.id);
	var id = buttonHTML.id;

	doCall('GET', '/start/' + id, undefined, function (resultJson) {
		console.log(resultJson)
		list();
	})
}

function setAutoRefresh(activateAutoRefresh) {
	if (activateAutoRefresh) {
		clearInterval(autoRefresh);
		autoRefresh = setInterval(list, REFRESH_TIME)
	}
	else {
		clearInterval(autoRefresh);
	}
}

