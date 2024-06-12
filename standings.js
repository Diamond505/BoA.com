$(document).ready(function() {
    // Define an object to map Steam IDs to driver names
    const steamIdToName = {};

    // Define the points structure
    const pointsMapping = {
        1: 50,
        2: 44,
        3: 40,
        4: 36,
        5: 33,
        6: 30,
        7: 28,
        8: 26,
        9: 24,
        10: 22,
        11: 20,
        12: 19,
        13: 18,
        14: 17,
        15: 16,
        16: 15,
        17: 14,
        18: 13,
        19: 12,
        20: 11,
        21: 10,
        22: 9,
        23: 8,
        24: 7,
        25: 6,
        26: 5,
        27: 4,
        28: 3,
        29: 2,
        30: 1
    };

    function generateStandings(data) {
        const standingsData = {};
        const headers = data[0];
        const driverIndexes = {
            steamId: headers.indexOf('SteamId'),
            firstName: headers.indexOf('FirstName'),
            lastName: headers.indexOf('LastName'),
            position: headers.indexOf('Place')
        };

        // Process the race data and accumulate points
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const steamId = row[driverIndexes.steamId];
            const driverName = `${row[driverIndexes.firstName]} ${row[driverIndexes.lastName]}`;
            const position = parseInt(row[driverIndexes.position]);

            // Update the mapping between Steam IDs and driver names if not already set
            if (!steamIdToName[steamId]) {
                steamIdToName[steamId] = driverName;
            }

            if (!standingsData[steamId]) {
                standingsData[steamId] = { points: 0, driver: driverName };
            }

            // Assign points based on the position using the pointsMapping
            standingsData[steamId].points += pointsMapping[position] || 0; // Default to 0 points if position not in mapping
        }

        return standingsData;
    }

    function calculateOverallStandings(racesData) {
        let overallStandings = {};

        racesData.forEach(raceData => {
            const standingsForRace = generateStandings(raceData);
            Object.entries(standingsForRace).forEach(([steamId, standing]) => {
                if (!overallStandings[steamId]) {
                    overallStandings[steamId] = { points: 0, driver: steamIdToName[steamId] };
                }
                overallStandings[steamId].points += standing.points;
            });
        });

        // Convert the overallStandings object to an array and sort by points
        const standingsArray = Object.values(overallStandings).sort((a, b) => b.points - a.points);

        // Populate the table with the overall standings
        const table = $('#grid-table');
        table.empty();

        const headerRow = $('<tr>').addClass('table-header');
        headerRow.append($('<th>').text('Position'));
        headerRow.append($('<th>').text('Driver'));
        headerRow.append($('<th>').text('Points'));
        table.append(headerRow);

        for (let i = 0; i < standingsArray.length; i++) {
            const standing = standingsArray[i];
            const row = $('<tr>');
            row.append($('<td>').text(i + 1));
            row.append($('<td>').text(standing.driver)); // Display driver name from mapping
            row.append($('<td>').text(standing.points));
            table.append(row);
        }
    }

    // Load all race data
    const racesData = [
        'Results/Barcelona Race R1.csv',
        'Results/Donington Race R2.csv',
        'Results/SilverStone Race 1 R3.csv',
        'Results/SilverStone Race2 R3.csv',
        'Results/Kyalami Race R4.csv',
        'Results/Spa Race R5.csv'
    ];

    const loadedData = [];

    const loadRaceData = () => {
        if (racesData.length === 0) {
            calculateOverallStandings(loadedData);
            return;
        }

        const raceFile = racesData.pop();
        console.log(`Loading ${raceFile}`); // Log which file is being loaded
        $.get(raceFile, function(data) {
            const rows = data.trim().split('\n').map(row => row.split(';'));
            console.log(`Loaded data from ${raceFile}:`, rows); // Log loaded data
            loadedData.push(rows);
            loadRaceData();
        }).fail(function() {
            console.error(`Error: Failed to load CSV file ${raceFile}`);
        });
    };

    loadRaceData();
});

