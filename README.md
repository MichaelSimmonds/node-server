# README

This is a project that takes data from an websocket on port 8080 and stores the data in a mongodb database. It currently uses JS to refresh the page every 1000ms. This queries the database and displays 10 most recent values

_relevant files_

* socket.io reciever, db insertions -> app.js
* Mongodb query and http routing -> routes.index.js
* View -> views/index.jade
* JS for view refresh -> public/javascripts/socketIn.js
