# Grupparbete
Vård och hälsa

Beskrivning av filer och dess användning:

Amcharts4 - folder
Ett tillägg som används för att skapa en Kart-graf
Importer i Database.html
Map.js använder amcharts4

dist innehåller alasql.js
Alasql används för att bygga ett intern sql-databas som enkel query-funktion av databas

Geodata - folder
Används av Amchart4 för att hämta json-fil med punktdata av polygons så att en kartgraf kan generatas

Convert_diagnos och Convert_healtcare
Är json filer som är konverterade från csv-filerna "Datalista-En-god-vard" samt "pag-sjp-diagnos-hela-sverige"
Detta för enkel inläsning till sql i programmet.

Ploty-latest.min.js
Används för graph-generering

Database.js
Läser in datat till sql samt skapade bar/scatter-plot grapherna

Map.js bygger kart-grafen och kallar på funktion DisplayData() i Database.js -filen