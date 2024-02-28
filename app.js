document.getElementById('addBookButton').addEventListener('click', function() {
    document.getElementById('addBookForm').style.display = 'block';
    document.getElementById('addBookButton').style.display = 'none';
    displayPochList(); // Mostrar la lista de Ma Poch'List cuando se abre el formulario de búsqueda
});

document.getElementById('cancelButton').addEventListener('click', function() {
    document.getElementById('addBookForm').style.display = 'none';
    document.getElementById('addBookButton').style.display = 'block';
    document.getElementById('results').innerHTML = '';
    displayPochList(); // Mostrar la lista de Ma Poch'List cuando se cancela la búsqueda
});

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    var bookTitle = document.getElementById('bookTitle').value;
    var author = document.getElementById('author').value;

    if (bookTitle && author) {
        searchBooks(bookTitle, author);
    }
});

function searchBooks(bookTitle, author) {
    var url = 'https://www.googleapis.com/books/v1/volumes?q=intitle:' + bookTitle + '+inauthor:' + author + '&key=AIzaSyBsN18mHK9jTFtdzXoexOUrowDNX31lVIs';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayResults(data);
            displayPochList(); // Mostrar la lista de Ma Poch'List después de mostrar los resultados de la búsqueda
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(data) {
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    var h = document.createElement('h2');
    h.textContent = "Résultats de recherche";
    h.style.textAlign = "center";
    resultsDiv.appendChild(h);

    if (data.items) {
        data.items.forEach(function(item) {
            var id = item.id;
            var title = item.volumeInfo.title;
            var author = item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Information manquante';
            var description = item.volumeInfo.description ? item.volumeInfo.description.substring(0, 200) : 'Information manquante';
            var image = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'unavailable.png';

            var card = document.createElement('div');
            card.classList.add('card');

            var h3 = document.createElement('h3');
            h3.textContent = title;
            card.appendChild(h3);

            var pId = document.createElement('p');
            pId.textContent = "ID: " + id;
            card.appendChild(pId);

            var pAuthor = document.createElement('p');
            pAuthor.textContent = "Auteur: " + author;
            card.appendChild(pAuthor);

            var pDescription = document.createElement('p');
            pDescription.textContent = "Description: " + description;
            card.appendChild(pDescription);
            var img = document.createElement('img');
            img.src = image;
            img.alt = "Image du livre";
            card.appendChild(img);

            var i = document.createElement('i');
            i.className = "fas fa-bookmark bookmark";
            i.dataset.id = id;
            card.appendChild(i);

            resultsDiv.appendChild(card);
        });

        document.querySelectorAll('.bookmark').forEach(function(button) {
            button.addEventListener('click', function() {
                var id = this.dataset.id;
                addBookToPochList(id);
            });
        });
    } else {
        resultsDiv.textContent = 'Aucun livre n’a été trouvé';
    }
}

function displayPochList() {
    var pochList = JSON.parse(localStorage.getItem('pochList')) || [];
    var pochListDiv = document.getElementById('pochList');
    pochListDiv.innerHTML = '';

    var h = document.createElement('h2');
    h.textContent = "Ma Poch Liste";
    h.style.textAlign = "center";
    pochListDiv.appendChild(h);

    pochList.forEach(function(id) {
        fetchBook(id).then(function(book) {
            var card = document.createElement('div');
            card.classList.add('card');

            var h3 = document.createElement('h3');
            h3.textContent = book.title;
            card.appendChild(h3);

            var pId = document.createElement('p');
            pId.textContent = "ID: " + book.id;
            card.appendChild(pId);

            var pAuthor = document.createElement('p');
            pAuthor.textContent = "Auteur: " + book.author;
            card.appendChild(pAuthor);

            var pDescription = document.createElement('p');
            pDescription.textContent = "Description: " + book.description;
            card.appendChild(pDescription);

            var img = document.createElement('img');
            img.src = book.image;
            img.alt = "Image du livre";
            card.appendChild(img);

            var i = document.createElement('i');
            i.className = "fas fa-trash delete";
            i.dataset.id = book.id;
            card.appendChild(i);

            i.addEventListener('click', function() {
                removeBookFromPochList(id);
                displayPochList();
            });

            pochListDiv.appendChild(card);
        });
    });
}

function addBookToPochList(id) {
    var pochList = JSON.parse(localStorage.getItem('pochList')) || [];
    if (pochList.includes(id)) {
        alert('Vous ne pouvez ajouter deux fois le même livre');
    } else {
        pochList.push(id);
        localStorage.setItem('pochList', JSON.stringify(pochList));
        var book = document.querySelector(`[data-id="${id}"]`).parentNode.cloneNode(true);
        book.querySelector('.bookmark').className = 'fas fa-trash delete';
        book.querySelector('.delete').addEventListener('click', function() {
            removeBookFromPochList(id);
        });
        document.getElementById('pochList').appendChild(book);
    }
}

function removeBookFromPochList(id) {
    var pochList = JSON.parse(localStorage.getItem('pochList'));
    var index = pochList.indexOf(id);
    
    if (index !== -1) {
        pochList.splice(index, 1);
        localStorage.setItem('pochList', JSON.stringify(pochList));
        var book = document.querySelector(`[data-id="${id}"]`);
        book.parentNode.removeChild(book);
        displayPochList();
    }
}

function fetchBook(id) {
    let url = 'https://www.googleapis.com/books/v1/volumes/' + id;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            let book = {
                id: data.id,
                title: data.volumeInfo.title,
                author: data.volumeInfo.authors ? data.volumeInfo.authors[0] : 'Information manquante',
                description: data.volumeInfo.description ? data.volumeInfo.description.substring(0, 200) : 'Information manquante',
                image: data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail : 'unavailable.png'
            };
            return book;
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    let pochList = JSON.parse(localStorage.getItem('pochList')) || [];
    console.log('pochList',pochList)
    displayPochList();
});
