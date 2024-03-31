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
    const newLunchPeriods = checked 
        ? [...formData.lunchPeriods, value]
        : formData.lunchPeriods.filter((v) => v !== value);

    console.log("Checkbox value:", value, "Checked:", checked);
    console.log("Updated lunch periods:", newLunchPeriods);

//requesto to Form
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
                <div className="lunch">
                  <h3>Possible Lunch Periods:</h3>
                  <div className="Lunch-checkboxs">
                    {Array.from({ length: 7 }, (_, i) => i + 1).map(period => {
                      const periodValue = period.toString();
                      return (
                        <div key={periodValue} className="checkbox-wrapper">
                          <input
                            type="checkbox"
                            id={`Period${periodValue}`}
                            name="lunch_periods"
                            value={periodValue}
                            checked={formData.lunchPeriods.includes(periodValue)}
                            onChange={handleCheckboxUpload}
                          />
                          <label htmlFor={`Period${periodValue}`}>Period: {periodValue}</label>
                        </div>
                      );
                    })}
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