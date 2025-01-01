import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const PlacementStatistics = () => {
    const [data] = useState([
        {
          year: 2022,
          company: "Amazon",
          stats: {
            CS: {
              totalAttended: 15,
              totalPlaced: 10,
              students: [
                { name: "Student 1", placed: true },
                { name: "Student 2", placed: false },
                { name: "Student 3", placed: true },
                { name: "Student 4", placed: true },
                { name: "Student 5", placed: false },
                { name: "Student 6", placed: true },
                { name: "Student 7", placed: false },
                { name: "Student 8", placed: true },
                { name: "Student 9", placed: false },
                { name: "Student 10", placed: true },
              ],
            },
            IT: {
              totalAttended: 8,
              totalPlaced: 5,
              students: [
                { name: "Student 11", placed: true },
                { name: "Student 12", placed: false },
                { name: "Student 13", placed: true },
                { name: "Student 14", placed: false },
                { name: "Student 15", placed: true },
              ],
            },
            EE: {
              totalAttended: 5,
              totalPlaced: 2,
              students: [
                { name: "Student 16", placed: true },
                { name: "Student 17", placed: false },
                { name: "Student 18", placed: true },
                { name: "Student 19", placed: false },
                { name: "Student 20", placed: false },
              ],
            },
          },
        },
        {
          year: 2022,
          company: "Accenture",
          stats: {
            CS: {
              totalAttended: 20,
              totalPlaced: 15,
              students: [
                { name: "Student 21", placed: true },
                { name: "Student 22", placed: false },
                { name: "Student 23", placed: true },
                { name: "Student 24", placed: true },
                { name: "Student 25", placed: false },
                { name: "Student 26", placed: true },
                { name: "Student 27", placed: false },
                { name: "Student 28", placed: true },
                { name: "Student 29", placed: true },
                { name: "Student 30", placed: false },
                { name: "Student 31", placed: true },
                { name: "Student 32", placed: true },
                { name: "Student 33", placed: false },
                { name: "Student 34", placed: true },
                { name: "Student 35", placed: true },
              ],
            },
            IT: {
              totalAttended: 12,
              totalPlaced: 7,
              students: [
                { name: "Student 36", placed: true },
                { name: "Student 37", placed: false },
                { name: "Student 38", placed: true },
                { name: "Student 39", placed: false },
                { name: "Student 40", placed: true },
                { name: "Student 41", placed: true },
                { name: "Student 42", placed: false },
              ],
            },
            EE: {
              totalAttended: 6,
              totalPlaced: 3,
              students: [
                { name: "Student 43", placed: true },
                { name: "Student 44", placed: false },
                { name: "Student 45", placed: true },
                { name: "Student 46", placed: false },
                { name: "Student 47", placed: true },
                { name: "Student 48", placed: false },
              ],
            },
          },
        },
        {
          year: 2023,
          company: "Barclays",
          stats: {
            CS: {
              totalAttended: 18,
              totalPlaced: 12,
              students: [
                { name: "Student 49", placed: true },
                { name: "Student 50", placed: false },
                { name: "Student 51", placed: true },
                { name: "Student 52", placed: true },
                { name: "Student 53", placed: false },
                { name: "Student 54", placed: true },
                { name: "Student 55", placed: false },
                { name: "Student 56", placed: true },
                { name: "Student 57", placed: false },
                { name: "Student 58", placed: true },
                { name: "Student 59", placed: true },
                { name: "Student 60", placed: false },
              ],
            },
            IT: {
              totalAttended: 10,
              totalPlaced: 6,
              students: [
                { name: "Student 61", placed: true },
                { name: "Student 62", placed: false },
                { name: "Student 63", placed: true },
                { name: "Student 64", placed: false },
                { name: "Student 65", placed: true },
                { name: "Student 66", placed: true },
              ],
            },
            EE: {
              totalAttended: 4,
              totalPlaced: 2,
              students: [
                { name: "Student 67", placed: true },
                { name: "Student 68", placed: false },
                { name: "Student 69", placed: true },
                { name: "Student 70", placed: false },
              ],
            },
          },
        },
        {
          year: 2023,
          company: "BNY mellon",
          stats: {
            CS: {
              totalAttended: 12,
              totalPlaced: 9,
              students: [
                { name: "Student 71", placed: true },
                { name: "Student 72", placed: false },
                { name: "Student 73", placed: true },
                { name: "Student 74", placed: true },
                { name: "Student 75", placed: false },
                { name: "Student 76", placed: true },
                { name: "Student 77", placed: false },
                { name: "Student 78", placed: true },
                { name: "Student 79", placed: true },
              ],
            },
            IT: {
              totalAttended: 7,
              totalPlaced: 4,
              students: [
                { name: "Student 80", placed: true },
                { name: "Student 81", placed: false },
                { name: "Student 82", placed: true },
                { name: "Student 83", placed: false },
                { name: "Student 84", placed: true },
              ],
            },
            EE: {
              totalAttended: 5,
              totalPlaced: 3,
              students: [
                { name: "Student 85", placed: true },
                { name: "Student 86", placed: false },
                { name: "Student 87", placed: true },
                { name: "Student 88", placed: false },
                { name: "Student 89", placed: true },
              ],
            },
          },
        },
      ]);
      

  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedYear, setSelectedYear] = useState("2023");

  const departments = ["CS", "IT", "EE", "All"];
  const years = ["2023", "2022"]; // Update with available years

  const handleCompanyChange = (e) => setSelectedCompany(e.target.value);
  const handleDepartmentChange = (e) => setSelectedDepartment(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);

  // Filter data based on selections
  const getFilteredData = () => {
    const filteredData = data.filter((item) => selectedYear === item.year.toString());

    if (filteredData.length === 0) {
      return []; // No data for the selected year
    }

    return filteredData
      .filter((item) => selectedCompany === "All" || item.company === selectedCompany)
      .flatMap((item) => {
        const relevantStats =
          selectedDepartment === "All" ? item.stats : { [selectedDepartment]: item.stats[selectedDepartment] };

        return Object.entries(relevantStats).map(([dept, stats]) => {
          if (stats) {
            return {
              name: `${item.company} - ${dept}`,
              totalAttended: stats.totalAttended || 0,
              totalPlaced: stats.totalPlaced || 0,
              students: stats.students || [],
            };
          }
          return null;
        }).filter((entry) => entry !== null);
      });
  };

  const graphData = getFilteredData();

  return (
    <div style={{ width: "1200px", height: "800px"}}>
      <h2>Placement Statistics</h2>
      {/* Filters */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
        <label>
          Select Year:
          <select onChange={handleYearChange} value={selectedYear}>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label>
          Select Company:
          <select onChange={handleCompanyChange} value={selectedCompany}>
            <option value="All">All Companies</option>
            {data.map((d, index) => (
              <option key={index} value={d.company}>
                {d.company}
              </option>
            ))}
          </select>
        </label>
        <label>
          Select Department:
          <select onChange={handleDepartmentChange} value={selectedDepartment}>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Display Graphs and Students */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
  {graphData.length > 0 ? (
    graphData.map((entry, index) => (
      <div key={index} style={{ flex: "0 0 48%", marginBottom: "20px" }}>
        {/* Pie Chart */}
        <div style={{ textAlign: "center" }}>
          <h3>{entry.name}</h3>
          <Pie
            data={{
              labels: ["Placed", "Not Placed"],
              datasets: [
                {
                  data: [entry.totalPlaced, entry.totalAttended - entry.totalPlaced],
                  backgroundColor: ["green", "red"],
                },
              ],
            }}
            options={{
              responsive: true,
              animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
              },
              plugins: {
                legend: { position: "bottom" },
              },
            }}
            width={200}
            height={200}
          />
          <p>Total Attended: {entry.totalAttended}</p>
          <p>Total Placed: {entry.totalPlaced}</p>
        </div>

        {/* Student List */}
        <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
          <h4>Students</h4>
          <ul>
            {entry.students.length > 0 ? (
              entry.students.map((student, i) => (
                <li key={i} style={{ color: student.placed ? "green" : "red" }}>
                  {student.name} - {student.placed ? "Placed" : "Not Placed"}
                </li>
              ))
            ) : (
              <li>No students for this department.</li>
            )}
          </ul>
        </div>
      </div>
    ))
  ) : (
    <p>No data available for the selected filters.</p>
  )}
</div>


      <Link to="/">
        <button style={{ marginTop: "20px" }}>Back to Main</button>
      </Link>
    </div>
  );
};

export default PlacementStatistics;
