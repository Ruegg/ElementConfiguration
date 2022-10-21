/*-------------------------------------
The MIT License (MIT)

Copyright (c) 2016 Andre Ruegg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
------------------------------------*/

var elementInformation = new Array();
var badInput = false;
$(document).ready(function() {
    loadElementInformation();
});

function loadElementInformation() {
    $.get("./elements.txt", function(txt) {
        var lines = txt.split("\n");
        for (var i = 0, len = lines.length; i < len; i++) {
            var line = lines[i];
            var info = line.split("-");
            elementInformation.push(info);
        }
    });
}

$('#input').keydown(function(e) {
    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    if (key == 13) {
        e.preventDefault();
        parseInput();
    }
});

function getInformation(lookup, length) {
    var returning;
    for (var x = 0; x != elementInformation.length; x++) {
        var currentInformation = elementInformation[x];
        if (currentInformation[length].toLowerCase() == lookup.toLowerCase()) {
            returning = currentInformation;
            break;
        }
    }
    return returning;
}

function parseInput() {
    var input = $('#input').val();
    $("#actualInformation").hide();
    if (isNaN(input) == false) { //If is number
        setGoodInput();
        var information = getInformation(input, 2);
        if (typeof information != 'undefined') {
            createInformation(information);
        } else {
            setBadInput();
            $('#status').html("Invalid atomic number.");
        }
    } else if (input.length <= 3 && input.match(/\d+/g) == null) {
        setGoodInput();
        var information = getInformation(input, 1);
        if (typeof information != 'undefined') {
            createInformation(information);
        } else {
            setBadInput();
            $('#status').html("Invalid abbreviation.");
        }
    } else if (input.match(/\d+/g) != null) {
        if (input.startsWith("1s2")) {
            setGoodInput();
            var atomicNumber = getAtomicNumberThroughFullConfig(input.split(" "));
            if (atomicNumber != 0) {
                createInformation(getInformation("" + atomicNumber, 2));
            } else {
                setBadInput();
                $('#status').html("Bad electron full configuration");
            }
        } else {
            setGoodInput();
            var atomicNumber = getAtomicNumberThroughLazyConfig(input.split(" "));
            if (atomicNumber != 0) {
                createInformation(getInformation("" + atomicNumber, 2));
            } else {
                setBadInput();
                $('#status').html("Bad electron lazy configuration");
            }
        }
    } else {
        setGoodInput();
        var information = getInformation(input, 0);
        if (typeof information != 'undefined') {
            createInformation(information);
        } else {
            setBadInput();
            $('#status').html("Invalid element name.");
        }
    }
}

function setGoodInput() {
    if (badInput) {
        $('#input').removeClass("form-control-danger");
        $('#input').addClass("form-control-success");
        $('#inputWrapper').removeClass("has-danger");
        $('#inputWrapper').addClass("has-success");
        badInput = false;
    }
}

function setBadInput() {
    if (badInput == false) {
        $('#input').removeClass("form-control-success");
        $('#input').addClass("form-control-danger");
        $('#inputWrapper').removeClass("has-success");
        $('#inputWrapper').addClass("has-danger");
        badInput = true;
    }
}

