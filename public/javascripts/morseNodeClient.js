//Variables -----------------
	//<link rel='stylesheet' href='//fonts.googleapis.com/css?family=font1|font2|etc' type='text/css'>
	var socket = io();
	var spaceTimer, selectedWire;
	var oldSelectedWire = "Alpha";
	var dashTone = new Howl({
		urls: ['/sounds/dashTone.ogg']
	});
	var dotTone = new Howl({
		urls: ['/sounds/dotTone.ogg']
	});
	var wiretable = document.getElementById('wireTable');
	var $dashDelay, $characterDelay;
	
	//Populates the wire population table
	socket.on('table update', function(wireCountArray){
	wiretable.rows[1].cells[1].innerHTML = wireCountArray[0];
	wiretable.rows[2].cells[1].innerHTML = wireCountArray[1];
	wiretable.rows[3].cells[1].innerHTML = wireCountArray[2];
	wiretable.rows[4].cells[1].innerHTML = wireCountArray[3];
	wiretable.rows[5].cells[1].innerHTML = wireCountArray[4];
    });
	
	//Gets the selection room from option box
	function getSelectedText(elementId) {
		var elt = document.getElementById(elementId);
		if (elt.selectedIndex == -1)
			return null;
		return elt.options[elt.selectedIndex].text;
	}
	
	//Changes selected room
	function changeWire() {
		selectedWire = getSelectedText('wires');
		if (selectedWire === null){
		return;
		}
		if (selectedWire != oldSelectedWire) {
			socket.emit("change wire", selectedWire);
			oldSelectedWire = selectedWire;
		}
		document.getElementById('tickerIn').value = "";
		document.getElementById('tickerOut').value = "";
	}
	
	//Fills the textArea with received data
	function addText(elId,text) {
		document.getElementById(elId).value += text;
    }
	
	//Sends out a space character when called
	function appendSpace() {
		socket.emit('send morse signal', "/");
		addText('tickerOut', "/");
    }
	
	//Depending on mode selection, timings on transmission will change.
	$( document).ready( function() {
	var getSelectedMode = function() {
	var selectedMode = $('input[name="mode"]:checked').val();
	if (selectedMode === "Beginner"){
	$dashDelay = 150;
	$characterDelay = 500;
	} else {
	$dashDelay = 150;
	$characterDelay = 150;
	}}
	getSelectedMode();
	$( "input[type=radio]" ).on("click", getSelectedMode);
	
	//Distinguishes between clicks and long clicks and sends corresponding morse code. 
    $( '#clicker').mayTriggerLongClicks( {
		delay: $dashDelay
    } ).on( 'longClick', function() {
		socket.emit('send morse signal', "-");
		addText('tickerOut',"-");
    } ).on( 'click', function() {
		socket.emit('send morse signal', ".");
		addText('tickerOut',".");
    } );
	
	//Gets signal from server.
	socket.on('receive morse signal', function(msg){
	if (msg === "."){
		dotTone.play();
		} else if (msg === "-"){
			dashTone.play();
		}
		addText('tickerIn',msg);
    });
	
	//Flashes the indicator light on and off as data is sent.
	$('#clicker').mousedown(function () {
		var src = "/images/lighton.png";
		$('#light').attr("src", src);
		clearTimeout(spaceTimer);
		return false;
    });
    $('#clicker').mouseup(function () {
		spaceTimer = setTimeout(appendSpace, $characterDelay);
		var src = "/images/lightoff.png";
		$("#light").attr("src", src);
		return false;
    });
    $('#clicker').mouseout(function () {
		var src = "/images/lightoff.png";
		$("#light").attr("src", src);
		return false;
    });
	
    });