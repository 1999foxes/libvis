import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as api from '../api';
import { useD3 } from './d3Utils';


class D3PopularityHeatmap {
    constructor(svg, data, config) {
        console.log("chart init", data, config);
        this.data = data;
        this.config = config;

        this.svg = d3.select(svg);
        this.axisX = this.svg.append('g');
        this.axisY = this.svg.append('g');
        this.path = this.svg.append('path');
    }
    
    update(data=this.data, config=this.config) {
        console.log("chart update", data, config);
        if (this.data == null) {
            return;
        }

        this.data = data;
        this.config = config;

        const column = 'popularity';

        const height = config.height || 480;
        const width = config.width || 800;
        const margin = config.margin || ({ top: 30, right: 30, bottom: 30, left: 30 });
        const color = d3.scaleSequential()
            .interpolator(d3.interpolateOranges)
            .domain([d3.min(data.map(d => d[column])), d3.max(data.map(d => d[column]))]);


        this.svg.attr('viewBox', [0, 0, width, height]);

        const x = d3.scaleBand()
            .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleBand()
            .domain([2013, 2014, 2015, 2016, 2017, 2018])
            .range([height - margin.bottom, margin.top]);
        
        this.svg.selectAll()
            .data(data, d => d[column])
            .enter()
            .append("rect")
                .attr("x", d => x(d.month))
                .attr("y", d => y(d.year))
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", d => color(d[column]))
                .style("stroke-width", 4)
                .style("stroke", "none")
                .style("opacity", 0.8)
                .on('mouseover', (e, d) => {
                    console.log(d);
                });

        // this.axisX.selectAll('*').remove();
        // this.axisX.attr('transform', 'translate(' + 0 + ' ' + (height - margin.bottom) + ')')
        //     .call(d3.axisBottom(x));

        // this.axisY.selectAll('*').remove();
        // this.axisY.attr('transform', 'translate(' + margin.left + ' ' + 0 + ')')
        //     .call(d3.axisLeft(y));
    }
}


async function getData(bookid) {
    const data = await api.getMonthlyPopularity(bookid);
    for (const d of data) {
        d.year = Math.floor(d.month / 100);
        d.month = d.month % 100;
    }
    console.log(data);
    data.columns=['year', 'month', 'popularity'];
    for (const year of [2013, 2014, 2015, 2016, 2017, 2018]) {
        for (const month of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
            let flag = false;
            for (const d of data) {
                if (d.year === year && d.month === month) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                data.push({year, month, popularity: 0});
            }
        }
    }
    return data;
}


const PopularityHeatmap = ({ bookid }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        getData(bookid).then(d => setData(d));
    }, [bookid]);

    const svgRef = useD3(D3PopularityHeatmap, data, {});

    return (
        <svg ref={svgRef} />
    )
}

export default PopularityHeatmap;