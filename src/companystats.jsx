import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const CompanyStats = () => {
  const chartRefs = useRef([]);
  const charts = useRef([]);

  // State for selected company
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [statsData, setStatsData] = useState([]);

  // Fetch stats data from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/company-stats")
      .then((response) => response.json())
      .then((data) => setStatsData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Unique companies
  const companies = ["All", ...new Set(statsData.map((d) => d.company.name))];

  // Clear previous charts
  const clearCharts = () => {
    charts.current.forEach((chart) => chart.destroy());
    charts.current = [];
  };

  // Draw charts
  const drawCharts = (filteredData) => {
    clearCharts();

    const companiesToShow =
      selectedCompany === "All"
        ? [...new Set(filteredData.map((d) => d.company.name))]
        : [selectedCompany];

    companiesToShow.forEach((company, index) => {
      const companyData = filteredData.filter((d) => d.company.name === company);

      // Hire Rate Chart
      const hireCtx = chartRefs.current[index * 2].getContext("2d");
      const hireChart = new Chart(hireCtx, {
        type: "bar",
        data: {
          labels: companyData.map((d) => d.year),
          datasets: [
            {
              label: `${company} - Students Hired`,
              data: companyData.map((d) => d.hired),
              backgroundColor: "rgba(54, 162, 235, 0.7)",
            },
          ],
        },
      });
      charts.current.push(hireChart);

      // Salary Chart
      const salaryCtx = chartRefs.current[index * 2 + 1].getContext("2d");
      const salaryChart = new Chart(salaryCtx, {
        type: "bar",
        data: {
          labels: companyData.map((d) => d.year),
          datasets: [
            {
              label: `${company} - Amount Paid ($)`,
              data: companyData.map((d) => d.amountPaid),
              backgroundColor: "rgba(75, 192, 192, 0.7)",
            },
          ],
        },
      });
      charts.current.push(salaryChart);
    });
  };

  // Filtered Data
  const filteredData = statsData.filter((d) => {
    return selectedCompany === "All" || d.company.name === selectedCompany;
  });

  // Redraw charts on filter change
  useEffect(() => {
    if (statsData.length > 0) {
      drawCharts(filteredData);
    }
  }, [selectedCompany, statsData]);

  return (
    <div style={{ width: '1200px', height: '800px' }}>
      <h2>Company Statistics</h2>

      {/* Filters */}
      <div>
        <label>
          Select Company:
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Dynamic Graphs */}
      <div>
        {selectedCompany === "All" ? (
          companies
            .filter((c) => c !== "All")
            .map((company, index) => (
              <div
                key={company}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "30px",
                }}
              >
                <div style={{ flex: "1", marginRight: "10px" }}>
                  <h3>{company} - Hire Rate</h3>
                  <canvas
                    ref={(el) => (chartRefs.current[index * 2] = el)}
                  ></canvas>
                </div>
                <div style={{ flex: "1" }}>
                  <h3>{company} - Salary Stats</h3>
                  <canvas
                    ref={(el) => (chartRefs.current[index * 2 + 1] = el)}
                  ></canvas>
                </div>
              </div>
            ))
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: "1", marginRight: "10px" }}>
              <h3>Hire Rate</h3>
              <canvas ref={(el) => (chartRefs.current[0] = el)}></canvas>
            </div>
            <div style={{ flex: "1" }}>
              <h3>Salary Stats</h3>
              <canvas ref={(el) => (chartRefs.current[1] = el)}></canvas>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyStats;
