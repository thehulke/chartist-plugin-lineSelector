Chartist.plugins = Chartist.plugins || {};
Chartist.plugins.lineSelector = () => {

    return function lineSelector(chart) {
        if (chart instanceof Chartist.Line) {
            chart.on('draw', (data) => {
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
