import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors'; // For enabling CORS
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// For resolving __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/experiences', express.static(path.join(__dirname, 'experiences')));
const prisma = new PrismaClient();


// Function to list students and their image counts inside a company folder
const getCompanyStudents = (companyFolder) => {
    const basePath = path.join(__dirname, companyFolder);
    const students = fs.readdirSync(basePath);

    const studentData = students.map(student => {
        const studentPath = path.join(basePath, student);
        const files = fs.readdirSync(studentPath);

        // Filter out only JPG files and count them
        const imageFiles = files.filter(file => file.endsWith('.jpg'));
        return {
            studentName: student,
            imageCount: imageFiles.length
        };
    });

    return studentData;
};

const toTitleCase = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
};

app.get('/companies', (req, res) => {
    const experiencesPath = path.join(__dirname, 'experiences');
    
    // Get all company folder names dynamically
    const companyFolders = fs.readdirSync(experiencesPath).filter(folder => fs.statSync(path.join(experiencesPath, folder)).isDirectory());

    const result = companyFolders.map(company => {
        const students = getCompanyStudents(path.join('experiences', company));
        return {
            companyName: toTitleCase(company), // Convert to Title Case
            students
        };
    });

    res.json(result);
});
app.get('/department-stats', async (req, res) => {
    try {
      const companies = await prisma.company.findMany({
        include: {
          stats: {
            select: {
              department: true,
              studentsPlaced: true
            }
          }
        }
      });
  
      const result = companies.map(company => ({
        company: company.name,
        stats: company.stats.map(stat => ({
          department: stat.department,
          studentsPlaced: stat.studentsPlaced
        }))
      }));
  
      res.json(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching department stats' });
    }
  });
  app.get("/api/company-stats", async (req, res) => {
    try {
      const { company } = req.query;  // Get the company from query params
  
      // Query data based on the company parameter
      const companyStats = await prisma.yearStats.findMany({
        where: {
          company: company ? { name: company } : undefined,  // If no company is provided, fetch for all companies
        },
        include: {
          company: true,  // Include the company name in the result
        },
      });
  
      res.json(companyStats);  // Send data as JSON
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Error fetching data" });
    }
  });
  
  app.get("/internship-conversion", async (req, res) => {
    try {
      const companies = await prisma.company.findMany({
        include: {
          Placement: {
            include: {
              students: true,
            },
          },
        },
      });
  
      // Format the data as required
      const result = companies.map(company => {
        return company.Placement.map(placement => {
          const departmentStats = {};
  
          // Group students by department
          placement.students.forEach(student => {
            if (!departmentStats[placement.department]) {
              departmentStats[placement.department] = {
                totalAttended: 0,
                totalConverted: 0,
                students: [],
              };
            }
            departmentStats[placement.department].totalAttended++;
            departmentStats[placement.department].students.push({
              name: student.name,
              converted: student.converted,
            });
            if (student.converted) {
              departmentStats[placement.department].totalConverted++;
            }
          });
  
          return {
            year: placement.year,
            company: company.name,
            stats: departmentStats,
          };
        });
      }).flat();
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  app.get('/placement-statistics', async (req, res) => {
    const { year, company, department } = req.query;
  
    const where = {};
    if (year) where.year = parseInt(year);
    if (company && company !== 'All') where.company = company;
    if (department && department !== 'All') where.department = department;
  
    try {
      const placements = await prisma.placement.findMany({
        where,
        include: {
          students: true,
        },
      });
      res.json(placements);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  });
  app.use(express.static(path.join(__dirname, "video_experiences"))); // Serve video files statically

  const VIDEO_DIR = path.join(__dirname, "video_experiences");
  //const fs = require('fs');
  //const path = require('path');
  
  // New endpoint to fetch video experiences (companies and students)
  app.get('/video_experiences', (req, res) => {
    const experiencesPath = path.join(__dirname, 'video_experiences');
  
    // Get all company folder names dynamically
    const companyFolders = fs.readdirSync(experiencesPath).filter(folder => fs.statSync(path.join(experiencesPath, folder)).isDirectory());
  
    const result = companyFolders.map(company => {
      const studentFolders = fs.readdirSync(path.join(experiencesPath, company)).filter(folder => fs.statSync(path.join(experiencesPath, company, folder)).isDirectory());
  
      const students = studentFolders.map(student => {
        const videoPath = path.join(experiencesPath, company, student, `experiences.mp4`);
        return {
          studentName: student,
          videoPath: `/video_experiences/${encodeURIComponent(company)}/${encodeURIComponent(student)}/${encodeURIComponent('experiences')}.mp4`,
        };
      });
  
      return {
        companyName: company,
        students,
      };
    });
  
    res.json(result);
  });
  app.use('/video_experiences', express.static(path.join(__dirname, 'video_experiences'), {
    setHeaders: (res, path) => {
      if (path.endsWith('.mp4')) {
        res.set('Content-Type', 'video/mp4');
      }
    }
  }));
  
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on 192.168.131.34:${PORT}`);
});
