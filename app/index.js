/**
 * Main JS file for project.
 */
// Define globals that are added through the js.globals in
// the config.json file, here like this:
// /* global _ */
// Utility functions, such as Pym integration, number formatting,
// and device checking
import utilsFn from './utils.js';

utilsFn({});

import Map from './map.js';
import Chart from './chart.js';

const map = new Map("#mapper");
const map2 = new Map("#mapperMetro");
const map3 = new Map("#mapperPoverty");
const map4 = new Map("#mapperTC");
const chart = new Chart("#regionChart");

$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results != null) {
        return results[1] || 0;
    } else {
        return null;
    }
}

var selected = $.urlParam('chart');

if (selected != null) {
    $(".slide").hide();
    $("#" + selected).show();
}
if (selected == "all") {
    $(".slide").show();
}

map.render(null,"mn",8);
map2.render("P2743000","met",3.5);
map3.render("P2743000","poverty",9);
map4.render("P2720420","tc",16);
chart.render();