$(document).ready(function() {
	// function for reading text content of html
	function readText(tag) {
		return tag.text();
	}

	// closure for updating html
	function writeHTML(tag) {
		function inserter(content) {
			return tag.html(content);
		}
		return inserter;
	}
});