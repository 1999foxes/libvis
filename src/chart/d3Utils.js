import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';


const useD3 = (chartType, data, config) => {
    const svgRef = useRef();
    const chartRef = useRef();
    useEffect(
        () => {
            if (chartRef.current === undefined) {
                chartRef.current = new chartType(svgRef.current, data, config);
            } else {
                chartRef.current.update(data, config)
            }
        },
        [svgRef, data, config]
    );
    return svgRef;
}

class D3ChartTest {
    constructor(svg, data, config) {
        console.log("chart init", data, config);
        this.svg = d3.select(svg);
        this.data = data;
        this.config = config;
        this.svg.append('p').text('init: ' + Object.entries(config));
    }
    
    update(data=this.data, config=this.config) {
        console.log("chart update", data, config);
        this.svg.append('p').text('update: ' + Object.entries(config));
    }
}

const ChartTest = () => {
    const svgRef = useD3(D3ChartTest, [], {});
    return <div ref={svgRef} />;
}

export { useD3, ChartTest };
