import React, { useState, useEffect } from 'react';

function Timetable() {
    const [scheduleData, setScheduleData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/schedule')
            .then(response => response.json())
            .then(data => setScheduleData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h2>Schedule</h2>
            <table>
                <thead>
                    <tr>
                        {/* Assuming 'row' has keys like 'Teacher', 'Period 1', etc. */}
                        {scheduleData.length > 0 && Object.keys(scheduleData[0]).map((key, index) => (
                            <th key={index}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {scheduleData.map((row, index) => (
                        <tr key={index}>
                            {Object.values(row).map((value, idx) => (
                                <td key={idx}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        {/* Table code as above */}

        {/* Download button */}
        <a href="http://localhost:3001/download-excel" download="schedule.xlsx">
            <button>Download Excel File</button>
        </a>
        </div>
    );
}

export default Timetable;