const svg = d3.select("#my_dataviz1");
const svgL = d3.select("#my_dataviz2");

var width = +svg.attr('width');
var height = +svg.attr('height');
var lastchoice = "";
var isPercent = "";
var title = "";
var countryList= {};

//Margins ----------------------------------------------------------------------------
const margin = {top: 20, right:35, bottom: 20, left:135};
const innerWidth = width - margin.left -margin.right;
const innerHeight = height - margin.top -margin.bottom;

//Bar chart section ------------------------------------------------------------------------------
function renderMil (data, title){
    var titleText = "";
    titleText = title;


    var xValue = d=> d.take;
    const yValue = d=> d.Country;

    const totalDeath = {};

    data.forEach(d=>{
        totalDeath[d.Country] = d.take ;
    });

    //scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth]);

    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    
    //create g
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    //axis
    g.append('g').attr("class", "axisY").call(d3.axisLeft(yScale));
    g.append('g').attr("class", "axisX").call(d3.axisBottom(xScale))
        .attr('transform', `translate(0,${innerHeight})`);;
    

    //title
    g.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px")
        .attr("fill", "white") 
        .text(titleText)
        .attr('transform', `translate(0,${margin.top})`);;
    

    g.selectAll('rect').data(data)
        .enter().append('rect')
            .attr('y', d => yScale(yValue(d)))
            .attr('width', d => xScale(xValue(d)))
            .attr('height',yScale.bandwidth())
            .attr("fill","steelBlue")
            .on("mouseover", function (d) {
                d3.select(this).transition()
                .duration('50')
                .attr("fill","red");

             }).on("mouseout", function (d) {
                d3.select(this).transition()
                .duration('50')
                .attr("fill","steelBlue");

             })
        .append('title')
            .text(d => totalDeath[d.Country]);
             

}

//initialization function
function allThings(){

    d3.csv('./Data/Deaths.csv').then(data=>{
        data.forEach(d =>{
            d.TotalDeath = +d.TotalDeath;
            d.MilDeath = +d.MilDeath;
            d.CivDeath = +d.CivDeath;
            d.take = +d.TotalDeath;
        });
        title = "Total deaths";
        lastchoice = "TotalDeaths";
        renderMil(data, title);
    });

    
}


//Button functionality----------------------------------------------------------------------

//bar chart function 
//takes 2 variables as input based on button presses
function updateData1(choice) {
    if (choice != ""){
        lastchoice = choice;
    }
    option = isPercent;
    svg.selectAll("*").remove();
    svgL.selectAll("*").remove();
    d3.csv('./Data/Deaths.csv').then(data=>{
        
        if ( option =="percent"){

            if(lastchoice =="TotalDeath"){
                data.forEach(d =>{
                    d.take = +d.TotalDeath / d.TotalPop *100;
                    title = "Total deaths as % of country total population";
                });
            }
    
            if(lastchoice =="CivDeath"){
                data.forEach(d =>{
                    d.take = +d.CivDeath / d.TotalPop *100;
                    title = "Civilian deaths as % of country total population";
                }); 
            }
    
            if(lastchoice == "MilDeath"){
                data.forEach(d =>{
                    d.take = +d.MilDeath / d.TotalPop *100;
                    title = "Military deaths as % of country total population";
                    
                });
            }

        }
        else{
            
            if(lastchoice =="TotalDeath"){
                data.forEach(d =>{
                    d.take = +d.TotalDeath;
                    title = "Total deaths";
                });
            }
    
            if(lastchoice =="CivDeath"){
                data.forEach(d =>{
                    d.take = +d.CivDeath;
                    title = "Civilian deaths";
                }); 
            }
    
            if(lastchoice == "MilDeath"){
                data.forEach(d =>{
                    d.take = +d.MilDeath;
                    title = "Military deaths";
                    
                });
            }
        }
        renderMil(data, title);
    });
}
function updatePercent(choice) {
    if (choice =="0"){
        isPercent = "percent";
    }
    else{
        isPercent = "";
    }
    svgL.selectAll("*").remove();
    svg.selectAll("*").remove();
    updateData1(lastchoice);
}

//Display map--------
function updateData5() {
    svgL.selectAll("*").remove();
    svg.selectAll("*").remove();
    mapFunction();
}

//Display map--------
function updateData7() {
    svgL.selectAll("*").remove();
    svg.selectAll("*").remove();
    mapFunction2();
}

