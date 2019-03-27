 /*
var db = new alasql.Database("database_test");
db.exec("CREATE TABLE example (a INT, b INT)");

// You can insert data directly from javascript object...
db.tables.example.data = [ 
    {a:5,b:6},
    {a:3,b:4}
];

// ...or you can insert data with normal SQL 
db.exec("INSERT INTO example VALUES (1,3)");

var res = db.exec("SELECT * FROM example ORDER BY b DESC");
console.table(res);
// res now contains this array of objects:
// [{a:1,b:3},{a:3,b:4},{a:3,b:4}]


alasql("Create database test_database");
alasql("use test_database");
alasql("CREATE TABLE test (language INT, hello STRING)");
alasql("INSERT INTO test VALUES (1,'Hello!')");
console.table(alasql("SELECT hello FROM test WHERE language > 1"));
text_var = alasql("SELECT language FROM test WHERE language > 1");
*/

/*
diagnos_var = [];
for (var i = 0; i < data_sick.length; i++) {
    if (toString(data_sick[i].diagnoskapitel_kod) !== null) {
        diagnos_var.push(data_sick[i].diagnoskapitel_kod);
    }
    else {
        diagnos_var.push(" ");
    }
}
*/

alasql("Create database test_database");
alasql("use test_database");

alasql("CREATE TABLE diagnos (id int, year int, kvartal int, diagnos_kod string, diagnos_text string, antal int, andel float, antal_kvinnor int, andel_kvinnor float, antal_man int, andel_man float)");

alasql("CREATE TABLE healthcare (id int, name_long string, geo_cat string, type_value string, value_amount float, period datetime, sex string)");
/*
// Inläsning till sql av data_diagnos
for (var i = 0; i < data_diagnos.length; i++) {
  alasql("INSERT INTO diagnos VALUES (" + i + ",'"
  + Number(data_diagnos[i].ar) + "',"
  + Number(data_diagnos[i].kvartal) + ",'"
  + data_diagnos[i].diagnoskapitel_kod + "','"
  + data_diagnos[i].diagnoskapitel_text + "','"
  + Number(data_diagnos[i].antal) + "','"
  + Number(data_diagnos[i].andel) + "','"
  + Number(data_diagnos[i].antal_kvinnor) + "','"
  + Number(data_diagnos[i].andel_kvinnor) + "','"
  + Number(data_diagnos[i].antal_man) + "','"
  + Number(data_diagnos[i].andel_man) + "')");
}
*/

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
     alasql("INSERT INTO healthcare VALUES (" + i + ",'"
     + data_healthcare[i].name_long + "','"
     + data_healthcare[i].geo_cat + "','"
     + data_healthcare[i].type + "',"
     + data_healthcare[i].value + ",'"
     + Number(data_healthcare[i].period) + "','"
     + data_healthcare[i].sex_all + "')");
}     

// skriv data

text_var = alasql("SELECT * FROM diagnos");
text_list = [];
review_var = [];
for (var i = 0; i < text_var.length; i++)  {
     text_list.push(text_var[i]["year"]);
     review_var.push(text_var[i]["antal"]);
}

//Diagnos

var data_histo_price = [{
     x: text_list,
     y: review_var,
     mode: 'markers',
     type: 'scatter',
}];

var layout_price = {
     title: "Historigram Price",
     xaxis: {title: "Price"},
     yaxis: {title: "Count"},
}

histo_price = document.getElementById('histogram_price');  
Plotly.plot(histo_price, data_histo_price, layout_price);  

//Healthcare
text_var = alasql("SELECT * FROM healthcare");
text_list = [];
review_var = [];
for (var i = 0; i < text_var.length; i++)  {
  text_list.push(text_var[i]["period"]);
  review_var.push(text_var[i]["value_amount"]);
}

var data_histo_guest = [{
     x: text_list,
     y: review_var,
     mode: 'markers',
     type: 'scatter',
     }];
  
var layout_guest = {
     title: "Historigram Price",
     xaxis: {title: "Price"},
     yaxis: {title: "Count"},
}

histo_guest = document.getElementById('histogram_guest');  
Plotly.plot(histo_guest, data_histo_guest, layout_guest); 


// Knapptryckning

var x = document.getElementById("name");
x.setAttribute("value", 2006);
document.body.appendChild(x);

function displayDate() {

     var input = document.getElementById("name").value;

     text_var = alasql("SELECT * FROM diagnos WHERE year = " + input);
     text_list = [];
     review_var = [];
     for (var i = 0; i < text_var.length; i++)  {
          text_list.push(text_var[i]["year"]);
          review_var.push(text_var[i]["antal"]);
     }

     var data_histo_price = [{
     x: text_list,
     y: review_var,
     mode: 'markers+lines',
     type: 'scatter',
     }];

     histo_price = document.getElementById('histogram_price');               
     Plotly.react(histo_price, data_histo_price, layout_price);                   
}