function createInformation(information) {
    $("#status").html("Loading information...");

    $("#elementName").html(information[0]);
    $("#elementAbbreviation").html(information[1]);
    $("#atomicNumber").html(information[2]);
    //Configuration Information
    var electrons = information[2];
    var ob = new OrbitalDiagram(parseInt(electrons));
    for (var i = 0; i < electrons; i++) {
        ob.putElectronInCurrentOrbital();
    }
    var splitConfiguration = new Array();
    var entrySet = ob.getOrbital().getEntrySet();
    for (var x = 0; x != entrySet.length; x++) {
        var e = entrySet[x];
        if (e.getValue() > 0) {
            splitConfiguration.push(e.getKey() + e.getValue());
        }
    }
	var nobleGasConfiguration;
	var nobleGasConfigurationArrayInformation = ob.getNobleGasConfiguration(splitConfiguration);
	if(nobleGasConfigurationArrayInformation != 0){
		nobleGasConfiguration = "[" + nobleGasConfigurationArrayInformation[0] + "] " + getStringFromArray(superScriptConfigurationArray(nobleGasConfigurationArrayInformation[1]));
	}else{
		nobleGasConfiguration = "Not available on this element";
	}

    var lazyConfiguration = getStringFromArray(superScriptConfigurationArray(ob.getLazyConfiguration(splitConfiguration)));

    $("#fullConfiguration").html(getStringFromArray(superScriptConfigurationArray(splitConfiguration)));
    $("#nobleGasConfiguration").html(nobleGasConfiguration);
    $("#lazyConfiguration").html(lazyConfiguration);
    $("#status").html("");

    //Display
    var canvas = document.getElementById('orbitalDiagram');
    var dupped = splitConfiguration.sort();
    canvas.height = parseInt(dupped[dupped.length - 1].substring(0, 1)) * 48;
    canvas.width = 600;
    drawOrbitalDiagram(entrySet, splitConfiguration);
    $("#actualInformation").show();
}

function superScriptConfigurationArray(splitConfiguration){
	var superScriptedArray = new Array();
	for(var i =0; i != splitConfiguration.length;i++){
		var rowEnergy = splitConfiguration[i];
		var superScriptedRowEnergy = convertRowEnergyToSuperScript(rowEnergy);
		superScriptedArray.push(superScriptedRowEnergy);
	}
	return superScriptedArray;
}

function convertRowEnergyToSuperScript(rowEnergy){
	var blocks = ["s", "p", "d", "f"];
	var valueIndex = 0;
	for(var i =0; i != blocks.length;i++){
		var currentBlock = blocks[i];
		if(rowEnergy.indexOf(currentBlock) > -1){
			valueIndex = (rowEnergy.indexOf(currentBlock))+1;
		}
	}
	var value = rowEnergy.substring(valueIndex, rowEnergy.length);
	value = parseInt(value);
	var superScripted = rowEnergy.substring(0, valueIndex) + "<sup>" + value + "</sup>";
	return superScripted;
}

function drawOrbitalDiagram(entrySet, splitConfiguration) {
    var context = document.getElementById('orbitalDiagram').getContext('2d');
    for (var i = 0; i != entrySet.length; i++) {
        var e = entrySet[i];
        var oldEnergyLevel = e.getKey();
        var electrons = e.getValue();
        if (electrons > 0) {
            var row = parseInt(oldEnergyLevel.substring(0, 1));
            var energyLevel = oldEnergyLevel.substring(1, 2);
            var orbitalAmount = getOrbitalAmount(energyLevel);
            var electronDistribution = getEvenElectronDistribution(orbitalAmount, electrons);

            context.font = "14px Lato";
            context.fillText(oldEnergyLevel, getDrawDelay(energyLevel) + 4, (document.getElementById('orbitalDiagram').height - (row * 24 + (row * 24))) + 18);

            for (var x = 1; x != (orbitalAmount + 1); x++) {
                var currentElectrons = electronDistribution.get(x - 1);
                drawBoxAt(getDrawDelay(energyLevel) + (x * 24), row * 24 + (row * 24), energyLevel, currentElectrons);
            }
        }
    }
}

function getEvenElectronDistribution(orbitals, electrons) {
    var distribution = new Diagram();
    var track = -1;
    for (var x = 0; x != orbitals; x++) {
        distribution.put(x, 0);
    }
    for (var x = 0; x != electrons; x++) {
        if (track != (orbitals - 1)) {
            track++;
        } else {
            track = 0;
        }
        distribution.put(track, distribution.get(track) + 1);
    }
    return distribution;
}

