 
//Skapar en sql-databas som endast existerar i minnet och försvinner då sidan stängs ned
alasql("Create database test_database");
alasql("use test_database");

//Skapar tabeller redo för inmatning av data
alasql("CREATE TABLE diagnos (id int, year int, kvartal int, diagnos_kod string, diagnos_text string, antal int, andel float, antal_kvinnor int, andel_kvinnor float, antal_man int, andel_man float)");
alasql("CREATE TABLE healthcare (id int, nr_rapp int, name_long string, geo_cat string, type_value string, value_amount float, year int, sex string)");

// Inläsning till sql från data_diagnos
for (var i = 0; i < data_diagnos.length; i++) {
     alasql("INSERT INTO diagnos VALUES (" + i + ",'"
     + data_diagnos[i].ar + "',"
     + data_diagnos[i].kvartal + ",'"
     + data_diagnos[i].diagnoskapitel_kod + "','"
     + data_diagnos[i].diagnoskapitel_text + "','"
     + data_diagnos[i].antal + "','"
     + data_diagnos[i].andel + "','"
     + data_diagnos[i].antal_kvinnor + "','"
     + data_diagnos[i].andel_kvinnor + "','"
     + data_diagnos[i].antal_man + "','"
     + data_diagnos[i].andel_man + "')");
}

// Inläsning till sql från data_healthcare
for (var i = 0; i < data_healthcare.length; i++) {
     if ([1,2,4,5,16,42,47,48].includes(data_healthcare[i].nr_rapp)) {
          alasql("INSERT INTO healthcare VALUES (" + i + ","
          + data_healthcare[i].nr_rapp + ",'"
          + data_healthcare[i].name_long + "','"
          + data_healthcare[i].geo_cat + "','"
          + data_healthcare[i].type + "',"
          + data_healthcare[i].value + ",'"
          + Number(data_healthcare[i].period) + "','"
          + data_healthcare[i].sex_all + "')");
     }
}     

// Hämtar data en standard query för att kunna visa upp i graphen då sidan startar första gången

data_var = alasql("SELECT * FROM healthcare where geo_cat = 'Stockholm'");
x_var = [];
y_var = [];
for (var i = 0; i < data_var.length; i++)  {
     x_var.push(data_var[i]["year"]);
     y_var.push(data_var[i]["value_amount"]);
}

var data_histo_price = [{
     x: x_var,
     y: y_var,
     type: 'bar',
}];

var layout_price = {
     title: "Value amount",
     xaxis: {title: "Year"},
     yaxis: {title: "Value"},
}

histo_price = document.getElementById('barchart');  
Plotly.plot(histo_price, data_histo_price, layout_price);  


// Sätter standardvärden för text-fälten

var x = document.getElementById("year_min");
x.setAttribute("value", 2012);
document.body.appendChild(x);

var x = document.getElementById("year_max");
x.setAttribute("value", 2018);
document.body.appendChild(x);

var x = document.getElementById("name");
x.setAttribute("value", "Stockholm");
document.body.appendChild(x);


//Query funktion som hämtar data från sql baserat på data från användarparametrarna
function displayData() {

     //Hämtar värden från användarsval GUI
     var input_year_min = document.getElementById("year_min").value;
     var input_year_max = document.getElementById("year_max").value;
     var input_name = document.getElementById("name").value;
     input_name = input_name.replace(/ä/gi,'a');
     input_name = input_name.replace(/å/gi,'a');
     input_name = input_name.replace(/ö/gi,'o');

     var input_rapp = document.getElementById("mySelect").value;
     var input_sex = document.getElementById("mySex").value;

     //Gör olika sql-query baserat på användar parameterna
     //Ifall alla rapporter eller alla områden skall hämtas kan inte samma string till sql-queryn användas och därav flera if-satser för att skilja på de.
     if (input_rapp == 0 && input_name == "") {
          data_var = alasql("SELECT * FROM healthcare WHERE year >= " + input_year_min + "and year <= " + input_year_max + " and sex = '" + input_sex + "'");
     } else if (input_rapp == 0) {
          data_var = alasql("SELECT * FROM healthcare WHERE year >= " + input_year_min + "and year <= " + input_year_max + " and geo_cat = '" + input_name + "'" + " and sex = '" + input_sex  + "'");
     } else if (input_name == "") {
          data_var = alasql("SELECT * FROM healthcare WHERE year >= " + input_year_min + "and year <= " + input_year_max + " and nr_rapp = " + input_rapp + " and sex = '" + input_sex  + "'");
     } else {
          data_var = alasql("SELECT * FROM healthcare WHERE year >= " + input_year_min + "and year <= " + input_year_max + " and geo_cat = '" + input_name + "' and nr_rapp = " + input_rapp + " and sex = '" + input_sex + "'");
     }
     
     //Delar upp datat till graphens x- och y-variabler
     x_var = [];
     y_var = [];
     for (var i = 0; i < data_var.length; i++)  {
          x_var.push(data_var[i]["year"]);
          y_var.push(data_var[i]["value_amount"]);
     }
     
     var data_histo_price = [{
          x: x_var,
          y: y_var,
          type: document.getElementById("myGraph").value,
     }];

     histo_price = document.getElementById('barchart');               
     Plotly.react(histo_price, data_histo_price, layout_price);                   
}