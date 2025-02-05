import * as d3 from "d3";
import { useEffect, useRef } from 'react';

export function Chart({ data }) {
    const svgRef = useRef(null);
    
    // Constants for the visualization
    const marginLeft = 200;
    const width = 800;
    const height = 600;
    const marginRight = 40;
    const marginTop = 20;
    const marginBottom = 20;
    const heightBound = height - marginTop - marginBottom;
    const widthBound = width - marginLeft - marginRight;

    useEffect(() => {
      if (!data) return;

      // Define top 10 countries by land area
      const topCountries = [
          { name: "Russian Federation", code: "RUS" },
          { name: "Canada", code: "CAN" },
          { name: "United States", code: "USA" },
          { name: "China", code: "CHN" },
          { name: "Brazil", code: "BRA" },
          { name: "Australia", code: "AUS" },
          { name: "India", code: "IND" },
          { name: "Argentina", code: "ARG" },
          { name: "Kazakhstan", code: "KAZ" },
          { name: "Algeria", code: "DZA" }
      ];

      // Process data to get rounded percentage values for 2016 and 2022 for top 10 land countries
      const processedData = topCountries.map(country => {
          const countryData = data.find(d => d["Country Code"] === country.code);
          return {
              country: country.name,
              start: countryData ? Math.round(+countryData["2016"] || 0) : 0,
              end: countryData ? Math.round(+countryData["2022"] || 0) : 0
          };
      });

      // Clear previous content
      d3.select(svgRef.current).selectAll("*").remove();

      // Create SVG
      const svg = d3.select(svgRef.current)
          .append("g")
          .attr("transform", `translate(${marginLeft}, ${marginTop})`);

      // Create scales
      const xScale = d3.scaleLinear()
          .domain([0, 40])  // 0% to 40%, Values aren't higher than 35%
          .range([0, widthBound]);

      const yScale = d3.scaleBand()
          .domain(topCountries.map(d => d.name))
          .range([0, heightBound])
          .padding(0.1);

      // Add vertical gridlines
      svg.append("g")
          .attr("class", "grid")
          .selectAll("line")
          .data(xScale.ticks(10))
          .join("line")
          .attr("x1", d => xScale(d))
          .attr("x2", d => xScale(d))
          .attr("y1", 0)
          .attr("y2", heightBound)
          .style("stroke", "#e0e0e0")
          .style("stroke-width", 0.5);

      // Add X axis
      svg.append("g")
          .attr("transform", `translate(0,${heightBound})`)
          .call(d3.axisBottom(xScale)
              .ticks(10)
              .tickFormat(d => d + "%"));

      // Add Y axis
      svg.append("g")
          .call(d3.axisLeft(yScale));

      // Add connecting bars and diamonds
      processedData.forEach(d => {
          const y = yScale(d.country);
          const barHeight = yScale.bandwidth();

          // Connecting bar
          svg.append("line")
              .attr("x1", xScale(d.start))
              .attr("x2", xScale(d.end))
              .attr("y1", y + barHeight/2)  // Center of the band
              .attr("y2", y + barHeight/2)  // Center of the band
              .style("stroke", "#ef4444")
              .style("opacity", 0.2)
              .style("stroke-width", barHeight/10);  // Make the line thinner than the full band

          // 2016 diamond
          svg.append("path")
              .attr("d", d3.symbol().type(d3.symbolDiamond).size(50))
              .attr("transform", `translate(${xScale(d.start)},${y + barHeight/2})`)
              .style("fill", "#ef4444")
              .style("opacity", 0.4);

          // 2022 diamond
          svg.append("path")
              .attr("d", d3.symbol().type(d3.symbolDiamond).size(100))
              .attr("transform", `translate(${xScale(d.end)},${y + barHeight/2})`)
              .style("fill", "#ef4444");
      });

      // Add legend
      const legend = svg.append("g")
          .attr("transform", `translate(${widthBound - 100}, 0)`);

      // 2016 legend item
      legend.append("path")
          .attr("d", d3.symbol().type(d3.symbolDiamond).size(50))
          .style("fill", "#ef4444")
          .style("opacity", 0.4);

      legend.append("text")
          .attr("x", 15)
          .attr("y", 5)
          .text("2016");

      // 2022 legend item
      legend.append("path")
          .attr("d", d3.symbol().type(d3.symbolDiamond).size(100))
          .attr("transform", "translate(0,25)")
          .style("fill", "#ef4444");

      legend.append("text")
          .attr("x", 15)
          .attr("y", 30)
          .text("2022");

  }, [data]);

  return (
        <div>
            <h3 style={{ 
                textAlign: 'center', 
                marginBottom: '20px'  // Adds space between title and SVG
            }}>
                Terrestrial and Marine Protected Areas (2016-2022)
            </h3>
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
  );
}

export default Chart;