function drawBoxAt(x, y, energyLevel, electronAmount) {
    var context = document.getElementById('orbitalDiagram').getContext('2d');
    var newY = document.getElementById('orbitalDiagram').height - y;
    context.beginPath();
    if (energyLevel == "s") {
        context.strokeStyle = "#FC6060";
    } else if (energyLevel == "p") {
        context.strokeStyle = "#609CFC";
    } else if (energyLevel == "d") {
        context.strokeStyle = "#60FC8A";
    } else if (energyLevel == "f") {
        context.strokeStyle = "#FCF260";
    }
    context.rect(x, newY, 24, 24);
    context.stroke();
    context.strokeStyle = "#373a3c";
    if (electronAmount > 0) {
        var fromy = newY + 20;
        var toy = newY + 4;
        var fromx = x + 6;
        var tox = x + 6;
        var angle = Math.atan2(toy - fromy, tox - fromx);
        context.beginPath();
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox - 4 * Math.cos(angle - Math.PI / 6), toy - 4 * Math.sin(angle - Math.PI / 6));
        context.moveTo(tox, toy);
        context.lineTo(tox - 4 * Math.cos(angle + Math.PI / 6), toy - 4 * Math.sin(angle + Math.PI / 6));
        context.stroke();
    }
    if (electronAmount > 1) {
        var fromy = newY + 4;
        var toy = newY + 20;
        var fromx = x + 14;
        var tox = fromx;
        var angle = Math.atan2(toy - fromy, tox - fromx);
        context.beginPath();
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox - 4 * Math.cos(angle - Math.PI / 6), toy - 4 * Math.sin(angle - Math.PI / 6));
        context.moveTo(tox, toy);
        context.lineTo(tox - 4 * Math.cos(angle + Math.PI / 6), toy - 4 * Math.sin(angle + Math.PI / 6));
        context.stroke();
    }
}

function getDrawDelay(gL) {
    if (gL == "s") {
        return 0;
    } else if (gL == "p") {
        return 24 * 2;
    } else if (gL == "d") {
        return 24 * 6;
    } else if (gL == "f") {
        return 24 * 13;
    } else {
        return 0;
    }
}

function getOrbitalAmount(gL) {
    if (gL == "s") {
        return 1;
    } else if (gL == "p") {
        return 3;
    } else if (gL == "d") {
        return 5;
    } else if (gL == "f") {
        return 7;
    } else {
        return 0;
    }
}

function getAtomicNumberThroughLazyConfig(config) {
    var atomicnumber = 0;
    var ob = new OrbitalDiagram(118);
    for (var i = 0; i < 118; i++) {
        ob.putElectronInCurrentOrbital();
        var fullConfiguration = "";
        var splitConfiguration = new Array();
        var entrySet = ob.getOrbital().getEntrySet();
        for (var x = 0; x != entrySet.length; x++) {
            var e = entrySet[x];
            if (e.getValue() > 0) {
                fullConfiguration = fullConfiguration + e.getKey() + e.getValue();
                splitConfiguration.push(e.getKey() + e.getValue());
            }
        }
        var lazyConfiguration = ob.getLazyConfiguration(splitConfiguration);
        if (getStringFromArray(lazyConfiguration.sort()) == getStringFromArray(config.sort())) {
            atomicnumber = i + 1;
            break;
        }
    }
    return atomicnumber;
}

function getAtomicNumberThroughFullConfig(config) {
    var atomicnumber = 0;
    var ob = new OrbitalDiagram(118);
    for (var i = 0; i < 118; i++) {

        ob.putElectronInCurrentOrbital();
        var splitConfiguration = new Array();
        var entrySet = ob.getOrbital().getEntrySet();
        for (var x = 0; x != entrySet.length; x++) {
            var e = entrySet[x];
            if (e.getValue() > 0) {
                splitConfiguration.push(e.getKey() + e.getValue());
            }
        }

        if (getStringFromArray(splitConfiguration.sort()) == getStringFromArray(config.sort())) {
            atomicnumber = i + 1;
        }
    }
    return atomicnumber;
}

