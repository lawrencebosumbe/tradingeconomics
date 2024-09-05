import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PlottingChart from "./PlottingChart";

const CountryIndicators = () => {
    /**
     -------------------------------------------------------
     These default countries are used for displaying purposes
     and can be removed. Please enter country name on the fields
     labelled Country 1 Name and Country 2 Name.
     -------------------------------------------------------
     * */
    const [country1, setCountry1] = useState('');
    const [country2, setCountry2] = useState('');
    const [tableData, setTableData] = useState([]);

    const [data, setData] = useState({ country1Data: [], country2Data: [] });

    useEffect(() => {
        fetchIndicators(country1, country2);
    }, [country1, country2]);

    useEffect(() => {
        if (tableData.length > 0) {
            initializeDataTable();
        }
    }, [tableData]);

    const fetchIndicators = async (c1, c2) => {
        try {
            const res1 = await axios.get(`http://localhost:8080/indicators/${c1}`);
            const res2 = await axios.get(`http://localhost:8080/indicators/${c2}`);

            console.log("Country 1 Data:", res1.data);
            console.log("Country 2 Data:", res2.data);

            const data1 = Array.isArray(res1.data.hits) ? res1.data.hits : [];
            const data2 = Array.isArray(res2.data.hits) ? res2.data.hits : [];

            const dataWithCountry1 = data1.map(item => ({ ...item, country: country1 }));
            const dataWithCountry2 = data2.map(item => ({ ...item, country: country2 }));

            const mergedData = [...dataWithCountry1, ...dataWithCountry2];

            setData({ country1Data: res1.data, country2Data: res2.data });

            console.log("Merged Data:", mergedData);
            setTableData(mergedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const initializeDataTable = () => {
        const formattedData = formatDataForTable(tableData);
        console.log("Formatted Data for DataTable:", formattedData);

        if ($.fn.dataTable.isDataTable('#dataTable')) {
            $('#dataTable').DataTable().clear().rows.add(formattedData).draw();
        } else {
            $('#dataTable').DataTable({
                data: formattedData,
                columns: [
                    { title: 'Country' },
                    { title: 'Category' },
                    { title: 'Description' },
                    { title: 'Type' },
                    { title: 'Currency' }
                ]
            });
        }
    };

    const formatDataForTable = (data) => {
        return data.map(item => [
            item.country || 'N/A',
            item.category || 'N/A',
            item.name || 'N/A',
            item.type || 'N/A',
            item.currency || 'N/A'
        ]);
    };

    const country1handleChange = (e) => {
        const newValue = e.target.value.toUpperCase();
        setCountry1(newValue);
        updateTitle();
    };

    const country2handleChange = (e) => {
        const newValue = e.target.value.toUpperCase();
        setCountry2(newValue);
        updateTitle();
    };

    useEffect(() => {
        updateTitle();
    }, [country1, country2]);

    const updateTitle = () => {
        const title = `Data for ${country1}${country1 && country2 ? ' - ' : ''}${country2}`;
        document.title = title;
    };

    return (
        <div className="container-fluid mt-5">
            <div>
                <h4>Economic Indicators for 2 Countries </h4>
                <div className="input-field">
                    <label>
                        Country 1 Name:
                        <input
                            type="text"
                            className='form-control'
                            placeholder='Enter Country 1 Name'
                            value={country1} onChange={country1handleChange}
                        />
                    </label>
                    <label className="label-country2">
                        Country 2 Name:
                        <input
                            type="text"
                            className='form-control'
                            placeholder='Enter Country 2 Name'
                            value={country2} onChange={country2handleChange}
                        />
                    </label>
                </div>

                <PlottingChart
                    country1={country1}
                    country2={country2}
                    country1handleChange={country1handleChange}
                    country2handleChange={country2handleChange}
                />
            </div>

            <div className="row mt-lg-5 mb-4">
                <div className="col-md-12">
                    <h4>Data for {country1} and {country2}</h4>
                    <table id="dataTable" className="table table-responsive table-striped mt-4 offset-1">
                        <thead>
                        <tr>
                            <th>Country</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th>Currency</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData.length === 0 ? (
                            <tr>
                                <td colSpan="2">No data available</td>
                            </tr>
                        ) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CountryIndicators;
