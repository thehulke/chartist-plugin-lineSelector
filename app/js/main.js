var Chartist = require('chartist');
var lineSelector =  require('chartist-plugins-line_selector');

var data = {
	labels: ['', '1d', '2d', '3d', '4d', '5d', '6d', '7d', '8d'],
	series: [
		[0, 5, 8, 10, 7, 6, 5, 5, 4],
		[4, 8, 3, 5, 7, 9, 12, 6, 5],
		[4, 8, 3, 2, 7, 9, 12, 9, 5]
	]
};

var options = {
	low: 0,
	high: 15,
	showArea: true,
	plugins: [
		Chartist.plugins.lineSelector()
	],
	axisY: {
		onlyInteger: true,
		offset: 20
	}
};

var lineChart = new Chartist.Line('.line-chart', data, options);

lineChart.on('draw', function(data) {
	if (data.type === 'line' || data.type === 'area') {
		data.element.animate({
			d: {
				begin: 700 * data.index,
				dur: 1000,
				from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
				to: data.path.clone().stringify(),
				easing: Chartist.Svg.Easing.easeOutQuint
			}
		});
	}
});
