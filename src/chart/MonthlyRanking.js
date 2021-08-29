import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as api from '../api';
import { useD3 } from './d3Utils';
import { Link } from 'react-router-dom';


class D3PopularityPieChart {
    constructor(svg, data, config) {
        console.log("chart init", data, config);
        this.data = data;
        this.config = config;

        this.svg = d3.select(svg);
        this.pie = this.svg.append('g');
    }

    update(data = this.data, config = this.config) {
        console.log("chart update", data, config);
        if (data == null) {
            return;
        }

        this.data = data;
        this.config = config;

        const column = 'popularity';

        const height = config.height || 480;
        const width = config.width || 480;
        const margin = config.margin || ({ top: 30, right: 30, bottom: 30, left: 30 });
        const radius = Math.min(height - margin.top - margin.bottom,
            width - margin.left - margin.right) / 2;
        this.pie.attr('transform', "translate(" + width / 2 + "," + height / 2 + ")");

        const color = d3.scaleOrdinal()
            .domain(data)
            .range(['#199CA3', '#EEEEEE', '#24E5EF', '#F5EF64']);
        this.svg.attr('viewBox', [0, 0, width, height]);

        const pie = d3.pie()
            .value(d => d[column]);
        const data_ready = pie(data);

        const handlePieMouseover = (e, d) => {
            config.setCategory(d.data);
        }

        this.pie.selectAll('.pie')
            .data(data_ready)
            .enter()
            .append('path')
            .classed('pie', true)
            .attr('d', d3.arc()
                .innerRadius(0.4 * radius)
                .outerRadius(radius)
            )
            .attr('fill', d => color(d))
            .attr("stroke", "#0F0E29")
            .style("stroke-width", "5px")
            .on('mouseover', handlePieMouseover);

        this.pie.selectAll('.pie')
            .transition()
            .duration(100)
            .attr('d', d3.arc()
                .innerRadius(0.4 * radius)
                .outerRadius(1.0 * radius)
            );

        this.pie.selectAll('.pie')
            .select((d, i, n) => {
                if (d.data === config.category) {
                    return n[i];
                } else {
                    return null;
                }
            })
            .transition()
            .duration(100)
            .attr('d', d3.arc()
                .innerRadius(0.5 * radius)
                .outerRadius(1.1 * radius)
            );

    }
}


async function getData(year, month) {
    const data = await api.getClassificationMonthlyPopularity(year, month);
    data.columns = ['month', 'popularity', 'title'];
    data.sort((a, b) => b.popularity - a.popularity);
    const d = { month: data[0].month, popularity: 0, title: '其他', bookid: undefined, exceptBookids: [] };
    for (let i = 8; i < data.length; i++) {
        d.popularity += data[i].popularity;
        d.exceptBookids.push(data[i].bookid);
    }
    data.splice(8, data.length - 8, d);
    return data;
}


const PopularityPieChart = ({ year, month, category, setCategory }) => {
    const [data, setData] = useState([]);
    useEffect(async () => {
        const d = await getData(year, month);
        setData(d);
        if (category === undefined) {
            setCategory(d[0]);
        }
    }, [year, month]);

    const svgRef = useD3(D3PopularityPieChart, data, { category, setCategory });

    return (
        <svg ref={svgRef} />
    )
}


const MonthlyRanking = () => {
    const [year, setYear] = useState(2013);
    const [month, setMonth] = useState(1);
    const [category, setCategory] = useState(undefined);
    const [ranking, setRanking] = useState([]);
    const getRanking = async () => {
        if (category === undefined) {
            return;
        }
        if (category.bookid !== undefined) {
            setRanking(await api.getMonthlyRanking(category.bookid, year, month));
        } else if (category.exceptBookids !== undefined) {
            setRanking(await api.getMonthlyRankingOthers(category.exceptBookids, year, month));
        }
    }

    useEffect(getRanking, [year, month, category])
    return (
        <div>
            <div id='chart'>
                <div id='date'>
                    <div id='year'>
                        <button onClick={() => setYear(year - 1)} disabled={year <= 2013}>{'<'}</button>
                        <p>{year}年</p>
                        <button onClick={() => setYear(year + 1)} disabled={year >= 2018}>{'>'}</button>
                    </div>
                    <div id='month'>
                        <button onClick={() => setMonth(month - 1)} disabled={month <= 1}>{'<'}</button>
                        <p>{month}月</p>
                        <button onClick={() => setMonth(month + 1)} disabled={month >= 12}>{'>'}</button>
                    </div>
                </div>
                <div id='piechart'>
                    <PopularityPieChart year={year} month={month} category={category} setCategory={setCategory} />
                </div>
            </div>
            <div id='ranking'>
                <h3>热书月榜</h3>
                <h2>{category && category.title || null}</h2>
                <ul>
                    {ranking.map(d => (
                        <li key={d.bookid}>
                            <Link to={`/book/${encodeURIComponent(d.bookid)}`}>{d.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

export default MonthlyRanking;