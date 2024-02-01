import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import '../assets/loader.css'; 



function Home() {
  const [formData, setFormData] = useState({
    file: null,
    lunchPeriods: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileUpload = (e) => {
      setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleUpload = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxUpload = (e) => {
    const { checked, value } = e.target;
    setFormData({
      ...formData,
      lunchPeriods: checked 
        ? [...formData.lunchPeriods, value]
        : formData.lunchPeriods.filter((v) => v !== value),
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault(); 
    setIsLoading(true);

    console.log("Creating Timetable...");
    const data = new FormData();
    data.append('file', formData.file);
    data.append('lunchPeriods', formData.lunchPeriods.join(','));

    fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: data,
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      navigate('/timetable');
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error:', error)
    })   
    .finally(() => {
      setIsLoading(false); 
    });
  };

  return (
    <main className="container">
      <h2 className="title">Upload Schedule</h2>
      <div className="form-container">
        <form id="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
                    <label htmlFor="file-upload" className="form-label">Upload Teacher Excel File:</label>
                    <input type="file" id="file-upload" name="file-upload" accept=".xlsx, .xls" className="form-input" onChange={handleFileUpload} required />
                </div>
                <div className="align-vertical">
                    <div className="Can-Not">
                        <label htmlFor="class1-dropdown" className="form-label">Class 1:</label>
                        <select id="class1-dropdown" name="class1-dropdown" className="form-input" onChange={handleUpload} required>
                            <option value="">Select Class</option>
                            <option value="class1A">Class 1A</option>
                            <option value="class1B">Class 1B</option>
                        </select>
                    </div>
                    <div className="Can-Not">
                        <label htmlFor="class2-dropdown" className="form-label">Cant conflict with :</label>
                        <select id="class2-dropdown" name="class2-dropdown" className="form-input" onChange={handleUpload} required>
                            <option value="">Select Class</option>
                            <option value="class2A">Class 2A</option>
                            <option value="class2B">Class 2B</option>
                        </select>
                    </div>
                </div>    
                <div className="Paramaters">
                    <div className="lunch">
                        <div className="Lunch-checkboxs">
                            <h3>Possible Lunch Periods:</h3>
                            <label htmlFor="Period1">
                                <input type="checkbox" id="Period1" name="lunch_periods" value="1" onChange={handleCheckboxUpload} />
                                Period: 1
                            </label>
                            <label htmlFor="Period2">
                                <input type="checkbox" id="Period2" name="lunch_periods" value="2" onChange={handleCheckboxUpload} />
                                Period: 2
                            </label>
                            <label htmlFor="Period3">
                                <input type="checkbox" id="Period3" name="lunch_periods" value="3" onChange={handleCheckboxUpload} />
                                Period: 3
                            </label>
                            <label htmlFor="Period4">
                                <input type="checkbox" id="Period4" name="lunch_periods" value="4" onChange={handleCheckboxUpload} />
                                Period: 4
                            </label>
                            <label htmlFor="Period5">
                                <input type="checkbox" id="Period5" name="lunch_periods" value="5" onChange={handleCheckboxUpload} />
                                Period: 5
                            </label>
                            <label htmlFor="Period6">
                                <input type="checkbox" id="Period6" name="lunch_periods" value="6" onChange={handleCheckboxUpload} />
                                Period: 6
                            </label>
                            <label htmlFor="Period7">
                                <input type="checkbox" id="Period7" name="lunch_periods" value="7" onChange={handleCheckboxUpload} />
                                Period: 7
                            </label>
                        </div>
                    </div>
                </div>
          <div className="form-submit">
            <button type="submit" className="submit-btn">
              Upload
            </button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="loader-overlay">
          <div className="terminal-loader">
            <div className="terminal-header">
              <div className="terminal-title">Status</div>
              <div className="terminal-controls">
                <div className="control close"></div>
                <div className="control minimize"></div>
                <div className="control maximize"></div>
              </div>
            </div>
            <div className="text">Loading...</div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;