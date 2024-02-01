const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;
const uploadDir = 'uploads';

// Setup multer for file upload
const upload = multer({ dest: uploadDir });

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(express.static('public'));
app.use(cors());

let lastScheduleData = null;  // Store the last schedule data

// POST endpoint for uploads, using user inputed DATA
app.post('/upload', upload.single('file'), (req, res) => {
    const lunchPeriods = req.body.lunchPeriods; // Extract lunch periods from the request
    const arguments = ['./python_scripts/main.py', req.file.path, lunchPeriods]; // Include lunch periods as an argument
    const pythonProcess = spawn('python3', arguments);

    let pythonData = '';
    pythonProcess.stdout.on('data', (data) => {
        pythonData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
        pythonData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        // This line trims any leading/trailing whitespace which might include newlines or spaces
        pythonData = pythonData.trim();
    
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            return res.status(500).json({ message: "Python script error" });
        }
    
        try {
            // This is where you attempt to parse the JSON
            lastScheduleData = JSON.parse(pythonData);
            res.json(lastScheduleData);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            // The response here should indicate the nature of the error to help with debugging
            res.status(500).json({ message: "Error parsing JSON", error: error.toString() });
        }
    });
});

// New endpoint to get the schedule data
app.get('/schedule', (req, res) => {
    if (lastScheduleData) {
        res.json(lastScheduleData);
    } else {
        res.status(404).json({ message: "No schedule data available" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
