const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const db = new sqlite3.Database('./backend/database/books.db');

// Create server
const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  // Handle GET /books
  if (url === '/books' && method === 'GET') {
    db.all("SELECT * FROM Books", [], (err, rows) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
    });
  }
  
  // Handle POST /books
  else if (url === '/books' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const book = JSON.parse(body);
      const { title, authorID, genreID, pages, publishedDate } = book;
      const query = `INSERT INTO Books (Title, AuthorID, GenreID, Pages, PublishedDate) 
                     VALUES (?, ?, ?, ?, ?)`;
      db.run(query, [title, authorID, genreID, pages, publishedDate], function (err) {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
          return;
        }
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ id: this.lastID }));
      });
    });
  }
});

// Start the server
server.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});