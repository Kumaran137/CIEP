import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const InternshipConversionRate = () => {
  const [data, setData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedYear, setSelectedYear] = useState("2023");
  const [years, setYears] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    axios.get("http://localhost:5000/internship-conversion")
      .then((response) => {
        setData(response.data);
        
        // Set years and departments dynamically based on data
        const fetchedYears = [...new Set(response.data.map((item) => item.year))];
        setYears(fetchedYears);

        const fetchedDepartments = [
          ...new Set(response.data.flatMap(item => Object.keys(item.stats))),
        ];
        setDepartments(fetchedDepartments);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleCompanyChange = (e) => setSelectedCompany(e.target.value);
  const handleDepartmentChange = (e) => setSelectedDepartment(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);

  const getFilteredData = () => {
    const filteredData = data.filter((item) => selectedYear === item.year.toString());

    if (filteredData.length === 0) {
      return [];
    }

    // Aggregate data by company and department
    const aggregatedData = filteredData.reduce((acc, item) => {
      const companyKey = item.company;

      // Initialize the company stats if not already initialized
      if (!acc[companyKey]) {
        acc[companyKey] = {
          name: companyKey,
          totalAttended: 0,
          totalConverted: 0,
          students: [],
        };
      }

      // Aggregate stats for each department
      Object.entries(item.stats).forEach(([dept, stats]) => {
        acc[companyKey].totalAttended += stats.totalAttended || 0;
        acc[companyKey].totalConverted += stats.totalConverted || 0;
        acc[companyKey].students = acc[companyKey].students.concat(stats.students || []);
      });

      return acc;
    }, {});

    // Filter the data by selected company and department
    const graphData = Object.values(aggregatedData)
      .filter((entry) => selectedCompany === "All" || entry.name === selectedCompany)
      .map((entry) => {
        const relevantStats = selectedDepartment === "All" ? entry : {
          name: `${entry.name} - ${selectedDepartment}`,
          totalAttended: entry.totalAttended,
          totalConverted: entry.totalConverted,
          students: entry.students,
        };
        return relevantStats;
      });

    return graphData;
  };

  const graphData = getFilteredData();

  // Extract companies dynamically from the data
  const companies = ["All", ...new Set(data.map(item => item.company))];

  return (
    <div style={{ width: "1200px", height: "800px"}}>
      <h2>Internship Conversion Rate</h2>
      {/* Filter Options */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
        <label>
          Select Year:
          <select onChange={handleYearChange} value={selectedYear}>
            {years.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        </label>
        <label>
          Select Company:
          <select onChange={handleCompanyChange} value={selectedCompany}>
            {companies.map((company, index) => (
              <option key={index} value={company}>{company}</option>
            ))}
          </select>
        </label>
        <label>
          Select Department:
          <select onChange={handleDepartmentChange} value={selectedDepartment}>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
            <option value="All">All Departments</option>
          </select>
        </label>
      </div>

      {/* Render Pie Charts and Student List */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {graphData.length > 0 ? (
          graphData.map((entry, index) => (
            <div key={index} style={{ flex: "0 0 48%", marginBottom: "20px" }}>
              <h3>{entry.name}</h3>
              <Pie
                data={{
                  labels: ["Converted Full Time", "Not Converted"],
                  datasets: [
                    {
                      data: [entry.totalConverted, entry.totalAttended - entry.totalConverted],
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
              <p>Total Converted: {entry.totalConverted}</p>

              {/* Student List */}
              <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
                <h4>Students</h4>
                <ul>
                  {entry.students.length > 0 ? (
                    entry.students.map((student, i) => (
                      <li key={i} style={{ color: student.converted ? "green" : "red" }}>
                        {student.name} - {student.converted ? "Converted" : "Rejected"}
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

export default InternshipConversionRate;
