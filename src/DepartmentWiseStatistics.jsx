import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2"; // Import Bar chart from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DepartmentWiseStatistics = () => {
  const [data, setData] = useState([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/department-stats");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Department-wise Placement Statistics</h2>
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
  // Prepare the data for Chart.js
  const chartData = {
    labels: companyData.stats.map((stat) => stat.department), // X-axis labels (Departments)
    datasets: [
      {
        label: 'Students Placed',
        data: companyData.stats.map((stat) => stat.studentsPlaced), // Data for the bars (students placed)
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Bar color
        borderColor: 'rgba(54, 162, 235, 1)', // Border color
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${companyData.company} Department-wise Placement`
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Placed: ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ marginBottom: "40px" }}> {/* Add margin for separation between graphs */}
      <h3>{companyData.company}</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default DepartmentWiseStatistics;
