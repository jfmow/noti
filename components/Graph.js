import { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

export default function GraphComponent({ data1, data2 }) {
  const chartRef = useRef(null);
  const [ttsize, setttsize] = useState('')

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy existing chart instance if it exists
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      // Sort data arrays in ascending order based on total_pages and total_size
      const sortedData1 = data1.sort((a, b) => a.total_pages - b.total_pages);
      const sortedData2 = data2.sort((a, b) => a.total_size - b.total_size);

      // Extract unique user values
      const users = [...new Set([...sortedData1.map(item => item.user), ...sortedData2.map(item => item.user)])];

      // Calculate total size of data2 records
      const totalSize = sortedData2.reduce((total, item) => total + item.total_size, 0);
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2); // Convert bytes to megabytes (MB) and round to 2 decimal places
      setttsize(totalSizeMB)
      // Create new chart instance
      chartRef.current.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: users,
          datasets: [
            {
              label: 'Total Pages',
              data: users.map(user => {
                const item = sortedData1.find(data => data.user === user);
                return item ? item.total_pages : 0;
              }),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Total file size (MB)',
              data: users.map(user => {
                const item = sortedData2.find(data => data.user === user);
                return item ? item.total_size / (1024 * 1024) : 0; // Convert bytes to megabytes (MB)
              }),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [data1, data2]);

  return (
    <div style={{width: '100%'}}>
      <canvas style={{ maxHeight: '50dvh', padding: '0 2em' }} ref={chartRef} />
      <h2>Total file size stored on disk: {ttsize}MB</h2>
    </div>
  );
}
