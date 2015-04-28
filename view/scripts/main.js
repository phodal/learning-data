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
	body: {
		query: {
			query_string: {
				query: "*"
			}
		},
		aggs: {
			2: {
				terms: {
					field: "location",
					size: 100,
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
});