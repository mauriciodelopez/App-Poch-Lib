// Event listener pour montrer le formulaire de recherche quand se fait clic dans le bouton "Ajouter un livre"
document.getElementById('addBookButton').addEventListener('click', function() {
    // Montrer le formulaire de recherche
    document.getElementById('addBookForm').style.display = 'block';
    // Cacher le bouton "Ajouter un livre"
    document.getElementById('addBookButton').style.display = 'none';
    // Montrer la liste de Ma Poch'List lorsque s'ouvre le formulaire de recherche
});

// Event listener pour cacher le formulaire de recherche quand se fait clic dans le bouton "Annuler"
document.getElementById('cancelButton').addEventListener('click', function() {
    // Cacher le formulaire de recherche
    document.getElementById('addBookForm').style.display = 'none';
    // Montrer le bouton "Ajouter un livre"
    document.getElementById('addBookButton').style.display = 'block';
    // Nettoyer les resultats de recherche lorsque la recherche est annulée
    document.getElementById('results').innerHTML = '';//
    // Montrer la liste de Ma Poch'List lorsque la recherche est annulée
});

// Event listener pour la recherche de livres lorsque il est envoyé le formulaire de recherche
document.getElementById('searchForm').addEventListener('submit', function(event) {
    // Eviter l'envoie du formulaire
    event.preventDefault(); 
    
    // Obtenir le titre et l'author du livre inserés par l'utilisateur
    var bookTitle = document.getElementById('bookTitle').value;
    var author = document.getElementById('author').value;

    // Vérifier si un titre et un author ont été insérés 
    if (bookTitle && author) {
        // Réaliser la recherche des livres
        searchBooks(bookTitle, author);
    }
});

// Function pour faire la recherce des livres
function searchBooks(bookTitle, author) {
    // Construire l' URL de l' API de Google Books pour la recherche de livres
    var url = 'https://www.googleapis.com/books/v1/volumes?q=intitle:' + bookTitle + '+inauthor:' + author + '&key=AIzaSyBsN18mHK9jTFtdzXoexOUrowDNX31lVIs';

    // Faire la demande à l'API Google Books 
    fetch(url)//
        .then(response => response.json())
        .then(data => {
            // Montrer les résultats de la recherche
            displayResults(data);
            // Montrer la liste de Ma Poch'List après avoir montré les résultatds de la recherche
            displayPochList();
        })
        .catch(error => console.error('Error:', error));
}

// Function pour montrer les résultats de la recherche de livres
function displayResults(data) {
    // Obtenir l'élément HTML où se montreront les résultats
    var resultsDiv = document.getElementById('results');
    // Nettoyer les résultats précedants
    resultsDiv.innerHTML = '';
    // Créer un en-tête pour les résultats
    var h = document.createElement('h2');
    h.textContent = "Résultats de recherche";
    h.style.textAlign = "center";
    resultsDiv.appendChild(h);

    // Vérifiez si des livres ont été trouvés
    if (data.items) {
        // Parcourez chaque livre trouvé
        data.items.forEach(function(item) {
            // Obtenir les détails du livre
            var id = item.id;
            var title = item.volumeInfo.title;
            var author = item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Information manquante';
            var description = item.volumeInfo.description ? item.volumeInfo.description.substring(0, 200) : 'Information manquante';
            var image = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'unavailable.png';

            // Créer un élément de carte pour le livre
            var card = document.createElement('div');
            card.classList.add('card');

            // Ajouter les détails du livre à la carte
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

            // Ajouter la fiche du livre aux résultats de la recherche
            resultsDiv.appendChild(card);
        });

        // Ajouter event listener aux bouttons des favoris
        document.querySelectorAll('.bookmark').forEach(function(button) {
            button.addEventListener('click', function() {
                // Ajouter le livre à Ma Poch'List lorsque le bouton favori est cliqué
                var id = this.dataset.id;
                addBookToPochList(id);
            });
        });
    } else {
        // Afficher un message si aucun livre n'a été trouvé
        resultsDiv.textContent = 'Aucun livre n’a été trouvé';
    }
}

