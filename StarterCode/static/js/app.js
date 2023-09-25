


// Designate the query URL and call/log the data
query_url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

d3.json(query_url).then(function(data) {
    console.log(data);
});
let names = data.names;

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
function createBarGraph(data) {

    var index = []
    var labels = []
    var values = []

    for (n in data.samples[0].otu_ids.slice(0,10)) {

        index.push(n);
        labels.push(`OTU ${data.samples[0].otu_ids[n]}`);
        values.push(data.samples[0].sample_values[n]);

    }

    var trace = {
        x : values.reverse(),
        y: labels.reverse(),
        type : 'bar',
        orientation: 'h'
    }

    var data = [trace];

    var layout = {
        title: "Top 10 OTUs by subject ID",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar", data, layout);
};


var dropdown = d3.select("#selDataset");

dropdown.on("change", function() {
    var selectedValue = d3.select(this).property("value");
    createBarGraph(data[selectedValue]);
});



