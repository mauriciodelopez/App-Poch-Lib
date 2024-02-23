
//the best

//Cette partie du code ajoute un écouteur d'événements au bouton "addBookButton". Lorsque ce bouton est cliqué, le formulaire d'ajout de livre (addBookForm) est affiché et le bouton lui-même est caché.
document.getElementById('addBookButton').addEventListener('click', function() {
    document.getElementById('addBookForm').style.display = 'block';
    document.getElementById('addBookButton').style.display = 'none';
});
//Cette partie du code ajoute un écouteur d'événements au bouton "cancelButton". Lorsque ce bouton est cliqué, le formulaire d'ajout de livre est caché, le bouton d'ajout de livre est affiché et les résultats de la recherche précédente sont effacés.
document.getElementById('cancelButton').addEventListener('click', function() {
    document.getElementById('addBookForm').style.display = 'none';
    document.getElementById('addBookButton').style.display = 'block';
    document.getElementById('results').innerHTML = '';
});
//Cette partie du code ajoute un écouteur d'événements au formulaire de recherche. Lorsque le formulaire est soumis, il empêche la soumission par défaut du formulaire, récupère les valeurs des champs "bookTitle" et "author", et si ces valeurs existent, il appelle la fonction searchBooks().
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission du formulaire par défaut
    //var variable
    var bookTitle = document.getElementById('bookTitle').value;
    var author = document.getElementById('author').value;

    if (bookTitle && author) {
        searchBooks(bookTitle, author);
    }
});
//Cette fonction effectue une requête à l'API Google Books avec le titre du livre et l'auteur fournis, puis traite la réponse. Si la requête réussit, elle appelle la fonction displayResults() avec les données reçues. Si la requête échoue, elle affiche l'erreur dans la console.
function searchBooks(bookTitle, author) {
    var url = 'https://www.googleapis.com/books/v1/volumes?q=intitle:' + bookTitle + '+inauthor:' + author + '&key=AIzaSyBsN18mHK9jTFtdzXoexOUrowDNX31lVIs';

    fetch(url)// Fetch permet de faire une requête HTTP
        .then(response => response.json())// Transforme la réponse en JSON
        .then(data => displayResults(data))// Appelle la fonction displayResults() avec les données reçues
        .catch(error => console.error('Error:', error));// Affiche l'erreur dans la console
}

//Cette fonction affiche les résultats de la recherche de livres. Elle crée un nouvel élément div pour chaque livre trouvé et l'ajoute à l'élément "results". 
//Si aucun livre n'est trouvé, elle affiche un message indiquant qu'aucun livre n'a été trouvé.

