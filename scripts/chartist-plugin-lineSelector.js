var Chartist = require('chartist');

Chartist.plugins = Chartist.plugins || {};
Chartist.plugins.lineSelector = function() {

	return function lineSelector(chart) {
		if (chart instanceof Chartist.Line) {
			chart.on('draw', function(data) {
				if (data.type === 'line' || data.type === 'point') {
					data.element._node.onclick = function(e) {
						var targetLine = e.target.parentNode;
						var chartArea = targetLine.parentNode;
						chartArea.removeChild(targetLine);
						chartArea.appendChild(targetLine);
					}
				}
			});
		}
	};
};
