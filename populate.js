import fs from 'fs';
import path from 'path';

// List of companies
const companies = [
  "Amazon",
  "Appian",
  "Arcesium",
  "Aspire Systems",
  "Athena Health",
  "BNY",
  "BNY Mellon",
  "Bank Of America",
  "Barclays",
  "Checktronix",
  "Chronus",
  "Citi",
  "Tcs",
  "Walmart",
  "Wells Fargo"
];

// Path where the video_experiences folder will be created
const basePath = path.join(".", 'video_experiences');

// Function to create company folders and student folders inside them
const createCompanyFolders = () => {
  // Create the base 'video_experiences' folder if it doesn't exist
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }

  // Loop through the companies and create a folder for each
  companies.forEach(company => {
    const companyPath = path.join(basePath, company);

    // Create company folder if it doesn't exist
    if (!fs.existsSync(companyPath)) {
      fs.mkdirSync(companyPath);
    }

    // For each company, create a sample student folder
    const studentFolderPath = path.join(companyPath, 'student1');

    // Create student folder inside company folder
    if (!fs.existsSync(studentFolderPath)) {
      fs.mkdirSync(studentFolderPath);
    }

    // Optionally, create a sample video file inside the student folder
    const sampleVideoPath = path.join(studentFolderPath, 'experience.mp4');
    if (!fs.existsSync(sampleVideoPath)) {
      fs.writeFileSync(sampleVideoPath, ''); // Creates an empty file (you can replace this with an actual video file)
    }
  });

  console.log("Company folders populated successfully!");
};

// Call the function to populate the folder structure
createCompanyFolders();