function OrbitalDiagram(electrons) {
    this.electrons = electrons;
    this.orbital = new Diagram();

    this.blocks = ["s", "p", "d", "f"];

    this.energyLevels = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p", "8s", "6f", "7d", "8p", "9s", "7f", "8d", "9p", "10s", "8f", "9d", "10p", "11s"];

    this.nobleGasRowEnergies = ["1s2", "2p6", "3p6", "4p6", "5p6", "6p6"];
    this.nobleGasNames = ["He", "Ne", "Ar", "Kr", "Xe", "Rn"];

    this.currentEnergyLevel = "1s";

    this.priorityFill = false;
    this.priorityEnergyLevel = "";
    this.waitPriorityFill = 0;

    this.getOrbital = function() {
        return this.orbital;
    }

    this.putElectronInCurrentOrbital = function() {
        if (this.priorityFill == false) {
            var currentRowEnergy = this.currentEnergyLevel + this.customGet(this.currentEnergyLevel);


            this.basicElectronAdd();

            this.checkEnergyLevel();
            currentRowEnergy = this.currentEnergyLevel + this.customGet(this.currentEnergyLevel);

            var borrowInformation = this.getBorrowingInformation(currentRowEnergy);
            if (borrowInformation != null) {
                var borrowCount = parseInt(borrowInformation[0]);
                var borrowEnergyLevel = borrowInformation[1];
                var hasPriorityFill = parseBoolean(borrowInformation[2]);
                this.orbital.put(borrowEnergyLevel, this.customGet(borrowEnergyLevel) - 1);
                this.orbital.put(this.currentEnergyLevel, this.customGet(this.currentEnergyLevel) + 1);
                borrowCount = borrowCount - 1;
                if (hasPriorityFill == true) {
                    this.priorityFill = true;
                    this.priorityEnergyLevel = borrowEnergyLevel;
                    this.waitPriorityFill = borrowCount;
                }
            }
        } else {
            if (this.waitPriorityFill == 0) {
                this.orbital.put(this.priorityEnergyLevel, (this.customGet(this.priorityEnergyLevel) + 1));
                if (this.customGet(this.priorityEnergyLevel) == 2) {
                    this.priorityFill = false;
                    this.priorityEnergyLevel = "";
                    this.waitPriorityFill = 0;
                }
            } else {
                this.waitPriorityFill = this.waitPriorityFill - 1;
                this.basicElectronAdd();
            }
        }
    };

    this.basicElectronAdd = function() {
        this.checkEnergyLevel();
        this.orbital.put(this.currentEnergyLevel, (this.customGet(this.currentEnergyLevel) + 1));
    }

    this.checkEnergyLevel = function() {
        if (this.customGet(this.currentEnergyLevel) >= this.getMaxElectrons(this.getCurrentBlock())) {
            this.currentEnergyLevel = this.getNextEnergyLevel(this.currentEnergyLevel);
        }
    }

    this.customGet = function(energyLevel) {
        if (this.orbital.containsKey(energyLevel)) {
            return this.orbital.get(energyLevel);
        } else {
            this.orbital.put(energyLevel, 0);
            return 0;
        }
    }

    this.getNextEnergyLevel = function(energyLevel) {
        var returning = null;
        for (var x = 0; x != this.energyLevels.length; x++) {
            if (this.energyLevels[x] == energyLevel) {
                returning = this.energyLevels[x + 1];
                break;
            }
        }
        return returning;
    }

    this.getCurrentBlockIndex = function() {
        return this.getBlockIndex(this.currentEnergyLevel.substring(1, this.currentEnergyLevel.length));
    }

    this.getCurrentBlock = function() {
        return this.blocks[this.getCurrentBlockIndex()];
    }

    this.getBlockIndex = function(block) {
        var returning = 0;
        switch (block) {
            case "s":
                returning = 0;
                break;
            case "p":
                returning = 1;
                break;
            case "d":
                returning = 2;
                break;
            case "f":
                returning = 3;
                break;
        }
        return returning;
    }

    this.getMaxElectrons = function(gL) {
        if (gL == "s") {
            return 2;
        } else if (gL == "p") {
            return 6;
        } else if (gL == "d") {
            return 10;
        } else if (gL == "f") {
            return 14;
        } else {
            return 0;
        }
    }

    this.getBorrowingInformation = function(rowEnergy) {
        if (rowEnergy == "3d4") {
            var borrow = ["1", "4s", "true"];
            return borrow;
        } else if (rowEnergy == "3d9") {
            var borrow = ["1", "4s", "true"];
            return borrow;
        } else if (rowEnergy == "4d3") {
            var borrow = ["2", "5s", "true"]; // True = Set priority back
            // to s after borrowing
            return borrow;
        } else if (rowEnergy == "4d6") {
            var borrow = ["2", "5s", "false"]; // False = don't set
            // priority back to s
            // after borrowing
            return borrow;
        } else if (rowEnergy == "4d9") {
            var borrow = ["1", "5s", "true"];
            return borrow;
        } else {
            return null;
        }
    }
    this.getNobleGasConfiguration = function(splitConfiguration) {
		var nobleGas = "";
		var followingRowEnergies = new Array();
		for(var i = (splitConfiguration.length -1);i != -1;i--){
			var currentRowEnergy = splitConfiguration[i];

			for(var x = (this.nobleGasRowEnergies.length - 1); x != -1; x--){
				var currentNobleGasRowEnergy = this.nobleGasRowEnergies[x];
				if(currentRowEnergy == currentNobleGasRowEnergy){
					nobleGas = this.nobleGasNames[x];
					break;
				}
			}
			if(nobleGas == ''){
				followingRowEnergies.push(currentRowEnergy);
			}else{
				break;
			}
		}
		if(nobleGas == ""){
			return 0;
		}else{
			return [nobleGas, followingRowEnergies.reverse()];
		}
    }

    this.getLazyConfiguration = function(configuration) {
        var lazyConfiguration = "";
        for (var x = 0; x != configuration.length - 1; x++) { //For all rowenergies except for the last one
            var currentRowEnergy = configuration[x];
            var block = currentRowEnergy.substring(1, 2);
            var electronCount = parseInt(currentRowEnergy.substring(2, currentRowEnergy.length));
            if (electronCount != this.getMaxElectrons(block)) {
                lazyConfiguration = lazyConfiguration + currentRowEnergy + ".";
            }
        }
        lazyConfiguration = lazyConfiguration + configuration[configuration.length - 1];
        return lazyConfiguration.split(".");
    }
}

