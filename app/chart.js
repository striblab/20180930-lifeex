import 'intersection-observer';
import * as d3 from 'd3';
import * as c3 from 'c3';

class Chart {

    constructor(target) {
        this.target = target;
    }

    render() {
        var self = this;

        var padding = {
            top: 20,
            right: 60,
            bottom: 20,
            left: 80,
        };

        var chartTrend = c3.generate({
            bindto: self.target,
            padding: padding,
            data: {
                // x: 'x',
                // xFormat: '%Y-%m-%d %H:%M:%S',
                columns: [
                    // ['x', 2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018],
                    // ['Rate',100.4956545,92.80404871,79.66950966,79.59245596,74.20189819,54.17179711,66.22293085,56.95042699,63.470021,50.68743188],
                    ['Above', 0.574,0.615,0.527],
                    ['Average', 0.31,0.259,0.31],
                    ['Below', 0.115,0.124,0.115],
                    // ['Overall', 11515.83991,13377.14567,12756.24707,13601.60424,13888.19082,13524.27212,14352.36736,14428.57475,15773.16337,17192.67048,17998.04109,16765.0647,16035.30335,16800.89983,18188.39822,18978.62705,19245.04336,null,null]
                ],
                type: 'bar',
	            labels: {
	                format: {
	                    'Above': d3.format('.0%'),
	                    'Average': d3.format('.0%'),
	                    'Below': d3.format('.0%')
	                }
	            }
            },
            legend: {
                show: false
            },
            point: {
                show: true,
                r: function(d) { if (d.x == 2017) { return 6;} else { return 2.5; } }
            },
            color: {
                pattern: ['#3580A3', '#969696', '#E07242']
            },
            axis: {
                rotated: true,
                y: {
                    max: 1,
                    min: 0,
                    padding: {
                        bottom: 0,
                        top: 0
                    },
                    tick: {
                        count: 6,
                        values: [0, 0.25, 0.50, 0.75, 1],
                        format: d3.format('.0%')
                    }
                },
                x: {
                    type: 'category',
                    categories: ["Statewide","Metro","Outstate"],
                    padding: {
                        right: 0,
                        left: 0
                    },
                    tick: {
                        count: 3,
                        multiline: false,
                    }
                }
            },
            grid: {
                focus:{
                    show:false
                },
            },
            tooltip: {
                show:false
            }
        });

        d3.selectAll(".c3-target-Above")
        .selectAll(".c3-bar, .c3-texts")
        .attr("transform", "translate(0, -2)");
    
        d3.selectAll(".c3-target-Below")
        .selectAll(".c3-bar, .c3-texts")
        .attr("transform", "translate(0, 2)");

    }

}

export {
    Chart as
    default
}
