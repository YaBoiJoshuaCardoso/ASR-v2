const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;
const uploadDir = 'uploads';

// Setup multer for file upload with custom storage to keep original file names
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

let lastScheduleData = null;

app.post('/upload', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'studentPreferenceFile', maxCount: 1 }]), (req, res) => {
  if (!req.files.file || !req.files.studentPreferenceFile) {
    return res.status(400).json({ message: "Files are missing" });
  }

  const file = req.files.file[0];
  const studentPreferenceFile = req.files.studentPreferenceFile[0];
  const lunchPeriods = req.body.lunchPeriods || '';

  const pythonScriptPath = path.join(__dirname, 'python_scripts', 'main.py');
  const args = [pythonScriptPath, file.path, studentPreferenceFile.path, lunchPeriods];

  const pythonProcess = spawn('python3', args);

  let pythonData = '';
  pythonProcess.stdout.on('data', (data) => {
    pythonData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}`);
      return res.status(500).json({ message: "Python script error" });
    }

    try {
      lastScheduleData = JSON.parse(pythonData.trim());
      res.json(lastScheduleData);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ message: "Error parsing JSON", error: error.toString() });
    }
  });
});

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
