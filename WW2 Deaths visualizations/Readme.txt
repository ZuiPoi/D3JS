
------------------Setup-------------------

Index.js should automatically initialize all d3 elements when it is loaded on a browser with no further input needed.

An Internet connection is necessary to obtain some of the dependancies necessary for the map visualizations.



---------------DataSets-----------------------
Both datasets found in /data were made and compiled by me by using data from a a large number of sources.
Datasets are likely not perfectly accurate. This is due to both the sources themselves and lack of time to cross reference on my part.

 
Some of sources include but are not limited to :

Us National archives
British National archives
Historical books
Wikipedia

Map rendering data is sourced In-code from the following addresses:

https://unpkg.com/world-atlas@1.1.4/world/110m.tsv
https://unpkg.com/world-atlas@1.1.4/world/110m.json
----------------Dependencies----------------


--D3--
All necessary D3 files are in the /lib folder:


--Topojson--
Map rendering is done with the use of topojson.min.js

It is sourced in code from: https://unpkg.com/topojson@3.0.2/dist/topojson.min.js




------------NOTE--------------
Not all countries present in the data are visualized on the map related visualizations. Others may not have correct time appropriate names.
This is due to renaming and dissolution of various nations in the aftermath of WWII, and lack of available data for mapping of nations in this period.