function displayResults(data) {
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Efface les résultats précédents
    
    if (data.items) {// Si des livres ont été trouvés
        data.items.forEach(function(item) {// Pour chaque livre trouvé
            var id = item.id;// Récupère l'ID du livre
            var title = item.volumeInfo.title;// Récupère le titre du livre
            var author = item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Information manquante';// Récupère l'auteur du livre
            var description = item.volumeInfo.description ? item.volumeInfo.description.substring(0, 200) : 'Information manquante';// Récupère la description du livre
            var image = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'unavailable.png';//// Cette ligne vérifie si l'objet livre a un lien d'image. Si c'est le cas, elle assigne le lien de la miniature à la variable 'image'.
            // Si l'objet livre n'a pas de lien d'image, elle assigne 'unavailable.png' à la variable 'image'.

            var result = document.createElement('div');// Crée un nouvel élément div
            // Ajoute le contenu HTML au nouvel élément div
            // Cette ligne crée un élément h3 avec le contenu de la variable 'title'.
            //Cette ligne crée un élément p avec le contenu de la variable 'id'.
            // Cette ligne crée un élément p avec le contenu de la variable 'author'.
            // Cette ligne crée un élément p avec le contenu de la variable 'description'.
            // Cette ligne crée un élément img avec le contenu de la variable 'image'.
            //This line creates an icon element with the class "fas fa-bookmark bookmark" and a data-id attribute set to the value of the id variable. This could be used to add a bookmark functionality to each book.
            result.innerHTML = `
                <h3>${title}</h3> 
                <p>ID: ${id}</p>
                <p>Auteur: ${author}</p> 
                <p>Description: ${description}</p> 
                <img src="${image}" alt="Image du livre"> 
                <i class="fas fa-bookmark bookmark" data-id="${id}"></i> `;
            //Cette ligne de code JavaScript ajoute un nœud enfant à l'élément resultsDiv
            //Cette ligne appelle la méthode appendChild sur l'objet resultsDiv. 
            //La méthode appendChild ajoute un nœud à la fin de la liste des enfants d'un nœud parent spécifié. 
            //Dans ce cas, elle ajoute le nœud result à la fin de resultsDiv. Si le nœud result existe déjà ailleurs dans le DOM,(Document Object Model) est une interface de programmation pour les documents HTML et XML.Cela permet aux langages de programmation (comme JavaScript) d'interagir avec le document : lire et modifier son contenu, changer son style, réagir aux événements, etc. Par exemple, lorsque vous utilisez JavaScript pour changer le texte d'un élément HTML, vous modifiez le modèle d'objet de document (DOM) de cette page.
            //il est retiré de sa position actuelle et ajouté à la fin de resultsDiv.
            resultsDiv.appendChild(result);
        });
        //Cette ligne sélectionne tous les éléments avec la classe 'bookmark' dans le document. 
        //Pour chaque élément trouvé, elle exécute une fonction qui prend l'élément actuel (dans ce cas, un bouton) comme argument.
        document.querySelectorAll('.bookmark').forEach(function(button) {
            //Cette ligne ajoute un écouteur d'événements à chaque bouton. L'écouteur d'événements déclenche une fonction lorsque l'événement 'click' est détecté sur le bouton.
            button.addEventListener('click', function() {
                //Cette ligne crée une variable id et lui assigne la valeur de l'attribut data-id de l'élément sur lequel l'événement 'click' a été détecté. this fait référence à l'élément sur lequel l'événement 'click' a été détecté.
                var id = this.dataset.id;
                //Cette ligne appelle la fonction addBookToPochList avec l'id comme argument. Cette fonction n'est pas définie dans le code fourni, mais elle semble ajouter un livre à une liste de lecture (ou "pochList") basée sur l'id.
                addBookToPochList(id);
            });
        });
    //Si aucun élément avec la classe 'bookmark' n'est trouvé, cette ligne modifie le contenu textuel de l'élément resultsDiv pour indiquer qu'aucun livre n'a été trouvé.    
    } else {
        resultsDiv.textContent = 'Aucun livre n’a été trouvé';
    }
}
//La fonction displayPochList est utilisée pour afficher une liste de livres qui sont stockés dans le stockage de session du navigateur.
//En résumé, cette fonction récupère les données de chaque livre dans le 'pochList' du stockage de session, crée un nouveau div pour chaque livre avec ses données, et l'ajoute au HTML.
//La fonction displayPochList() est utilisée pour afficher la liste des livres à lire (ou "pochList") dans le navigateur.
function displayPochList() {
    //Cette ligne récupère la liste des livres à lire du stockage local du navigateur. Si cette liste n'existe pas, une liste vide est utilisée à la place.
    var pochList = JSON.parse(localStorage.getItem('pochList')) || [];
    //Cette ligne récupère l'élément HTML avec l'ID 'pochList'. C'est là que la liste des livres à lire sera affichée.
    var pochListDiv = document.getElementById('pochList');
    //Cette ligne efface tout le contenu HTML actuel de l'élément 'pochList'. Cela permet de s'assurer que la liste est vide avant d'y ajouter les livres.
    pochListDiv.innerHTML = ''; 

    //Cette ligne parcourt chaque livre dans la liste des livres à lire. Pour chaque livre, elle fait ce qui suit :
    pochList.forEach(function(id) {
        //Cette ligne appelle la fonction fetchBook(id) pour récupérer les données du livre. Une fois que ces données sont récupérées, elle fait ce qui suit :
        fetchBook(id).then(function(book) {
            //Cette ligne crée un nouvel élément div pour afficher les données du livre.
            var result = document.createElement('div');
            //Cette ligne définit le contenu HTML de l'élément div. Elle utilise les données du livre pour remplir ce contenu.
            result.innerHTML = `
                <h3>${book.title}</h3> 
                <p>ID: ${book.id}</p>
                <p>Auteur: ${book.author}</p> 
                <p>Description: ${book.description}</p> 
                <img src="${book.image}" alt="Image du livre"> 
                <i class="fas fa-trash delete" data-id="${book.id}"></i> `;

            //Cette ligne ajoute un écouteur d'événements à l'élément avec la classe 'delete' dans l'élément div. Lorsque cet élément est cliqué, elle fait ce qui suit :
            result.querySelector('.delete').addEventListener('click', function() {
                //Cette ligne appelle la fonction removeBookFromPochList(id) pour supprimer le livre de la liste des livres à lire.
                removeBookFromPochList(id);
                //Cette ligne appelle la fonction displayPochList() pour mettre à jour l'affichage de la liste des livres à lire.
                displayPochList();
            });
            //Cette ligne ajoute l'élément div à l'élément 'pochList'. Cela permet d'afficher le livre dans la liste des livres à lire.
            pochListDiv.appendChild(result);
        });
    });
}