// Fonction pour afficher la liste Ma Poch'List
function displayPochList() {
    // Récuperer la liste de Ma Poche'List depuis le stockage local
    var pochList = JSON.parse(localStorage.getItem('pochList')) || [];
    // Récupère l'élément HTML où sera montré la liste de Ma Poch'List
    var pochListDiv = document.getElementById('pochList');
    // Effacer la liste de Ma Poch'List, si besoin un message pourra être personnalisé entre apostrophes
    pochListDiv.innerHTML = '';

    // Créer un en-tête pour la liste de Ma Poch'List
    var h = document.createElement('h2');
    h.textContent = "Ma Poch Liste";
    h.style.textAlign = "center";
    pochListDiv.appendChild(h);

    // Verifier si il ya des livres dans  Ma Poch'List
    if (pochList.length > 0) {
        // Iterer sur chaque livre dans Ma Poch'List
        pochList.forEach(function(id) {
            // Obtenir les détails du livre et créer une card pour chaque livre dans Ma Poch'List 
            fetchBook(id).then(function(book) {
                // Créer un élément de carte pour le livre
                var card = document.createElement('div');
                card.classList.add('card');

                // Ajouter les détails du livre à la carte
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
                pDescription.textContent = "Description: " + book.description.replace(/<br>/g, '\n');
                card.appendChild(pDescription);

                var img = document.createElement('img');
                img.src = book.image;
                img.alt = "Image du livre";
                card.appendChild(img);

                var i = document.createElement('i');
                i.className = "fas fa-trash delete";
                i.dataset.id = book.id;
                card.appendChild(i);

                // Ajouter event listener pour eliminer le livre de Ma Poch'List
                i.addEventListener('click', function() {
                    removeBookFromPochList(id);
                });

                // Ajouter la fiche du livre à la liste de Ma Poch'List
                pochListDiv.appendChild(card);
            });
        });
    } else {
        // !!!Optinnel message à montrer dans le cas s'il n'y a pas de livres dans Ma Poch'List
        var noBooksMessage = document.createElement('p');
        noBooksMessage.textContent = '';
        noBooksMessage.style.textAlign = "center";
        pochListDiv.appendChild(noBooksMessage);
    }
}

// Fonction pour ajouter un livre a Ma Poch'List
function addBookToPochList(id) {
    // Obtenir la liste de Ma Poch'List du stockage local
    var pochList = JSON.parse(localStorage.getItem('pochList')) || [];
    // Vérifier si le livre est déjà dans Ma Poch'List
    if (pochList.includes(id)) {
        alert('Vous ne pouvez ajouter deux fois le même livre');
    } else {
        // Ajouter le livre a Ma Poch'List
        pochList.push(id);
        localStorage.setItem('pochList', JSON.stringify(pochList));
        // Cloner l'élement de la carte de livre et actualiser le bouton a un bouton de suppresion
        var book = document.querySelector(`[data-id="${id}"]`).parentNode.cloneNode(true);
        book.querySelector('.bookmark').className = 'fas fa-trash delete';
        // Ajouter event listener pour pouvoir le livre de Ma Poch'List
        book.querySelector('.delete').addEventListener('click', function() {
            removeBookFromPochList(id);
        });
        // Ajouter le livre à la lista de Ma Poch'List
        document.getElementById('pochList').appendChild(book);
    }
}

// Function pour éliminer un livre de Ma Poch'List
function removeBookFromPochList(id) {
    // Obtenir la liste de Ma Poch'List du local Storage
    var pochList = JSON.parse(localStorage.getItem('pochList'));
    // Obtenir l'índex du livre dans Ma Poch'List
    var index = pochList.indexOf(id);
    
    // Verifier si le livre à été trouvé dans Ma Poch'List
    if (index !== -1) {
        // Eliminer le livre de Ma Poch'List
        pochList.splice(index, 1);
        localStorage.setItem('pochList', JSON.stringify(pochList));
        // Eliminer le livre de la liste de Ma Poch'List dans l'interface et actualiser la liste de Ma Poch'List
        var book = document.querySelector(`[data-id="${id}"]`);
        book.parentNode.removeChild(book);
        displayPochList();
    }
}

// Fonctionnalité pour obtenir les détails d'un livre en utilisant son  ID "identifiant"
function fetchBook(id) {
    // Construire l'URL pour obtenir les details du livre par son ID
    let url = 'https://www.googleapis.com/books/v1/volumes/' + id;

    // Faire la demande à l'API Google Books
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            // Créer un objet de livre avec les details obtenus de l'API
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

// Funtion que s execute quand le DOM a été complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Obtenir et afficher la liste Ma Poch'List au chargement de la page
    displayPochList();
});