function getStringFromArray(a) {
    var out = "";
    for (var i = 0; i != a.length; i++) {
        out = out + a[i];
    }
    return out;
}

function parseBoolean(s) {
    if (s == "true") {
        return true;
    } else {
        return false;
    }
}

function Diagram() {
    var entries = new Array();

    this.getEntrySet = function() {
        return entries;
    }

    this.containsKey = function(key) {
        var exist = false;
        for (i = 0; i < entries.length; i++) {
            var currentEntry = entries[i];
            if (currentEntry.getKey() == key) {
                exist = true;
                break;
            }
        }
        return exist;
    }

    this.get = function(key) {
        var returning = -1;
        for (i = 0; i < entries.length; i++) {
            var currentEntry = entries[i];
            if (currentEntry.getKey() == key) {
                returning = currentEntry.getValue();
                break;
            }
        }
        return returning;
    }

    this.put = function(key, value) {
        for (i = 0; i < entries.length; i++) {
            var currentEntry = entries[i];
            if (currentEntry.getKey() == key) {
                entries.splice(i, 1);
                break;
            }
        }
        var newEntry = new Entry(key, value);
        entries.push(newEntry);
    }
}

function Entry(key, value) {
    this.key = key;
    this.value = value;
    this.getKey = function() {
        return this.key;
    }

    this.getValue = function() {
        return this.value;
    }
}
