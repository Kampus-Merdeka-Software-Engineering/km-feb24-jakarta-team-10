let rawData = null;
const currentFilters = {
    borough: '',
    neighborhood: '',
    buildingClass: '',
};
let lineChart = null;
let barChart = null;
let pieChart = null;
let unitsLineChart = null;
let tableChart = null;

fetch('https://raw.githubusercontent.com/Team10Jakarta/Project-SE/main/NYC%20DATASET.json')
    .then(response => response.json())
    .then(data => {
        document.getElementById('loadingSpinner').style.display = 'block';

        rawData = data;
        populateFilters(rawData);
        filter(rawData);

        document.getElementById('loadingSpinner').style.display = 'none';
    })
    .catch(error => console.error('Error fetching data:', error));


function filter(data) {
    const salesData = processData(data);
    const recordCountElement = document.getElementById('recordCountValue');
    const totalSales = salesData.tableData.reduce((total, neighborhood) => total + neighborhood.totalSales, 0);
    recordCountElement.textContent = totalSales;

    createLineChart('lineChart', salesData.lineData);
    createPieChart('pieChart', salesData.priceRangeData);
    createUnitsLineChart('unitsLineChart', salesData);
    createBarChart('barChart', salesData.barData);
    createTableChart('tableChart', salesData.tableData);
}

function populateFilters(data) {
    const boroughSet = new Set();
    const neighborhoodSet = new Set();
    const buildingClassSet = new Set();

    data.forEach(item => {
        boroughSet.add(item.BOROUGH);
        neighborhoodSet.add(item.NEIGHBORHOOD);
        buildingClassSet.add(item.BUILDING_CLASS_CATEGORY);
    });

    const sortedBoroughs = Array.from(boroughSet).sort();
    const sortedNeighborhoods = Array.from(neighborhoodSet).sort();
    const sortedBuildingClasses = Array.from(buildingClassSet).sort();

    const boroughFilter = document.getElementById('boroughFilter');
    const neighborhoodFilter = document.getElementById('neighborhoodFilter');
    const buildingClassFilter = document.getElementById('buildingClassFilter');

    sortedBoroughs.forEach(borough => {
        const option = document.createElement('option');
        option.value = borough;
        option.textContent = borough;
        boroughFilter.appendChild(option);
    });

    sortedNeighborhoods.forEach(neighborhood => {
        const option = document.createElement('option');
        option.value = neighborhood;
        option.textContent = neighborhood;
        neighborhoodFilter.appendChild(option);
    });

    sortedBuildingClasses.forEach(buildingClass => {
        const option = document.createElement('option');
        option.value = buildingClass;
        option.textContent = buildingClass;
        buildingClassFilter.appendChild(option);
    });

    boroughFilter.addEventListener('change', (event) => {
        currentFilters.borough = event.target.value;
        if (currentFilters.borough === '') {
            // Jika filter 'All Borough' dipilih kembali, reset semua filter terkait
            currentFilters.neighborhood = '';
            currentFilters.buildingClass = '';
            updateNeighborhoodFilter(rawData);
            updateBuildingClassFilter(rawData);
            filter(rawData); // perbarui data dengan data awal
        } else {
            // Jika filter borough lain dipilih, panggil fungsi filter() langsung
            filter(rawData); // perbarui data dengan data awal
            updateNeighborhoodFilter(rawData);
            updateBuildingClassFilter(rawData);
        }
    });

    neighborhoodFilter.addEventListener('change', (event) => {
        currentFilters.neighborhood = event.target.value;
        filter();
        updateBuildingClassFilter(data);
    });

    buildingClassFilter.addEventListener('change', (event) => {
        currentFilters.buildingClass = event.target.value;
        filter();
    });
}

function updateNeighborhoodFilter(data) {
    const neighborhoodFilter = document.getElementById('neighborhoodFilter');
    neighborhoodFilter.innerHTML = '<option value="">All Neighborhood</option>';

    if (currentFilters.borough === '') {
        const neighborhoodSet = new Set();
        data.forEach(item => {
            neighborhoodSet.add(item.NEIGHBORHOOD);
        });

        const sortedNeighborhoods = Array.from(neighborhoodSet).sort();

        sortedNeighborhoods.forEach(neighborhood => {
            const option = document.createElement('option');
            option.value = neighborhood;
            option.textContent = neighborhood;
            neighborhoodFilter.appendChild(option);
        });
    } else {
        // Jika filter borough lain dipilih, update daftar neighborhood sesuai dengan borough yang dipilih
        const neighborhoodSet = new Set();
        data.forEach(item => {
            if (currentFilters.borough === '' || item.BOROUGH === currentFilters.borough) {
                neighborhoodSet.add(item.NEIGHBORHOOD);
            }
        });

        const sortedNeighborhoods = Array.from(neighborhoodSet).sort();

        sortedNeighborhoods.forEach(neighborhood => {
            const option = document.createElement('option');
            option.value = neighborhood;
            option.textContent = neighborhood;
            neighborhoodFilter.appendChild(option);
        });
    }
}

