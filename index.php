<html>
<head>
<title>Element Configurations</title>
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" rel="stylesheet" integrity="sha256-xWeRKjzyg6bep9D1AsHzUPEWHbWMzlRc84Z0aG+tyms= sha512-mGIRU0bcPaVjr7BceESkC37zD6sEccxE+RJyQABbbKNe83Y68+PyPM5nrE1zvbQZkSHDCJEtnAcodbhlq2/EkQ==" crossorigin="anonymous">
<link href='https://fonts.googleapis.com/css?family=Lato' rel='stylesheet' type='text/css'>
<style>
.inputBox {
	width: 40%;
	min-width: 200px;
	height: auto;
	margin-left: auto;
	margin-right: auto;
	margin-top: 20px;
	padding: 10px;
}

h4,p,h2,h5{
	font-family: 'Lato', sans-serif;
}

.centered-text {
	text-align: center;
}

.centered{
	margin-left: auto;
	margin-right: auto;
}

.header {
	padding: 2px;
}

.informationBox {
	width: 60%;
	min-width: 300px;
	border: 2px solid #A8D4E3;
	height: auto;
	margin-left: auto;
	margin-right: auto;
  padding: 15px;
}
  
#elementAbbreviation{
    color: #A8D4E3;
}

.creditRow {
	margin-top: 10%;
	width: 100%;
	height: 24px;
	text-align: center;
	color: #fff;
	background-color: #373A3C;
}
</style>
</head>
<body>
<div class="inputBox">
	<h4 class="centered-text header">Configurations</h4>
	<p class="centered-text">Input Example: Chromium || Cr || 24 || '4s1 3d5' || '1s2 2s2 2p6 3s2 3p6 4s1 3d5'</p>
	<div id="inputWrapper" class="form-group has-success">
	  <input type="text" class="form-control form-control-success" id="input">
	</div>
</div>
<div class="informationBox">
<h5 class="centered-text" id ="status">Waiting for input...</h5>
  <div style="display: none;" id="actualInformation">
    <h2><span id="elementName"></span> - <span id="elementAbbreviation"></span></span></h2>
    <p>Atomic #: <span id="atomicNumber"></span></p>
    <p>Full Configuration: <span id="fullConfiguration"></span></p>
    <p>Noble Gas Configuration: <span id="nobleGasConfiguration"></span></p>
    <p>Lazy Configuration: <span id="lazyConfiguration"></span></p>
	<p>Orbital Diagram</p>
	<canvas id="orbitalDiagram"></canvas>
  </div>
</div>
<div class="creditRow">Andre Ruegg - <a href="https://github.com/MasterBugPatch/ElementConfiguration">Open Source</a> licensed under <b>The MIT License (MIT)</b></div>
</body>
<footer>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js" integrity="sha256-GMscmjNs6MbZvXG2HRjP3MpdOGmXv078SRgH7M723Mc= sha512-1wnhBRtA+POGVA0yREk2RlDbJEdkNvMuRBGjT1FCI5wXmpiQHZWDIB8MpANBWM/GKSPDgCA/7HTrAIFgv70/Jw==" crossorigin="anonymous"></script>
<script src="./main.js"></script>
</script>
</footer>
</html>