//Cette fonction ajoute un livre à la liste de livres à lire (pochList). Elle vérifie d'abord si le livre est déjà dans la liste. Si ce n'est pas le cas, elle ajoute le livre à la liste et met à jour la liste dans le sessionStorage.
function addBookToPochList(id) {
    //var pochList = JSON.parse(sessionStorage.getItem('pochList')) || [];
    var pochList = JSON.parse(localStorage.getItem('pochList')) || [];
    if (pochList.includes(id)) {
        alert('Vous ne pouvez ajouter deux fois le même livre');
    } else {
        console.log("FUNCIONAAAAA")
        pochList.push(id);//
        //sessionStorage.setItem('pochList', JSON.stringify(pochList));// Cette ligne stocke la liste de lecture dans le sessionStorage.
        localStorage.setItem('pochList', JSON.stringify(pochList));
        var book = document.querySelector(`[data-id="${id}"]`).parentNode.cloneNode(true);
        book.querySelector('.bookmark').className = 'fas fa-trash delete';
        book.querySelector('.delete').addEventListener('click', function() {
            removeBookFromPochList(id);
        });
        document.getElementById('pochList').appendChild(book);
    }

}

//Cette fonction supprime un livre de la liste de livres à lire. Elle trouve l'index du livre dans la liste, le supprime de la liste et met à jour la liste dans le sessionStorage.
function removeBookFromPochList(id) {
    //var pochList = JSON.parse(sessionStorage.getItem('pochList'));
    var pochList = JSON.parse(localStorage.getItem('pochList'));
    var index = pochList.indexOf(id);
    
    if (index !== -1) {
        pochList.splice(index, 1);
        //sessionStorage.setItem('pochList', JSON.stringify(pochList));
        localStorage.setItem('pochList', JSON.stringify(pochList));
        var book = document.querySelector(`[data-id="${id}"]`);
        book.parentNode.removeChild(book);
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
//Cette partie du code ajoute un écouteur d'événements à l'objet window. Lorsque la page est chargée, elle récupère la liste de livres à lire du sessionStorage et appelle la fonction fetchBook() pour chaque livre de la liste.
document.addEventListener('DOMContentLoaded', function() {
    let pochList = JSON.parse(localStorage.getItem('pochList')) || [];
    console.log('pochList',pochList)
    displayPochList();
    
});

// ...