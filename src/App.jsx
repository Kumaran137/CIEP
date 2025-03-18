import React, { useState, useEffect } from 'react';
import Modal from "react-modal";

import PlacementStatistics from "./PlacedRate";
import CompanyStats from "./companystats";
import InternshipConversionRate from "./InternshipConversionRate";
import DepartmentWiseStatistics from "./DepartmentWiseStatistics";

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GraphPlot from "./GraphPlot";
import axios from 'axios';
import './App.css';
import VideoExperiences from './videoexperiences';

Modal.setAppElement('#root'); 
const MainContent = () => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/companies");
        setAllCompanies(response.data);
        setFilteredCompanies(response.data); // Display all by default
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === "") {
      setFilteredCompanies(allCompanies); // Reset to all companies
    } else {
      const filtered = allCompanies.filter((company) =>
        company.companyName.toLowerCase().includes(searchTerm)
      );
      setFilteredCompanies(filtered);
    }
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setSelectedStudent(null);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div>
      <div >
        <h1>Campus Placement Experiences</h1>

        {/* Search Bar */}
        <input
        type="text"
        placeholder="Search companies..."
        onChange={handleSearch}
        style={{
          marginBottom: "20px",
          padding: "10px",
          width: "80%",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <div className="placement-dashboard">
        {/* Companies Section */}
        <div className="companies-section">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, idx) => (
              <div
                key={idx}
                className="company-item"
                onClick={() => handleCompanyClick(company)}
              >
                <h2>{company.companyName}</h2>
                <p>
                  {company.students.length} Students <br />
                  {company.year}
                </p>
              </div>
            ))
          ) : (
            <p>No companies found.</p>
          )}
        </div>

        {/* Students Section */}
        <div className="students-section">
          {selectedCompany ? (
            <>
              <h2>{selectedCompany.companyName} Students</h2>
              {selectedCompany.students.map((student, idx) => (
                <div
                  key={idx}
                  className="student-widget"
                  onClick={() => handleStudentClick(student)}
                >
                  {student.studentName}
                </div>
              ))}
            </>
          ) : (
            <p>Select a company to view the students.</p>
          )}
        </div>
      </div>
        {selectedStudent && (
          <Modal
            isOpen={!!selectedStudent}
            onRequestClose={() => setSelectedStudent(null)}
            style={{
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
                width: '70%', // Decreased width for the modal
                height: '80%',
                overflowY: 'scroll', // Enable vertical scrolling if needed
                backgroundColor: '#333', // Set modal background color to dark
                color: '#fff', // Set text color to white for contrast
              },
            }}
          >
            <h3 style={{ textAlign: 'center' }}>{selectedStudent.studentName}'s Interview Experience</h3>
            <div className="images-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#000', padding: '10px' }}>
              {Array.from({ length: selectedStudent.imageCount }, (_, index) => {
                const imageUrl = `http://localhost:5000/experiences/${encodeURIComponent(
                  selectedCompany.companyName
                )}/${encodeURIComponent(selectedStudent.studentName)}/${index + 1}.jpg`;
                
                return (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Page ${index + 1}`}
                    className="image-item"
                    style={{ width: '100%', maxWidth: '500px', margin: '15px 0', border: '1px solid #ddd', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} // Adjusted margin and added border and shadow for better visuals
                  />
                );
              })}
            </div>
            <button onClick={() => setSelectedStudent(null)} style={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>Close</button>
          </Modal>
        )}
      </div>
    </div>
  );
};


const App = () => {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Left Navigation Buttons */}
        <div style={{ 
          marginRight: "20px", 
          display: "flex", 
          flexDirection: "column", 
          backgroundColor: "#f0f0f0", // Sidebar background
          padding: "10px", 
          borderRadius: "8px", 
          height: "100%", 
          minWidth: "150px", 
        }}>
          
          <Link to="/companystats">
            <button style={buttonStyle}>Company Stats</button>
          </Link>
          <Link to="/placed-rate">
            <button style={buttonStyle}>Placement Stats</button>
          </Link>
          <Link to="/internship-conversion">
            <button style={buttonStyle}>Internship Conversion Rate</button>
          </Link>
          <Link to="/video_exp">
            <button style={buttonStyle}>Video Experiences</button>
          </Link>
          <Link to="/department-wise">
            <button style={buttonStyle}>Department-wise Placement Stats</button>
          </Link>
          <Link to="/">
            <button style={buttonStyle}>Main</button>
          </Link>
        </div>

        <div style={{ flexGrow: 1 }}>
          <div style={{ 
            backgroundColor: "#4A90E2", 
            color: "#fff", 
            textAlign: "center", 
            padding: "10px 0",
            fontSize: "1.5em",
          }}>
            Campus Placement Dashboard
          </div>
          <Routes>
            
            <Route path="/companystats" element={<CompanyStats />} />
            <Route path="/placed-rate" element={<PlacementStatistics />} />
            <Route path="/internship-conversion" element={<InternshipConversionRate />} />
            <Route path="/video_exp" element={<VideoExperiences />} />
            <Route path="/department-wise" element={<DepartmentWiseStatistics />} />
            <Route path="/" element={<MainContent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const buttonStyle = {
  margin: "10px 0",
  padding: "10px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#4A90E2", // Button background
  color: "#fff", // Button text color
  cursor: "pointer",
  transition: "background-color 0.3s",
};


export default App;
