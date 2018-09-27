import 'intersection-observer';
import * as d3 from 'd3';
import * as d3tooltip from 'd3-tooltip';
import * as topojson from "topojson";

import places from '../sources/places.json';
import mn from '../sources/tracts.json';
import mncounties from '../sources/counties.json';

class Map {

    constructor(target) {
        this.target = target;
        this.svg = d3.select(target + " svg").attr("width", $(target).outerWidth()).attr("height", $(target).outerHeight());
        this.g = this.svg.append("g");
        this.zoomed = false;
        //   this.scaled = $(target).width()/520;
        this.colorScale = d3.scaleLinear()
            .domain([0, 65, 79, 81, 82, 85, 92])
            .range(['#822010','#C2421F',"#E07242",'#F2D2A4','#C7E5B5','#299E3D','#299E3D']);
        // this.colorScale = d3.scaleOrdinal()
        //     .domain(["high", "above", "average", "below", "low"])
        //     .range(['#0D4673', '#3580A3', '#969696', '#E07242', '#C2421F']);
        this.povertyScale = d3.scaleLinear()
            .domain([0, 22, 44])
            .range(['#ffffff',"#999999",'#333333']);
    }

    /********** PRIVATE METHODS **********/

    // Detect if the viewport is mobile or desktop, can be tweaked if necessary for anything in between
    _detect_mobile() {
        var winsize = $(window).width();

        if (winsize < 600) {
            return true;
        } else {
            return false;
        }
    }