// Modifikasi pembaruan filter ketika filter 'All Borough' dipilih kembali
function updateBuildingClassFilter(data) {
    const buildingClassFilter = document.getElementById('buildingClassFilter');
    buildingClassFilter.innerHTML = '<option value="">All Building Class Category</option>';

    if (currentFilters.borough === '') {
        const buildingClassSet = new Set();
        data.forEach(item => {
            buildingClassSet.add(item.BUILDING_CLASS_CATEGORY);
        });

        const sortedBuildingClasses = Array.from(buildingClassSet).sort();

        sortedBuildingClasses.forEach(buildingClass => {
            const option = document.createElement('option');
            option.value = buildingClass;
            option.textContent = buildingClass;
            buildingClassFilter.appendChild(option);
        });
    } else {
        // Jika filter borough lain dipilih, update daftar building class category sesuai dengan borough dan neighborhood yang dipilih
        const buildingClassSet = new Set();
        data.forEach(item => {
            if ((currentFilters.borough === '' || item.BOROUGH === currentFilters.borough) &&
                (currentFilters.neighborhood === '' || item.NEIGHBORHOOD === currentFilters.neighborhood)) {
                buildingClassSet.add(item.BUILDING_CLASS_CATEGORY);
            }
        });

        const sortedBuildingClasses = Array.from(buildingClassSet).sort();

        sortedBuildingClasses.forEach(buildingClass => {
            const option = document.createElement('option');
            option.value = buildingClass;
            option.textContent = buildingClass;
            buildingClassFilter.appendChild(option);
        });
    }
}

function updateBuildingClassFilter(data) {
    const buildingClassFilter = document.getElementById('buildingClassFilter');
    buildingClassFilter.innerHTML = '<option value="">All Building Class Category</option>';

    const buildingClassSet = new Set();
    data.forEach(item => {
        if ((currentFilters.borough === '' || item.BOROUGH === currentFilters.borough) &&
            (currentFilters.neighborhood === '' || item.NEIGHBORHOOD === currentFilters.neighborhood)) {
            buildingClassSet.add(item.BUILDING_CLASS_CATEGORY);
        }
    });

    const sortedBuildingClasses = Array.from(buildingClassSet).sort();

    sortedBuildingClasses.forEach(buildingClass => {
        const option = document.createElement('option');
        option.value = buildingClass;
        option.textContent = buildingClass;
        buildingClassFilter.appendChild(option);
    });
}

