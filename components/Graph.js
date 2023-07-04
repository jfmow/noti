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
            const colors = [];
            const opacity = 0.5;

            for (let i = 0; i < users.length; i++) {
                const red = Math.floor(Math.random() * 256);
                const green = Math.floor(Math.random() * 256);
                const blue = Math.floor(Math.random() * 256);
                const color = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
                colors.push(color);
            } // Add more colors if needed
            // Create new chart instance
            chartRef.current.chart = new Chart(ctx, {
                data: {
                    labels: users,
                    datasets: [
                        {
                            label: 'Total Pages per user',
                            type: 'line',
                            data: users.map(user => {
                                const item = sortedData1.find(data => data.user === user);
                                return item ? item.total_pages : 0;
                            }),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1.5,
                        },
                        {
                            label: 'Total size of files per user (MB)',
                            type: 'pie',
                            data: users.map(user => {
                                const item = sortedData2.find(data => data.user === user);
                                return item ? item.total_size / (1024 * 1024) : 0; // Convert bytes to megabytes (MB)
                            }),
                            backgroundColor: colors.slice(0, users.length),
                            borderColor: '#fff',
                            borderWidth: 1,
                        }
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
        <div style={{ width: '100%' }}>
            <canvas ref={chartRef} />
            <span>Total size of files stored on disk: {ttsize}MB</span>
        </div>
    );
}