    _clickmn(district) {
        //D3 CLICKY MAP BINDINGS
        jQuery.fn.d3Click = function() {
            this.each(function(i, e) {
                var evt = document.createEvent('MouseEvents');
                evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

                e.dispatchEvent(evt);
                return false;
            });
        };

        jQuery.fn.d3Down = function() {
            this.each(function(i, e) {
                var evt = document.createEvent('MouseEvents');
                evt.initMouseEvent('mousedown', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

                e.dispatchEvent(evt);
                return false;
            });
        };

        jQuery.fn.d3Up = function() {
            this.each(function(i, e) {
                var evt = document.createEvent('MouseEvents');
                evt.initMouseEvent('mouseup', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

                e.dispatchEvent(evt);
                return false;
            });
        };


        // Your mouse clicks are actually three events, which are simulated here to auto-zoom the map on a given id of a map path object
        $("[id='" + district + "']").d3Down();
        $("[id='" + district + "']").d3Up();
        $("[id='" + district + "']").d3Click();

    }

    /********** PUBLIC METHODS **********/

    // Render the map
    render(district,geo,zoom) {
        var self = this;

        var projection = d3.geoAlbers().scale(5037).translate([50, 970]);

        var width = $(self.target).outerWidth();
        var height = $(self.target).outerHeight();
        var centered;

        var path = d3.geoPath(projection);

        //   var states = topojson.feature(us, us.objects.convert);

        //   var b = path.bounds(state),
        //   s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        //   t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

        //   if (magnify=="metro") {
        //     projection
        //     .scale(s)
        //     .translate(t);
        //   }

        var svg = d3.select(self.target + " svg").attr("width", width).attr("height", height);
        var g = svg.append("g");
        var tooltip = d3tooltip(d3);

        // self._render_legend();

        // Only fire resize events in the event of a width change because it prevents
        // an awful mobile Safari bug and developer rage blackouts.
        // https://stackoverflow.com/questions/9361968/javascript-resize-event-on-scroll-mobile
        var cachedWidth = window.innerWidth;
        d3.select(window).on("resize", function() {
            var newWidth = window.innerWidth;
            if (newWidth !== cachedWidth) {
                cachedWidth = newWidth;
            }
        });

        //City labels
        var marks = [{
                long: -93.266667,
                lat: 44.983333,
                name: "Minneapolis"
            },
            {
                long: -92.100485,
                lat: 46.786672,
                name: "Duluth"
            },
            {
                long: -95.918889,
                lat: 45.591944,
                name: "Morris"
            },
            {
                long: -93.999400,
                lat: 44.163578,
                name: "Mankato"
            },
            {
                long: -92.480199,
                lat: 44.012122,
                name: "Rochester"
            },
            {
                long: -94.882686,
                lat: 47.471573,
                name: "Bemidji"
            },
            {
                long: -94.202008,
                lat: 46.352673,
                name: "Brainerd"
            },
            {
                long: -96.767804,
                lat: 46.873765,
                name: "Moorhead"
            },
            {
                long: -92.5338,
                lat: 44.5625,
                name: "Red Wing"
            },
            {
                long: -94.1642,
                lat: 45.5616,
                name: "St. Cloud"
            },
            {
                long: -95.7884,
                lat: 44.4469,
                name: "Marshall"
            }
        ];
        //Draw Census tracts
        self.g.append('g')
            .attr('class', 'tracts')
            .selectAll('path')
            .data(topojson.feature(mn, mn.objects.convert).features)
            .enter().append('path')
            .attr('d', path)
            .attr('class', function(d) {
                if (geo == "met") { 
                    if (d.properties.lifex_region == "metro") { return "tract"; }
                    else { return "blanked"; }
                }
                return 'tract';
            })
            .attr('id', function(d) {
                return 'P' + d.properties.tract_id + geo;
            })
            .style('stroke-width', '0')
            .style('fill', function(d) {
                if (d.properties.lifex_e0 != null) {
                    if (geo != "poverty") { return self.colorScale(d.properties.lifex_e0); }
                    else { return self.povertyScale(d.properties.lifex_poverty); }
                }
                else { return "#ffffff"; }
            });

        //Draw place borders
        self.g.append('g')
            .attr('class', 'places')
            .selectAll('path')
            .data(topojson.feature(places, places.objects.convert).features)
            .enter().append('path')
            .attr("class", "place")
            .attr('class', function(d) {
                // if (geo == "tc") { 
                //     if (d.properties.NAME == "Minneapolis" || d.properties.NAME == "St. Paul") { return "place"; }
                //     else { return "blanked"; }
                // }
                return 'place';
            })
            .attr("id", function(d) {
                return "P" + d.properties.GEOID + geo;
            })
            .attr('d', path)
            .on('click', function(d) {
                clicked(d, zoom);
            })
            .attr('fill-opacity', 0)
            .attr('stroke-width', '0.3px')
            .on("mouseover", function(d) {
                if (geo == "met") {
                tooltip.html(d.properties.NAME);
                $(".d3-tooltip").show();
                tooltip.show();
                }
            })
            .on("mouseout", function(d) {
                if (geo == "met") {
                    tooltip.hide()
                }
            });

            $("svg").mouseleave(function() {
                $(".d3-tooltip").hide();
              });

        //Draw county borders
        self.g.append('g')
            .attr('class', 'counties')
            .selectAll('path')
            .data(topojson.feature(mncounties, mncounties.objects.counties).features)
            .enter().append('path')
            .attr("class", "county")
            .attr('d', path)
            .on('click', function(d) {
                clicked(d, zoom);
            })
            .attr('fill-opacity', 0)
            .attr('stroke-width', '2px')
            .on("mouseover", function(d) {
                if (geo == "mn") {
                    tooltip.html(d.properties.COUNTYNAME);
                    $(".d3-tooltip").show();
                    tooltip.show();
                }
            })
            .on("mouseout", function(d) {
                if (geo == "mn") {
                    tooltip.hide()
                }
            });

        // //Draw city labels
        // self.svg.selectAll("circle")
        // .data(marks)
        // .enter()
        // .append("circle")
        // .attr('class', 'mark')
        // .attr('width', 3)
        // .attr('height', 3)
        // .attr("r", "1.3px")
        // .attr("fill", "#333")
        // .attr("transform", function(d) {
        //     return "translate(" + projection([d.long, d.lat]) + ")";
        // });

        // self.g.selectAll("text")
        // .data(marks)
        // .enter()
        // .append("text")
        // .attr('class', 'city-label')
        // .attr("transform", function(d) {
        //     return "translate(" + projection([d.long + 0.05, d.lat - 0.03]) + ")";
        // })
        // .text(function(d) {
        //     return " " + d.name;
        // });

        function clicked(d, k) {
            var x, y, stroke;

            // if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            centered = d;
            stroke = 0.2;
            $(self.target + ' .reset').show();
            // } 
            // else {
            //   x = width / 2;
            //   y = height / 2;
            //   k = 1;
            //   centered = null;
            //   stroke = 1.5;
            //   $(self.target + ' .reset').hide();
            // }

            // $(".city-label").addClass("hidden");
            // $(".mark").addClass("hidden");

            self.g.transition()
                .duration(300)
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
                .style('stroke-width', '0.2px');


            $('.reset').on('click touch', function(event) {
                x = width / 2;
                y = height / 2;
                k = 1;
                centered = null;
                $(this).hide();
                stroke = 1.5;
                d3.select("#mapper svg g").transition()
                    .duration(300)
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
                    .style('stroke-width', stroke / k + 'px');
                event.stopPropagation();
            });

        }

        self._clickmn(district + geo);

          var aspect = 520 / 600, chart = $(self.target + " svg");
            var targetWidth = chart.parent().width();
            chart.attr("width", targetWidth);
            chart.attr("height", targetWidth / aspect);
            if ($(window).width() <= 600) { $(self.target + " svg").attr("viewBox","0 0 500 600"); }

          $(window).on("resize", function() {
            targetWidth = chart.parent().width();
            chart.attr("width", targetWidth);
            chart.attr("height", targetWidth / aspect);
          });
    }
}

export {
    Map as
    default
}