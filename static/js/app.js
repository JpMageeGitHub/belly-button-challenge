


// Designate the query URL and call/log the data
query_url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

d3.json(query_url).then(function(data) {
    console.log(data);
  
    // Populate the Dropdown menu
    const names = data.names;
    names.forEach(name => {
      const option = d3.select("#selDataset").append("option");
      option.text(name);
      option.attr("value", name);
    });
  
    const metadata = data.metadata;
  
    function makeMeta(sample) {
      // Clear any gross existing metadata
      d3.select("#sample-metadata").html("");
  
      const panel = d3.select("#sample-metadata");
      panel.html("");
      Object.entries(sample).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });
    }
  
    
  
    // Extract needed samples
    const samples = data.samples;
  
    // Function to create chart using Plotly
    function makeChart(sample) {
      // Prepare our Data
      const { otu_ids, sample_values, otu_labels } = sample;
      const sampleData = otu_ids.map((otu_id, index) => {
        return {
          otu_id,
          sample_value: sample_values[index],
          otu_label: otu_labels[index]
        };
      });
  
  
      // Sort and filter largest 10 samples
      const sortedData = sampleData.sort((a, b) => b.sample_value - a.sample_value).slice(0, 10);
      sortedData.reverse();
      
      // Prepare data for Plotly bar chart
      const barTrace = {
        x: sortedData.map(d => d.sample_value),
        y: sortedData.map(d => ` OTU ${d.otu_id} `),
        text: sortedData.map(d => d.otu_label),
        type: "bar",
        orientation: 'h'
      };
  
      // Layout for Plotly bar chart
      const barLayout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU ID" }
      };
  
      // Prepare data for Plotly bubble chart
      const bubbleTrace = {
        x: sampleData.map(d => d.otu_id),
        y: sampleData.map(d => d.sample_value),
        text: sampleData.map(d => d.otu_label),
        mode: "markers",
        marker: {
          size: sampleData.map(d => d.sample_value),
          color: sampleData.map(d => d.otu_id)
        }
      };
  
      // Simple layout for Plotly bubble chart
      const bubbleLayout = {
        title: "OTU IDs",
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Value" }
      };
  
      // Create Plotly chart
      Plotly.newPlot("bar", [barTrace], barLayout);
      Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
    }
  
    // Seed initial data for plot/page load
    makeChart(samples[0]);
    makeMeta(metadata[0]);
  
    // Update plot on dropdown
    d3.select("#selDataset").on("change", function() {
      const selectedID = this.value;
      const selectedSample = samples.find(sample => sample.id === selectedID);
      const selectedMetadata = metadata.find(sample => sample.id === parseInt(selectedID));
      makeChart(selectedSample);
      makeMeta(selectedMetadata);
    });
  });