function processData(data) {
    const filteredData = rawData.filter(item => {
        return (currentFilters.borough === '' || item.BOROUGH === currentFilters.borough) &&
            (currentFilters.neighborhood === '' || item.NEIGHBORHOOD === currentFilters.neighborhood) &&
            (currentFilters.buildingClass === '' || item.BUILDING_CLASS_CATEGORY === currentFilters.buildingClass);
    });
    const salesData = { lineData: {}, lineDatat: {}, barData: {}, priceRangeData: {}, tableData: {} };
    const salesByBorough = {};
    const salesCounts = {};
    const buildingCategoryCounts = {};
    const salesByNeighborhood = {};
    const priceRanges = {
        "$0 - $20": 0,
        "$20 - $100.000": 0,
        "$100.000 - $10.000.000": 0,
        "$10.000.000 - $1.000.000.000": 0,
        "> $1.000.000.000": 0
    };

    const residentialUnits = {};
    const commercialUnits = {};

    filteredData.forEach(item => {
        const neighborhood = item.NEIGHBORHOOD;
        const borough = item.BOROUGH;
        const category = item.BUILDING_CLASS_CATEGORY;
        const saleDate = new Date(item.SALE_DATE);
        const salePrice = parseFloat(item.SALE_PRICE);
        const monthYear = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
        const resUnits = parseInt(item.RESIDENTIAL_UNITS, 10) || 0;
        const comUnits = parseInt(item.COMMERCIAL_UNITS, 10) || 0;

        // Process data for Total Sales in Each Borough by Month (Chart 1)
        if (!salesByBorough[borough]) {
            salesByBorough[borough] = {};
        }
        if (!salesByBorough[borough][monthYear]) {
            salesByBorough[borough][monthYear] = 0;
        }
        salesByBorough[borough][monthYear]++;

        // Process data for Sales Distribution by Price Range (Chart 2)
        if (salePrice >= 0 && salePrice <= 20) {
            priceRanges["$0 - $20"]++;
        } else if (salePrice > 20 && salePrice <= 100000) {
            priceRanges["$20 - $100.000"]++;
        } else if (salePrice > 100000 && salePrice <= 10000000) {
            priceRanges["$100.000 - $10.000.000"]++;
        } else if (salePrice > 10000000 && salePrice <= 1000000000) {
            priceRanges["$10.000.000 - $1.000.000.000"]++;
        } else if (salePrice > 1000000000) {
            priceRanges["> $1.000.000.000"]++;
        }

        // Process data for Sales of Residential and Commercial Units by Month (Chart 3)
        if (!residentialUnits[monthYear]) {
            residentialUnits[monthYear] = 0;
        }
        residentialUnits[monthYear] += resUnits;

        if (!commercialUnits[monthYear]) {
            commercialUnits[monthYear] = 0;
        }
        commercialUnits[monthYear] += comUnits;

        // Process data for Total Sales by Building Class Category (Chart 4)
        if (!buildingCategoryCounts[category]) {
            buildingCategoryCounts[category] = 0;
        }
        buildingCategoryCounts[category]++;

        // Process data for Table of Total Sales by Neighborhood (Chart 5)
        if (!salesByNeighborhood[neighborhood]) {
            salesByNeighborhood[neighborhood] = 1;
        } else {
            salesByNeighborhood[neighborhood]++;
        }
    });

    // Prepare data for Total Sales in Each Borough by Month (Chart 1)
    const labels = Array.from(new Set(filteredData.map(item => {
        const saleDate = new Date(item.SALE_DATE);
        return `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
    }))).sort();

    const lineDatasets = Object.keys(salesByBorough).map(borough => {
        return {
            label: borough,
            data: labels.map(label => salesByBorough[borough][label] || 0),
            fill: false,
            borderColor: getRandomColor(),
            tension: 0.1
        };
    });

    // Prepare data for Sales Distribution by Price Range (Chart 2)
    const priceRangeData = {
        labels: Object.keys(priceRanges),
        datasets: [{
            data: Object.values(priceRanges),
            backgroundColor: Object.keys(priceRanges).map(() => getRandomColor())
        }]
    };

    // Prepare data for Sales of Residential and Commercial Units by Month (Chart 3)
    const lineDatat = {
        labels: labels,
        datasets: [
            {
                label: 'Residential Units',
                data: labels.map(label => residentialUnits[label] || 0),
                borderColor: getRandomColor(),
                fill: false,
                tension: 0.1
            },
            {
                label: 'Commercial Units',
                data: labels.map(label => commercialUnits[label] || 0),
                borderColor: getRandomColor(),
                fill: false,
                tension: 0.1
            }
        ]
    };

    // Sort buildingCategoryCounts by count in descending order
    const sortedBuildingCategoryCounts = Object.entries(buildingCategoryCounts).sort((a, b) => b[1] - a[1]);
    const sortedBuildingCategories = sortedBuildingCategoryCounts.map(entry => entry[0]);
    const sortedBuildingCounts = sortedBuildingCategoryCounts.map(entry => entry[1]);

    // Prepare data for Total Sales by Building Class Category (Chart 4)
    const barData = {
        labels: sortedBuildingCategories,
        datasets: [{
            label: null,
            data: sortedBuildingCounts,
            backgroundColor: sortedBuildingCategories.map(() => getRandomColor()),
        }]
    };

    // Prepare data for Table of Total Sales by Neighborhood (Chart 5)
    const tableData = Object.keys(salesByNeighborhood).map(neighborhood => ({
        neighborhood: neighborhood,
        totalSales: salesByNeighborhood[neighborhood]
    }));

    salesData.lineData = { labels, datasets: lineDatasets };
    salesData.lineDatat = lineDatat;
    salesData.barData = barData;
    salesData.priceRangeData = priceRangeData;
    salesData.tableData = tableData;
    return salesData;
}

function responsiveFontSize(chart) {
    let width = chart.width;
    let titleFontSize, legendFontSize, scalesFontSize;

    if (width >= 576 && width <= 1105) {
        titleFontSize = 18;
        legendFontSize = 14;
        scalesFontSize = 12;
    } else if (width <= 575) {
        titleFontSize = 15;
        legendFontSize = 10;
        scalesFontSize = 8;
    } else {
        titleFontSize = 20;
        legendFontSize = 16;
        scalesFontSize = 12;
    }

    if (chart.options.plugins.title.font) {
        chart.options.plugins.title.font.size = titleFontSize;
    } else {
        chart.options.plugins.title.font = { size: titleFontSize };
    }

    if (chart.options.plugins.legend.labels.font) {
        chart.options.plugins.legend.labels.font.size = legendFontSize;
    } else {
        chart.options.plugins.legend.labels.font = { size: legendFontSize };
    }

    if (chart.options.scales) {
        if (chart.options.scales.x && chart.options.scales.x.ticks) {
            if (chart.options.scales.x.ticks.font) {
                chart.options.scales.x.ticks.font.size = scalesFontSize;
            } else {
                chart.options.scales.x.ticks.font = { size: scalesFontSize };
            }
        }

        if (chart.options.scales.y && chart.options.scales.y.ticks) {
            if (chart.options.scales.y.ticks.font) {
                chart.options.scales.y.ticks.font.size = scalesFontSize;
            } else {
                chart.options.scales.y.ticks.font = { size: scalesFontSize };
            }
        }
    }
}

function createLineChart(chartId, lineData) {
    if (lineChart) {
        lineChart.destroy();
    }
    const chartContainer = document.getElementById(chartId).parentNode;

    const ctx = document.getElementById(chartId).getContext('2d');
    lineChart = new Chart(ctx, {
        type: 'line',
        data: lineData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Total Sales in Each Borough by Month',
                    color: 'white',
                    font: { family: 'Libre Baskerville', size: 20 },
                    padding: { top: 10, bottom: 30 }
                },
                legend: {
                    position: 'top',
                    labels: { color: 'white', font: { size: 14 } }
                }
            },
            scales: {
                x: { ticks: { color: 'white', font: { size: 14 } } },
                y: { ticks: { color: 'white', font: { size: 14 } } }
            },
            onResize: (chart) => {
                responsiveFontSize(chart);
                chart.update();
            }
        }
    });
    responsiveFontSize(lineChart);
}

function createBarChart(chartId, barData) {
    if (barChart) {
        barChart.destroy();
    }
    const chartContainer = document.getElementById(chartId).parentNode;

    const ctx = document.getElementById(chartId).getContext('2d');
    barChart = new Chart(ctx, {
        type: 'bar',
        data: barData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Total Sales by Building Class Category',
                    color: 'white',
                    font: { family: 'Libre Baskerville', size: 20 },
                    padding: { top: 10, bottom: 30 }
                },
                legend: { display: false }
            },
            scales: {
                x: { ticks: { color: 'white', font: { size: 14 } } },
                y: { ticks: { color: 'white', font: { size: 14 } } }
            },
            onResize: (chart) => {
                responsiveFontSize(chart);
                chart.update();
            }
        }
    });
    responsiveFontSize(barChart);
}

function createPieChart(chartId, priceRangeData) {
    if (pieChart) {
        pieChart.destroy();
    }

    const chartContainer = document.getElementById(chartId).parentNode;
    const ctx = document.getElementById(chartId).getContext('2d');
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: priceRangeData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Sales Distribution by Price Range',
                    color: '#ffff',
                    font: { family: 'Libre Baskerville', size: 21 },
                    padding: { top: 10, bottom: 30 }
                },
                legend: {
                    position: 'bottom',
                    labels: { color: 'white', font: { size: 14 } }
                }
            }
        }
    });
}

function createUnitsLineChart(chartId, salesData) {
    if (unitsLineChart) {
        unitsLineChart.destroy();
    }
    const chartContainer = document.getElementById(chartId).parentNode;

    const ctx = document.getElementById(chartId).getContext('2d');
    unitsLineChart = new Chart(ctx, {
        type: 'line',
        data: salesData.lineDatat,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Sales of Residential and Commercial Units by Month',
                    color: 'white',
                    font: { family: 'Libre Baskerville', size: 20 },
                    padding: { top: 10, bottom: 30 }
                },
                legend: {
                    position: 'top',
                    labels: { color: 'white', font: { size: 14 } }
                }
            },
            scales: {
                x: { ticks: { color: 'white', font: { size: 14 } } },
                y: { ticks: { color: 'white', font: { size: 14 } } }
            },
            onResize: (chart) => {
                responsiveFontSize(chart);
                chart.update();
            }
        }
    });
    responsiveFontSize(unitsLineChart);
}

function responsiveTableFontSize(tableContainer) {
    let width = tableContainer.Width;
    let titleFontSize, headerFontSize, rowFontSize, paginationFontSize;

    if (width >= 576 && width <= 1105) {
        titleFontSize = 18;
        headerFontSize = 14;
        rowFontSize = 12;
        paginationFontSize = 12;
    } else if (width <= 575) {
        titleFontSize = 15;
        headerFontSize = 12;
        rowFontSize = 10;
        paginationFontSize = 10;
    } else {
        titleFontSize = 20;
        headerFontSize = 16;
        rowFontSize = 14;
        paginationFontSize = 14;
    }

    const title = tableContainer.querySelector('.table-title');
    if (title) {
        title.style.fontSize = `${titleFontSize}px`;
    }

    const tableHeaders = tableContainer.querySelectorAll('th');
    tableHeaders.forEach(header => {
        header.style.fontSize = `${headerFontSize}px`;
    });

    const tableRows = tableContainer.querySelectorAll('td');
    tableRows.forEach(row => {
        row.style.fontSize = `${rowFontSize}px`;
    });

    const paginationButtons = tableContainer.querySelectorAll('.pagination-button, .pagination-container span');
    paginationButtons.forEach(button => {
        button.style.fontSize = `${paginationFontSize}px`;
    });
}

function createTableChart(chartId, tableData) {
    if (tableChart) {
        tableChart.destroy();
    }

    // Sort the data by totalSales in descending order
    tableData.sort((a, b) => b.totalSales - a.totalSales);

    const tableContainer = document.getElementById(chartId).parentNode;

    // Check if the title already exists
    let title = tableContainer.querySelector('.table-title');
    if (!title) {
        // Create the title element
        title = document.createElement('div');
        title.textContent = 'Most Property Sales by Neighborhood';
        title.classList.add('table-title');
        title.style.textAlign = 'center';
        title.style.color = 'white';
        title.style.fontSize = '20px';
        title.style.paddingTop = '35px';
        title.style.fontFamily = 'Libre Baskerville';
        title.style.fontWeight = 'bold';
        // Insert the title before the table
        tableContainer.insertBefore(title, tableContainer.firstChild);
    }

    const table = document.getElementById(chartId);
    let tbody = table.querySelector('tbody');
    if (!tbody) {
        tbody = document.createElement('tbody');
        table.appendChild(tbody);
    }

    const rowsPerPage = 10;
    let currentIndex = 0;

    function displayTableData(data, tbody, startIndex, rowsPerPage) {
        tbody.innerHTML = '';
        const currentPageData = data.slice(startIndex, startIndex + rowsPerPage);
        currentPageData.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.neighborhood}</td>
                <td>${data.totalSales}</td>
            `;
            tbody.appendChild(row);
        });
        addPaginationButtons(data, tbody, startIndex, rowsPerPage);
    }

    function addPaginationButtons(data, tbody, startIndex, rowsPerPage) {
        const paginationContainer = document.querySelector('.pagination-container');
        if (paginationContainer) {
            paginationContainer.remove();
        }

        const newPaginationContainer = document.createElement('div');
        newPaginationContainer.classList.add('pagination-container');
        table.parentNode.appendChild(newPaginationContainer);

        const totalPages = Math.ceil(data.length / rowsPerPage);
        const currentPage = Math.floor(startIndex / rowsPerPage) + 1;

        const pageLabel = document.createElement('span');
        pageLabel.textContent = `${startIndex + 1} - ${Math.min(startIndex + rowsPerPage, data.length)} / ${data.length}`;
        newPaginationContainer.appendChild(pageLabel);

        const prevButton = document.createElement('button');
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.classList.add('pagination-button');
        prevButton.disabled = startIndex === 0;
        prevButton.addEventListener('click', () => {
            const newIndex = Math.max(startIndex - rowsPerPage, 0);
            currentIndex = newIndex;
            displayTableData(data, tbody, newIndex, rowsPerPage);
            responsiveTableFontSize(tableContainer);
        });
        newPaginationContainer.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.classList.add('pagination-button');
        nextButton.disabled = startIndex + rowsPerPage >= data.length;
        nextButton.addEventListener('click', () => {
            const newIndex = Math.min(startIndex + rowsPerPage, data.length - rowsPerPage);
            currentIndex = newIndex;
            displayTableData(data, tbody, newIndex, rowsPerPage);
            responsiveTableFontSize(tableContainer);
        });
        newPaginationContainer.appendChild(nextButton);
    }

    displayTableData(tableData, tbody, currentIndex, rowsPerPage);
    responsiveTableFontSize(tableContainer);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}