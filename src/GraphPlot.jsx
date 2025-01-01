import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Link } from "react-router-dom";

const GraphPlot = () => {
  // Sample static data for multiple companies
  const data = [
    {
      company: "Company A",
      compensationData: [
        { year: 2020, compensation: 10 },
        { year: 2021, compensation: 12 },
        { year: 2022, compensation: 15 }
      ]
    },
    {
      company: "Company B",
      compensationData: [
        { year: 2020, compensation: 8 },
        { year: 2021, compensation: 10 },
        { year: 2022, compensation: 7 }
      ]
    }
  ];

  return (
    <div>
      <h2>Yearly Compensation Graph</h2>
      {data.map((companyData, index) => (
        <CompanyGraph key={index} companyData={companyData} />
      ))}
      <Link to="/">
        <button style={{ marginTop: "20px" }}>Back to Main</button>
      </Link>
    </div>
  );
};

// Separate component for each company's graph
const CompanyGraph = ({ companyData }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f4f4f4")
      .style("margin-top", "20px");

    svg.selectAll("*").remove(); // Clear previous drawings

    // Define x and y scales
    const xScale = d3.scaleBand()
      .domain(companyData.compensationData.map(d => d.year))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(companyData.compensationData, d => d.compensation) + 2])
      .range([height - margin.bottom, margin.top]);

    // Draw bars
    svg.selectAll(".bar")
      .data(companyData.compensationData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.year))
      .attr("y", d => yScale(d.compensation))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - margin.bottom - yScale(d.compensation))
      .attr("fill", "steelblue");

    // Add labels for compensation value
    svg.selectAll(".label")
      .data(companyData.compensationData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => xScale(d.year) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.compensation) - 5)
      .attr("text-anchor", "middle")
      .text(d => `${d.compensation} LPA`);

    // Add x-axis
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    // Add y-axis
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

  }, [companyData]);

  return (
    <div>
      <h3>{companyData.company}</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GraphPlot;
