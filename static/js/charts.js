function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("https://raw.githubusercontent.com/labinskin/Belly_Button_Biodiversity/main/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("https://raw.githubusercontent.com/labinskin/Belly_Button_Biodiversity/main/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("https://raw.githubusercontent.com/labinskin/Belly_Button_Biodiversity/main/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    var metaData = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var buildArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    var result = buildArray[0];

    var buildArray1 = metaData.filter(sampleObj1 => sampleObj1.id == sample);
    var result2 = buildArray1[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    var wfreq = parseInt(result2.wfreq);

    var gauge_data = [
      {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: { text: "Washing Frequency (Times per Week)" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
              bar: {color: 'white'},
              axis: { range: [null, 10] },
              steps: [
                  { range: [0, 2], color: 'red' },
                  { range: [2, 4], color: 'orange' },
                  { range: [4,6], color: 'yellow' },
                  { range: [6,8], color: 'GreenYellow' },
                  { range: [8, 10], color: 'green' },
              ],
              threshold: {
                  line: { color: "white" },
              }
          }
      }
  ];
  
  // Define Plot layout
  var gauge_layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };
  
  // Display plot
  Plotly.newPlot('gauge', gauge_data, gauge_layout);// 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var bubbleData = [
      {  
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
  
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Culture Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
    };
  
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {t: 30, l: 150}
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  });
  };
