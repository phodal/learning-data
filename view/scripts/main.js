var exampleNS = {};

exampleNS.getRendererFromQueryString = function() {
	var obj = {}, queryString = location.search.slice(1),
		re = /([^&=]+)=([^&]*)/g, m;

	while (m = re.exec(queryString)) {
		obj[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}
	if ('renderers' in obj) {
		return obj['renderers'].split(',');
	} else if ('renderer' in obj) {
		return [obj['renderer']];
	} else {
		return undefined;
	}
};

var view = new ol.View({
	center: [12119653.781323666,4054689.6824535457],
	zoom: 4
});

var controls = ol.control.defaults({rotate: false});
var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false});

var map = new ol.Map({
	controls: controls,
	interactions: interactions,
	layers: [
		new ol.layer.Tile({
			source: new ol.source.BingMaps({
				key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
				culture: 'zh-CN',
				imagerySet: 'Road'
			})
		})
	],
	renderer: exampleNS.getRendererFromQueryString(),
	target: 'map',
	view: view
});

var client = new $.es.Client({
	hosts: 'localhost:9200'
});

var query = {
	index: 'nginx',
	type: 'log',
	size: 200,
	body: {
		query: {
			query_string: {
				query: "*"
			}
		},
		aggs: {
			2: {
				terms: {
					field: "city",
					size: 10,
					order: {
						_count: "desc"
					}
				}
			}
		}
	}
};

client.search(query).then(function(results){
	var vectorSource = new ol.source.Vector({ });
	$.each(results.hits.hits, function(index, result){
		result = result._source;
		if(result.location === null) {
			return;
		}
		var position = result.location.split(",");
		var pos = ol.proj.transform([parseFloat(position[0]), parseFloat(position[1])], 'EPSG:4326', 'EPSG:3857');

		var iconFeature = new ol.Feature({
			geometry: new ol.geom.Point(pos),
			city: result.city
		});
		vectorSource.addFeature(iconFeature);
	});

	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon(({
			anchor: [0.5, 46],
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			opacity: 0.75,
			src: 'img/icon.png'
		}))
	});

	var vectorLayer = new ol.layer.Vector({
		source: vectorSource,
		style: iconStyle
	});
	map.addLayer(vectorLayer);

	var element = document.getElementById('popup');

	var popup = new ol.Overlay({
		element: element,
		positioning: 'bottom-center',
		stopEvent: false
	});
	map.addOverlay(popup);

	map.on('click', function(evt) {
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			function(feature, layer) {
				return feature;
			});

		if (feature) {
			var geometry = feature.getGeometry();
			var coord = geometry.getCoordinates();
			popup.setPosition(coord);
			$(element).popover({
				'placement': 'top',
				'html': true,
				'content': "<h4>" + feature.get('city') + "</h4>"
			});
			$(element).popover('show');
		} else {
			$(element).popover('destroy');
		}
	});

	var width = 300,
		height = 300,
		radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
		.range(["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#4caf50", "#8bc34a", "#cddc39", "#3498db", "#2980b9", "#34495e", "#2c3e50", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#e74c3c", "#c0392b", "#f44336", "#e67e22", "#d35400", "#f39c12", "#ff9800", "#ff5722", "#ffc107", "#f1c40f", "#ffeb3b", "#9b59b6", "#8e44ad", "#9c27b0", "#673ab7", "#e91e63", "#3f51b5", "#795548", "#9e9e9e", "#607d8b", "#7f8c8d", "#95a5a6", "#bdc3c7", "#ecf0f1", "#efefef"]);

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.doc_count; });

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var citys = results.aggregations[2].buckets;
	citys.forEach(function(city) {
		city.doc_count = +city.doc_count;
	});

	var g = svg.selectAll(".arc")
		.data(pie(citys))
		.enter().append("g")
		.attr("class", "arc");

	g.append("path")
		.attr("d", arc)
		.style("fill", function(city) { return color(city.data.key); });

	g.append("text")
		.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.style("text-anchor", "middle")
		.text(function(d) { return d.data.key; });

});