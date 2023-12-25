let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"

let countyData
let educationData
let statesData

let tooltip = d3.select("#tooltip")
let canvas = d3.select("#canvas")
                .style("min-width", 1000 + "px")
                .style("min-height", 600 + "px")

let drawMap = () => {

    canvas.selectAll("path")
            .data(countyData)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("class", "county")
            .attr("fill", (countyDataItem) => {
                let id = countyDataItem["id"]
                let county = educationData.find((item) => {
                    return item["fips"] === id 
                })
                let percentage = county["bachelorsOrHigher"]
                console.log()
                let minPercentage = d3.min(educationData, (item) => {
                    return item["bachelorsOrHigher"]
                })

                let maxPercentage = d3.max(educationData, (item) => {
                    return item["bachelorsOrHigher"]
                })

                let colorScale = ["#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"]

                if (percentage >= minPercentage && percentage <= 11.6625) {
                    return colorScale[0]
                } else if (percentage >= 11.6625 && percentage <= 20.725) {
                    return colorScale[1]
                } else if (percentage >= 20.725 && percentage <= 29.7875) {
                    return colorScale[2]
                } else if (percentage >= 29.7875 && percentage <= 38.85) {
                    return colorScale[3]
                } else if (percentage >= 38.85 && percentage <= 47.9125) {
                    return colorScale[4]
                } else if (percentage >= 47.9125 && percentage <= 56.975) {
                    return colorScale[5]
                } else if (percentage >= 56.975 && percentage <= 66.0375) {
                    return colorScale[6]
                } else if (percentage >= 66.0375 && percentage <= 75.1) {
                    return colorScale[7]
                } else {
                    return "nothing"
                }
            })
            .attr("data-fips", (countyDataItem) => {
                return countyDataItem["id"]
            })
            .attr("data-education", (countyDataItem) => {
                let id = countyDataItem["id"]
                let county = educationData.find((item) => {
                    return item["fips"] === id 
                })
                let percentage = county["bachelorsOrHigher"]
                return percentage
            })
            .on("mouseover", (event, countyDataItem) => {

                let id = countyDataItem["id"]
                let county = educationData.find((item) => {
                    return item["fips"] === id 
                })

                tooltip.style("opacity", 0.9)
                tooltip.style("border-radius", 15 + "px")
                tooltip
                .html(
                    "<p>" +
                        county["area_name"] + " - " + county["state"] + ": " + county["bachelorsOrHigher"] + "%" +
                    "</p>"
                    )
                .attr("data-education", county["bachelorsOrHigher"])
                .style("left", event.pageX + 15 + "px")
                .style("top", event.pageY - 40 + "px")
            })
            .on("mouseout", (item) => {
                tooltip.style("opacity", 0)
            })

            let legendWidth = 600; 
            let legendHeight = 80; 

            let legend = canvas.append("g")
                .attr("id", "legend")
                .attr("width", legendWidth)
                .attr("height", legendHeight)
                .attr("transform", "translate(600, 40)");

            let legendValues = [2.60, 11.6625, 20.725, 29.7875, 38.85, 47.9125, 56.975, 66.0375, 75.10];
            let colorScale = ["#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"];

            legend.selectAll("rect")
                .data(colorScale)
                .enter()
                .append("rect")
                .attr("x", (d, i) => i * 30) 
                .attr("width", 30)  
                .attr("height", 10)  
                .attr("fill", d => d);

            let xAxisScale = d3.scaleLinear()
                .domain([legendValues[0], legendValues[legendValues.length - 1]])
                .range([0, colorScale.length * 30])

            let tickValues = legendValues.slice(0, legendValues.length);

            let xAxis = d3.axisBottom(xAxisScale)
                            .tickValues(tickValues)
                            .tickSizeInner(15)  
                            .tickSizeOuter(0);

            legend.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0, 0)") 
                .call(xAxis)
                .select(".domain")
                .remove()

            legend.selectAll(".tick text")
                .text(d => d.toFixed(0) + "%")
                .style("font-size", 12 + "px");
            
            canvas.append("path")
                    .datum(statesData)
                    .attr('class', 'states')
                    .attr('d', path);
}

d3.json(countyURL).then(
    (data, error) => {
        if (error) {
            console.log(error)
        } else {
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)