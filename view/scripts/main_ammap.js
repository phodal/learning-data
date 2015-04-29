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
					field: "country",
					size: 200,
					order: {
						_count: "desc"
					}
				}
			}
		}
	}
};

$(document).ready(function () {
	$.ajax({
		type: "GET",
		url: "country.json",
		success: function (data) {
			generate_info(data)
		}
	});
});

var generate_info = function(data){
	var mapDatas = [];
	client.search(query).then(function (results) {
		$.each(results.aggregations[2].buckets, function(index, bucket){
			var mapData;
			$.each(data, function(index, country){
				if(country.name.toLowerCase() === bucket.key) {
					mapData = {
						code: country.code,
						name: country.name,
						value: bucket.doc_count,
						color: "#eea638"
					};
				}
			});
			if(mapData !== undefined){
				mapDatas.push(mapData);
			}
		});
		create_map(mapDatas);
	});
};

var create_map = function(mapData){
	var map;
	var minBulletSize = 3;
	var maxBulletSize = 70;
	var min = Infinity;
	var max = -Infinity;

	AmCharts.theme = AmCharts.themes.black;

	for (var i = 0; i < mapData.length; i++) {
		var value = mapData[i].value;
		if (value < min) {
			min = value;
		}
		if (value > max) {
			max = value;
		}
	}

	map = new AmCharts.AmMap();
	map.pathToImages = "bower_components/ammap/dist/ammap/images/";

	map.addTitle("Website traffic Map", 14);
	map.addTitle("source: nginx access log", 11);
	map.areasSettings = {
		unlistedAreasColor: "#FFFFFF",
		unlistedAreasAlpha: 0.1
	};
	map.imagesSettings = {
		balloonText: "<span style='font-size:14px;'><b>[[title]]</b>: [[value]]</span>",
		alpha: 0.6
	};

	var dataProvider = {
		mapVar: AmCharts.maps.worldLow,
		images: []
	};

	var maxSquare = maxBulletSize * maxBulletSize * 2 * Math.PI;
	var minSquare = minBulletSize * minBulletSize * 2 * Math.PI;

	for (var i = 0; i < mapData.length; i++) {
		var dataItem = mapData[i];
		var value = dataItem.value;
		// calculate size of a bubble
		var square = (value - min) / (max - min) * (maxSquare - minSquare) + minSquare;
		if (square < minSquare) {
			square = minSquare;
		}
		var size = Math.sqrt(square / (Math.PI * 2));
		var id = dataItem.code;

		dataProvider.images.push({
			type: "circle",
			width: size,
			height: size,
			color: dataItem.color,
			longitude: latlong[id].longitude,
			latitude: latlong[id].latitude,
			title: dataItem.name,
			value: value
		});
	}

	map.dataProvider = dataProvider;

	map.write("mapdiv");
};