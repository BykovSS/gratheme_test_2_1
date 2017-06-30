'use strict';

window.addEventListener('load', function () {

	var br_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var br_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	br_height = br_height - document.getElementsByTagName('h3')[0].offsetHeight - document.getElementsByTagName('p')[0].offsetHeight;
	var koef = 1;
	var koord_poly = [];
	var obj = document.getElementById('circle');
	var points = [0, 1];
	document.getElementsByTagName('svg')[0].setAttribute('viewBox', '0, 0, ' + (br_width - 17) + ', ' + (br_height - 17));
	var count = Math.round(Math.random() * 7 + 3);
	for (var i = 0; i < count; i++) {
		if (i == 0) {
			koord_poly[i] = { width: Math.random() * (br_width * 0.1) + br_width * 0.1, height: br_height * 0.5 };
		} else if (i == 1) {
			koord_poly[i] = { width: Math.random() * (br_width * 0.8) + br_width * 0.1, height: Math.random() * (br_height * 0.8) + br_height * 0.1 };
		} else {
			do {
				koord_poly[i] = { width: Math.random() * (br_width * 0.8) + br_width * 0.1, height: Math.random() * (br_height * 0.8) + br_height * 0.1 };
			} while (((koord_poly[i - 2].width - koord_poly[i - 1].width) * (koord_poly[i].width - koord_poly[i - 1].width) + (koord_poly[i - 2].height - koord_poly[i - 1].height) * (koord_poly[i].height - koord_poly[i - 1].height)) / (Math.sqrt((koord_poly[i - 2].width - koord_poly[i - 1].width) * (koord_poly[i - 2].width - koord_poly[i - 1].width) + (koord_poly[i - 2].height - koord_poly[i - 1].height) * (koord_poly[i - 2].height - koord_poly[i - 1].height)) * Math.sqrt((koord_poly[i].width - koord_poly[i - 1].width) * (koord_poly[i].width - koord_poly[i - 1].width) + (koord_poly[i].height - koord_poly[i - 1].height) * (koord_poly[i].height - koord_poly[i - 1].height))) >= 0);
		}
	}
	var koord_obj = [koord_poly[0].width, koord_poly[0].height];

	function RenderPolyline() {
		var poly = '<polyline points="';
		for (var _i = 0; _i < koord_poly.length; _i++) {
			if (_i == 0) {
				poly += koord_poly[_i].width * koef + ',' + koord_poly[_i].height * koef;
			} else {
				poly += ' ' + koord_poly[_i].width * koef + ',' + koord_poly[_i].height * koef;
			}
		}
		poly += '" style = "fill: none; stroke-width: 3px; stroke: black"/>';
		document.getElementsByTagName('svg')[0].innerHTML = poly;
	}

	function RenderObject() {
		if (document.getElementById('circle')) {
			document.getElementById('circle').parentElement.removeChild(document.getElementsByTagName('circle')[0]);
		}
		var circle = '<circle id="circle" cx="' + koord_obj[0] * koef + '" cy="' + koord_obj[1] * koef + '" r="' + 40 * koef + '" fill="blue" stroke-width="5"; stroke="red" />';
		document.getElementsByTagName('svg')[0].innerHTML += circle;

		obj = document.getElementById('circle');
		var koord_start = void 0;
		var koord_obj_x = void 0,
		    koord_obj_y = void 0;
		var dist = void 0;
		var touchobj = void 0;

		obj.addEventListener('touchstart', function (event) {
			touchobj = event.changedTouches[0];
			koord_start = [parseInt(touchobj.clientX), parseInt(touchobj.clientY)];
			koord_obj_x = koord_obj[0];
			koord_obj_y = koord_obj[1];
			event.preventDefault();
		});

		obj.addEventListener('touchmove', function (event) {
			touchobj = event.changedTouches[0];
			dist = [parseInt(touchobj.clientX) - koord_start[0], parseInt(touchobj.clientY) - koord_start[1]];

			var k = (koord_poly[points[0]].height - koord_poly[points[1]].height) / (koord_poly[points[0]].width - koord_poly[points[1]].width);
			var n = koord_poly[points[0]].height - k * koord_poly[points[0]].width;

			if (k >= -1 && k <= 1) {
				if (koord_poly[points[1]].width >= koord_poly[points[0]].width && koord_obj_x + dist[0] <= koord_poly[points[0]].width || koord_poly[points[0]].width > koord_poly[points[1]].width && koord_obj_x + dist[0] >= koord_poly[points[0]].width) {
					koord_obj_x = koord_poly[points[0]].width - dist[0];
					ChangePoints(false);
				}
				if (koord_poly[points[1]].width >= koord_poly[points[0]].width && koord_obj_x + dist[0] > koord_poly[points[1]].width || koord_poly[points[0]].width > koord_poly[points[1]].width && koord_obj_x + dist[0] < koord_poly[points[1]].width) {
					koord_obj_x = koord_poly[points[1]].width - dist[0];
					ChangePoints(true);
				}
				koord_obj = [koord_obj_x + dist[0], k * (koord_obj_x + dist[0]) + n];
			} else {
				if (koord_poly[points[1]].height >= koord_poly[points[0]].height && koord_obj_y + dist[1] <= koord_poly[points[0]].height || koord_poly[points[0]].height > koord_poly[points[1]].height && koord_obj_y + dist[1] >= koord_poly[points[0]].height) {
					koord_obj_y = koord_poly[points[0]].height - dist[1];
					ChangePoints(false);
				}
				if (koord_poly[points[1]].height >= koord_poly[points[0]].height && koord_obj_y + dist[1] > koord_poly[points[1]].height || koord_poly[points[0]].height > koord_poly[points[1]].height && koord_obj_y + dist[1] < koord_poly[points[1]].height) {
					koord_obj_y = koord_poly[points[1]].height - dist[1];
					ChangePoints(true);
				}
				koord_obj = [(koord_obj_y + dist[1] - n) / k, koord_obj_y + dist[1]];
			}

			RenderObject();
			event.preventDefault();
		});

		function ChangePoints(forward) {
			if (forward) {
				if (points[1] >= count - 1) {
					points[1] = count - 1;
				} else {
					points[0]++;
					points[1]++;
				}
			} else {
				if (points[0] <= 0) {
					points[0] = 0;
				} else {
					points[0]--;
					points[1]--;
				}
			}
		}
	}

	RenderPolyline();
	RenderObject();

	window.addEventListener('resize', function () {
		var br_width_n = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var br_height_n = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		br_height_n = br_height_n - document.getElementsByTagName('h3')[0].offsetHeight - document.getElementsByTagName('p')[0].offsetHeight;
		koef = Math.min(br_width_n / br_width, br_height_n / br_height);
		document.getElementsByTagName('svg')[0].setAttribute('viewBox', '0, 0, ' + (br_width_n - 17) + ', ' + (br_height_n - 17));
		RenderPolyline();
		RenderObject();
	});
});