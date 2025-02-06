import * as d3 from "d3";
import { useEffect, useRef } from 'react';


export function Chart({ data }) {
  const marginLeft = 200;
  const width = 800;
  const height = 500;
  const marginRight = 40;
  const marginTop = 20;
  const marginBottom = 40;

  const heightBound = height - marginTop - marginBottom;
  const widthBound = width - marginLeft - marginRight;

  // Define top 10 countries by land area with their land areas in km²
  const topCountries = [
    { name: "Russian Federation", code: "RUS", landrea: 17098242 },
    { name: "Canada", code: "CAN", landarea: 9984670 },
    { name: "United States", code: "USA", landarea: 9596960 },
    { name: "China", code: "CHN", landarea: 9596960 },
    { name: "Brazil", code: "BRA", landarea: 85110346 },
    { name: "Australia", code: "AUS", landarea: 7741220 },
    { name: "India", code: "IND", landarea: 3287263 },
    { name: "Argentina", code: "ARG", landarea: 2780400 },
    { name: "Kazakhstan", code: "KAZ", landarea: 2724910 },
    { name: "Algeria", code: "DZA", landarea: 2381741 }
  ];

  // Process data
  const processedData = topCountries.map(country => {
      const countryData = data.find(d => d["Country Code"] === country.code);
      return {
          country: country.name,
          start: countryData ? Math.round(+countryData["2016"] || 0) : 0,
          end: countryData ? Math.round(+countryData["2022"] || 0) : 0
      };
  });

  console.log('Data :', processedData);

  // Scales
  const maxX = d3.max(processedData, d => Math.max(d.start, d.end))+ 5;

  const xScale = d3.scaleLinear()
      .domain([0, maxX])
      .range([0, widthBound]);

  const yScale = d3.scaleBand()
      .domain(topCountries.map((d) => d.name))
      .range([0, heightBound])
      .padding(0.6);

  // Generate X ticks
  const xTicks = xScale.ticks(10).map(tick => (
      <g key={tick} transform={`translate(${marginLeft + xScale(tick)},${marginTop + heightBound})`}>
          <line y2="6" stroke="black" />
          <text dy="2em" textAnchor="middle" fontSize="12">
              {tick}%
          </text>
      </g>
  ));

  // Generate Y ticks
  const yTicks = yScale.domain().map(tick => (
      <g key={tick} transform={`translate(${marginLeft},${marginTop + yScale(tick) + yScale.bandwidth()/2})`}>
          <line x2="-6" stroke="black" />
          <text dx="-10" dy="0.3em" textAnchor="end" fontSize="12">
              {tick}
          </text>
      </g>
  ));

  // Generate gridlines
  const gridLines = xScale.ticks(10).map(tick => (
      <line
          key={tick}
          x1={marginLeft + xScale(tick)}
          x2={marginLeft + xScale(tick)}
          y1={marginTop}
          y2={marginTop + heightBound}
          stroke="#e0e0e0"
          strokeWidth={0.5}
      />
  ));

  return (
      <div>
          <h4 style={{ 
                textAlign: 'left',
                marginLeft: marginLeft
          }}>
              Change in Terrestrial and Marine Protected Areas (2016-2022)
          </h4>
          <p style={{
              textAlign: 'left',
              marginLeft: marginLeft,
              marginBottom: '20px'
          }}>
              Top 10 Countries in Land Area
          </p>
          <svg width={width} height={height}>
              {/* Gridlines */}
              {gridLines}

              {/* Lines and Diamonds */}
              {processedData.map((d, i) => (
                  <g key={i}>
                      {/* Connecting line */}
                      <line
                          x1={marginLeft + xScale(d.start)}
                          x2={marginLeft + xScale(d.end)}
                          y1={marginTop + yScale(d.country) + yScale.bandwidth()/2}
                          y2={marginTop + yScale(d.country) + yScale.bandwidth()/2}
                          stroke="#00AFB5"
                          strokeWidth={yScale.bandwidth()/10}
                          opacity={0.2}
                      />
                      {/* 2016 diamond */}
                      <path
                          d={d3.symbol().type(d3.symbolDiamond).size(50)()}
                          transform={`translate(${marginLeft + xScale(d.start)},
                            ${marginTop + yScale(d.country) + yScale.bandwidth()/2})`}
                          fill="#00AFB5"
                          opacity={0.4}
                      />
                      {/* 2022 diamond */}
                      <path
                          d={d3.symbol().type(d3.symbolDiamond).size(100)()}
                          transform={`translate(${marginLeft + xScale(d.end)},
                          ${marginTop + yScale(d.country) + yScale.bandwidth()/2})`}
                          fill="#00AFB5"
                      />
                  </g>
              ))}

              {/* X - Axis */}
              <line
                x1={marginLeft}
                x2={marginLeft + widthBound}
                y1={marginTop + heightBound}
                y2={marginTop + heightBound}
                stroke="black"
              />
              {xTicks}

              {/* Y - Axis */}
              <line
                x1={marginLeft}
                x2={marginLeft}
                y1={marginTop}
                y2={marginTop + heightBound}
                stroke="black"
              />
              {yTicks}

              {/* Legend */}
              <g transform={`translate(${marginLeft + widthBound - 50},${marginTop})`}>
                  <path
                      d={d3.symbol().type(d3.symbolDiamond).size(50)()}
                      fill="#00AFB5"
                      opacity={0.4}
                  />
                  <text x={15} y={5}>2016</text>
                  <path
                      d={d3.symbol().type(d3.symbolDiamond).size(100)()}
                      transform="translate(0,25)"
                      fill="#00AFB5"
                  />
                  <text x={15} y={30}>2022</text>
              </g>
          </svg>
      </div>
  );
}

export default Chart;