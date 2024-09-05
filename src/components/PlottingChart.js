import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from 'chart.js/auto';

const PlottingChart = ({ country1, country2 }) => {
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null);

    // Effect to fetch chart data when country names change
    useEffect(() => {
        // Check if both country names are not empty before fetching data
        if (country1 && country2) {
            const fetchChartData = async () => {
                try {
                    const response1 = await axios.get(`http://localhost:8080/indicators/${country1}`);
                    const response2 = await axios.get(`http://localhost:8080/indicators/${country2}`);

                    // Extract labels and data for country 1
                    const labels1 = response1.data.info.facets.unit.map(unit => unit.key);
                    const data1 = response1.data.info.facets.unit.map(unit => unit.doc_count);

                    // Extract labels and data for country 2
                    const labels2 = response2.data.info.facets.unit.map(unit => unit.key);
                    const data2 = response2.data.info.facets.unit.map(unit => unit.doc_count);

                    // Ensure labels are the same for both datasets
                    const labels = labels1.length >= labels2.length ? labels1 : labels2;

                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: `${country1} Indicator Data`,
                                data: data1,
                                borderColor: 'rgba(75, 192, 192, 1)', // Turquoise line
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                            },
                            {
                                label: `${country2} Indicator Data`,
                                data: data2,
                                borderColor: 'rgba(255, 99, 132, 1)', // Different color for second line
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                            },
                        ],
                    });
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchChartData();
        }
    }, [country1, country2]); // Trigger effect when country1 or country2 changes

    return (
        <div className="container">
            {/* Chart Section */}
            <div className="row">
                <div className="card chart-card">
                    <div className="col-md-10 mt-4 chart-canvas">
                        {/* Display chart if data is available, else show loading message */}
                        {chartData ? (
                            <Line ref={chartRef} data={chartData} />
                        ) : (
                            <p>Enter country names to display chart data...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlottingChart;
