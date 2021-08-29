// import React, { useState, useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import * as api from '../api';
// import { useD3 } from './d3Utils';


// class D3PopularityLineChart {
//     constructor(svg, data, config) {
//         console.log("chart init", data, config);
//         this.data = data;
//         this.config = config;

//         this.svg = d3.select(svg);
//         this.axisX = this.svg.append('g');
//         this.axisY = this.svg.append('g');
//         this.path = this.svg.append('path');
//     }
    
//     update(data=this.data, config=this.config) {
//         console.log("chart update", data, config);
//         if (this.data == null) {
//             return;
//         }

//         this.data = data;
//         this.config = config;

//         const height = config.height || 480;
//         const width = config.width || 800;
//         const margin = config.margin || ({ top: 30, right: 30, bottom: 30, left: 30 });
//         const color = config.color || 'steelblue';

//         const column = 'popularity';

//         this.svg.attr('viewBox', [0, 0, width, height]);
        
//         const x = d3.scaleLinear()
//             .domain([d3.min(data.map(d => d.month)), d3.max(data.map(d => d.month))])
//             .range([margin.left, width - margin.right]);

//         const y = d3.scaleLinear()
//             .domain([0, d3.max(data.map(d => d[column]))]).nice()
//             .range([height - margin.bottom, margin.top]);

//         this.path
//             .datum(data)
//             .attr("fill", "none")
//             .attr("stroke", color)
//             .attr("stroke-width", 1.5)
//             .attr("d", d3.line()
//                 .x(d => x(d.month))
//                 .y(d => y(d[column]))
//             );

//         this.axisX.selectAll('*').remove();
//         this.axisX.attr('transform', 'translate(' + 0 + ' ' + (height - margin.bottom) + ')')
//             .call(d3.axisBottom(x));

//         this.axisY.selectAll('*').remove();
//         this.axisY.attr('transform', 'translate(' + margin.left + ' ' + 0 + ')')
//             .call(d3.axisLeft(y));
//     }
// }


// async function getMonthlyPopularityData(book, year) {
//     const data = [];
//     const promises = [];
//     for (let month = 1; month < 13; month++) {
//         const start = year * 10000 + month * 100 + 1;
//         const end = month === 12? year * 10000 + 10101 : start + 100;
//         const dataEntry = {year: year, month: month};
//         promises.push(api.countFrequency(book, start, end).then(res => dataEntry.popularity = res));
//         data.push(dataEntry);
//     }
//     data.columns = ['year', 'month', 'popularity'];
//     for (const promise of promises) {
//         await promise;
//     }
//     return data;
// }


// const PopularityLineChart = ({ book, year }) => {    
//     const [data, setData] = useState([]);
//     useEffect(() => {
//         getMonthlyPopularityData(book, year).then(d => setData(d));
//     }, [book, year]);

//     const svgRef = useD3(D3PopularityLineChart, data, {});

//     return (
//         <svg ref={svgRef} />
//     );
// }
 

// export default PopularityLineChart;