//totality-------------
function updateData6(choice) {
    svgL.selectAll("*").remove();
    svg.selectAll("*").remove();
    d3.csv('./Data/Deaths2.csv').then(data=>{
        data.forEach(d =>{
            d.take = +d.total;
        });
        var title = "Total Civilian vs Military";
        renderMil(data, title);
    });
}




//MAP RELATED CODE----------------------------------------------------------------------




  //heatmap
function mapFunction(){

    // Legend generation------------------------------------------------------------------
    var MapKeys = ["0 or unnacounted for", "10000 or less", "100000 to 10000", "500000 to 100000","1000000 to 500000", "Over 1000000"]
    var colors = ["grey", "#9ccc65","#ffcc00","orange","#d6461e","red"]
    var paired = {};
    var xMa = 0;

    while(xMa<MapKeys.length){
        paired[MapKeys[xMa]] = colors[xMa];
        xMa=xMa+1;
    }
    console.log(paired);
    var projectionMerc = d3.geoMercator();
    var path = d3.geoPath().projection(projectionMerc);


    svgL.selectAll("mydots")
    .data(MapKeys)
    .enter()
    .append("circle")
        .attr("cx", 100)
        .attr("cy", function(d,i){ return 100 + i*30}) 
        .attr("r", 7)
        .style("fill", function(d){
            return paired[d];
        })

    // Add one dot in the legend for each name.
    svgL.selectAll("mylabels")
    .data(MapKeys)
    .enter()
    .append("text")
        .attr("x", 120)
        .attr("y", function(d,i){ return 100 + i*30}) 
        .style("fill", function(d){ 
            return paired[d];
        })
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
    

// ACTUAL MAP RELATED CODE
    Promise.all([
        d3.csv('./Data/Deaths.csv'),
        d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'), 
        d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')])
        .then(([deathsCSV,tsvDataSet, jsonDataSet])=>{
            const countries = topojson.feature(jsonDataSet, jsonDataSet.objects.countries);
            const countryName = {};
            const totalDeath = {};
            const countryName2 = {};
            const checker = {};

            tsvDataSet.forEach(d=>{
                countryName[d.iso_n3]= d.name;
                countryName2[d.iso_n3]= d.name;
            });
            
            deathsCSV.forEach(d=>{
                totalDeath[d.Country] = d.TotalDeath;
            });
            
            for (const [key, value] of Object.entries(countryName)) {
                if(value in totalDeath){
                    var x =totalDeath[value];
                    var y = countryName[key];
                    checker[key] = totalDeath[value];
                    y = y.concat("  Total deathsDeaths:    ");
                    y = y.concat(x);
                    countryName[key] = y;
                   
                }
                else{
                    var y = countryName[key];;
                    y = y.concat("  unknown or did not participate");
                    countryName[key] = y;
                    checker[key] = 0;
                }
              }
            
            svg.append("rect")
              .attr("width", "100%")
              .attr("height", "100%")
              .attr("fill", "steelBlue");

            const g = svg.append('g').attr("class", "map");

            //zoom functionality
            function zoomFunction({transform}) {
                    g.attr("transform", transform);
            }

            svg.call(d3.zoom()
                .extent([[0, 0], [width, height]])
                .scaleExtent([1, 5])
                .on("zoom", zoomFunction));


            g.selectAll('path')
                .data(countries.features)
                .enter().append('path')
                    .attr('d',d => path(d))
                    .attr("fill", function (d){
                            if(checker[d.id] == 0){  
                                return "grey";
                                
                            }

                            else{
                                if(checker[d.id] <=10000 && checker[d.id]> 0){  
                                    return "#9ccc65";
                                    
                                }
                                if(checker[d.id] <=100000 && checker[d.id]> 10000){  
                                    return "#ffcc00";
                                    
                                }
                                if(checker[d.id] <=500000 && checker[d.id]> 100000){  
                                    return "orange";
                                    
                                }
                                if(checker[d.id] <=1000000 && checker[d.id]> 500000){  
                                    return "#d6461e";
                                }   
                                if(checker[d.id]> 1000000){  
                                    return "red";
                                    
                                }

                            }

                    })

                    .attr("stroke","black")               
                    .on("mouseover", function (d) {
                        d3.select(this).transition()
                        .duration('50')
                        .attr("fill","purple");

        
                    }).on("mouseout", function (d) {
                        d3.select(this).transition()
                        .duration('50')
                        .attr("fill", function (d){
                            if(checker[d.id] == 0){  
                                return "grey";
                                
                            }

                            else{
                                if(checker[d.id] <10000 && checker[d.id]> 0){  
                                    return "#9ccc65";
                                    
                                }
                                if(checker[d.id] <100000 && checker[d.id]> 0){  
                                    return "#ffcc00";
                                    
                                }
                                if(checker[d.id] <1000000 && checker[d.id]> 0){  
                                    return "orange";
                                    
                                }
                                if(checker[d.id]> 1000000){  
                                    return "red";
                                    
                                }

                            }

                    })
        
                    })
                .append('title')
                    .text(d => countryName[d.id]);
        });

}

//Map with circles
function mapFunction2(){

    var projectionMerc = d3.geoMercator();
    var path = d3.geoPath().projection(projectionMerc);

    Promise.all([
        d3.csv('Deaths.csv'),
        d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'), 
        d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')])
        .then(([deathsCSV,tsvDataSet, jsonDataSet])=>{
            const countries = topojson.feature(jsonDataSet, jsonDataSet.objects.countries);
            const countryName = {};
            const totalDeath = {};
            const countryName2 = {};
            const checker = {};
            
            var xValue = d=> d.TotalDeath;
            const circleScaler = d3.scaleSqrt();

            circleScaler.domain([0, d3.max(deathsCSV, xValue)])
            .range([0,3]);

                // Size basedLegend generation------------------------------------------------------------------
                function legendCreate(selection){
                    var textOffset= 120;
                    var spaces = 50;
                    var tickSet =  [10000000,10000000,1000000,500000,100000, 10000]

                    console.log(tickSet);
                    var sets = svgL.selectAll('g').data(tickSet);
                    const setEnter = sets
                    .enter().append('g')
                    .attr('class', 'tick');
    
                setEnter
                    .merge(sets)
                    .attr('transform', (d, i) =>
                        `translate(0, ${i * spaces})`
                    );
    
                sets.exit().remove();
                
                setEnter.append('circle')
                    .merge(sets.select('circle'))
                    .attr('r', circleScaler)
                    .attr('fill', "blue")
                    .attr("cx", 100) ;
                
                    setEnter.append('text')
                    .merge(sets.select('text'))
                    .text(d => d + "    Deaths")
                    .attr('x', d => circleScaler(d) + textOffset);
                    }

                //add the legend
                svgL.append('g')
                    .call(legendCreate,{})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle");

            // map rendering
            tsvDataSet.forEach(d=>{
                countryName[d.iso_n3]= d.name;
                countryName2[d.iso_n3]= d.name;
            });
            
            deathsCSV.forEach(d=>{
                totalDeath[d.Country] = d.TotalDeath;
            });
            
            for (const [key, value] of Object.entries(countryName)) {
                if(value in totalDeath){
                    var x =totalDeath[value];
                    var y = countryName[key];
                    checker[key] = totalDeath[value];
                    y = y.concat("  Total Deaths:    ");
                    y = y.concat(x);
                    countryName[key] = y;
                   
                }
                else{
                    var y = countryName[key];;
                    y = y.concat("  unknown or did not participate");
                    countryName[key] = y;
                    checker[key] = 0;
                }
              }
            svg.append("rect")
              .attr("width", "100%")
              .attr("height", "100%")
              .attr("fill", "steelBlue");

            const g = svg.append('g');

            //zoom functionality
            function zoomFunction({transform}) {
                    g.attr("transform", transform);
            }

            svg.call(d3.zoom()
                .extent([[0, 0], [width, height]])
                .scaleExtent([1, 5])
                .on("zoom", zoomFunction));

            g.selectAll('path')
                .data(countries.features)
                .enter().append('path')
                    .attr('d',d => path(d))
                    .attr("fill", function (d){
                            if(checker[d.id] == 0){  
                                return "grey";
                                
                            }

                            else{
                                return "green";

                            }

                    })
                    .attr("stroke","black");

            g.selectAll('circle').data(countries.features)
                .enter().append('circle')
                    .attr("cx",d => projectionMerc(d3.geoCentroid(d))[0])
                    .attr('cy',d => projectionMerc(d3.geoCentroid(d))[1])
                    .attr("r",d => circleScaler(checker[d.id]))
                    .attr("fill", "blue")
                    .attr("opacity", "0.6")
                    .on("mouseover", function (d) {
                        d3.select(this).transition()
                        .duration('50')
                        .attr("fill","purple");

        
                    }).on("mouseout", function (d) {
                        d3.select(this).transition()
                        .duration('50')
                        .attr("fill", "blue")
        
                    })    
                .append("title")
                    .text(d => countryName[d.id]);
        });



}


//initialize
allThings();
//doubleTest();
