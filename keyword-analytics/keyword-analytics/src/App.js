import React, { useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css'; // Import the CSS file

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [keywords, setKeywords] = useState([]);
  const [chartData, setChartData] = useState({});
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;
          setKeywords(data);
          prepareChartData(data);
          setLoading(false);
        },
      });
    }
  };

  const prepareChartData = (data) => {
    const labels = data.map((item) => item.Keyword);
    const values = data.map((item) => parseInt(item.SearchVolume, 10));

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Search Volume',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    });
  };

  const filteredKeywords = keywords.filter((keyword) =>
    keyword.Keyword.toLowerCase().includes(filter.toLowerCase())
  );

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + filteredKeywords.map(e => `${e.Keyword},${e.SearchVolume}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "keywords.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div style={{ padding: '20px' }}>
      <img src="/uplift.png" alt="Uplift Logo" style={{ width: '150px', marginBottom: '20px' }} />
      <h1>Keyword Analytics</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Filter keywords..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ margin: '20px 0', padding: '10px', width: '100%' }}
      />
      {loading && <p>Loading...</p>}
      <h2>Keywords</h2>
      <table>
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Search Volume</th>
          </tr>
        </thead>
        <tbody>
          {filteredKeywords.map((keyword, index) => (
            <tr key={index}>
              <td>{keyword.Keyword}</td>
              <td>{keyword.SearchVolume}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {chartData.labels && (
        <div style={{ marginTop: '20px' }}>
          <h2>Search Volume Chart</h2>
          <Bar data={chartData} />
        </div>
      )}
      <button onClick={exportData} style={{ marginTop: '20px', padding: '10px' }}>
        Export Data
      </button>
    </div>
  );
};

export default App;