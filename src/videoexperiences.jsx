import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

const VideoExperiences = () => {
  const [videoData, setVideoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/video_experiences");
        setVideoData(response.data);
        setFilteredData(response.data); // Initialize with all data
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };
    fetchVideoData();
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (!searchTerm) {
      setFilteredData(videoData); // If no search term, reset to original data
    } else {
      setFilteredData(
        videoData.filter((company) =>
          company.companyName.toLowerCase().includes(searchTerm)
        )
      );
    }
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setSelectedStudent(null); // Reset selected student when a new company is clicked
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Video Experiences
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search companies..."
        onChange={handleSearch}
        style={{
          marginBottom: "20px",
          padding: "10px",
          width: "100%",
          maxWidth: "600px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Companies Section */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            maxHeight: "500px",
            overflowY: "scroll",
          }}
        >
          <h3>Companies</h3>
          {filteredData.length > 0 ? (
            filteredData.map((company, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px",
                  margin: "5px 0",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedCompany?.companyName === company.companyName
                      ? "#e0f7fa"
                      : "#fff",
                }}
                onClick={() => handleCompanyClick(company)}
              >
                <strong>{company.companyName}</strong>
              </div>
            ))
          ) : (
            <p>No companies found.</p>
          )}
        </div>

        {/* Students Section */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            maxHeight: "500px",
            overflowY: "scroll",
          }}
        >
          <h3>Students</h3>
          {selectedCompany ? (
            selectedCompany.students.map((student, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px",
                  margin: "5px 0",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedStudent?.studentName === student.studentName
                      ? "#e8f5e9"
                      : "#fff",
                }}
                onClick={() => handleStudentClick(student)}
              >
                {student.studentName}
              </div>
            ))
          ) : (
            <p>Select a company to view its students.</p>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onRequestClose={closeModal}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: "800px",
              height: "70%",
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "10px",
            },
          }}
        >
          <h3>{selectedStudent.studentName}'s Experience </h3>
          <video
            controls
            style={{
              width: "100%",
              maxHeight: "400px",
              borderRadius: "8px",
              margin: "20px 0",
            }}
          >
            <source
              src={`http://localhost:5000${selectedStudent.videoPath}`}
              type="video/mp4"
            />
            
            Your browser does not support the video tag.
          </video>
          <button
            onClick={closeModal}
            style={{
              display: "block",
              margin: "10px auto",
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
};

export default VideoExperiences;
