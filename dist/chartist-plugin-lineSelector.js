Chartist.plugins=Chartist.plugins||{},Chartist.plugins.lineSelector=function(){return function(n){n instanceof Chartist.Line&&n.on("draw",function(n){"line"!==n.type&&"point"!==n.type||(n.element._node.onclick=function(n){var t=n.target.parentNode,e=t.parentNode;e.removeChild(t),e.appendChild(t)})})}};