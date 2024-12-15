const bookList = document.getElementById('book-list');

// Fetch and Display Books
function fetchBooks() {
  fetch('http://localhost:5000/books')
    .then(res => res.json())
    .then(data => {
      bookList.innerHTML = '';
      data.forEach(book => {
        const li = document.createElement('li');
        li.innerText = `${book.Title} by Author ${book.AuthorID}`;
        bookList.appendChild(li);
      });
    });
}

// Handle Book Submission
document.getElementById('add-book-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const book = {
    title: document.getElementById('title').value,
    authorID: document.getElementById('authorID').value,
    genreID: document.getElementById('genreID').value,
    pages: document.getElementById('pages').value,
    publishedDate: document.getElementById('publishedDate').value
  };

  fetch('http://localhost:5000/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  })
  .then(() => fetchBooks());
});

// Initial Load
fetchBooks();