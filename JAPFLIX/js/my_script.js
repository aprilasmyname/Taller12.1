document.addEventListener("DOMContentLoaded", function () {
    const API_URL = 'https://japceibal.github.io/japflix_api/movies-data.json';
    let movies = [];

    // Cargar datos
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            movies = data;
        })
        .catch(error => console.error('Error al obtener los datos:', error));

    // Evento de búsqueda
    document.getElementById("btnBuscar").addEventListener("click", () => {
        const searchTerm = document.getElementById("inputBuscar").value.toLowerCase().trim();
        if (searchTerm) {
            const results = movies.filter(movie =>
                movie.title.toLowerCase().includes(searchTerm) ||
                movie.genres.some(genre => genre.name.toLowerCase().includes(searchTerm)) ||
                (movie.tagline && movie.tagline.toLowerCase().includes(searchTerm)) ||
                (movie.overview && movie.overview.toLowerCase().includes(searchTerm))
            );
            displayMovies(results);
        }
    });

    // Mostrar resultados
    function displayMovies(results) {
        const lista = document.getElementById("lista");
        const fragment = document.createDocumentFragment();

        if (results.length === 0) {
            lista.innerHTML = `<li class="list-group-item list-group-item-danger text-center">No se encontraron resultados.</li>`;
            return;
        }

        results.forEach(movie => {
            const movieItem = document.createElement("li");
            movieItem.className = "list-group-item list-group-item-dark d-flex justify-content-between align-items-center";
            movieItem.innerHTML = `
          <div>
            <h5>${movie.title}</h5>
            <p>${movie.tagline || 'Sin descripción'}</p>
            <div>${createStars(movie.vote_average)}</div>
          </div>
          <button class="btn btn-info btn-ver-detalles" data-id="${movie.id}">Ver detalles</button>
        `;
            fragment.appendChild(movieItem);
        });

        lista.innerHTML = "";
        lista.appendChild(fragment);

        document.querySelectorAll(".btn-ver-detalles").forEach(button => {
            button.addEventListener("click", (event) => {
                const movieId = event.target.getAttribute("data-id");
                showMovieDetails(movieId);
            });
        });
    }

    // Crear estrellas
    function createStars(vote_average) {
        let starsHTML = "";
        for (let i = 0; i < 5; i++) {
            starsHTML += `<span class="fa fa-star ${i < Math.round(vote_average / 2) ? 'checked' : ''}"></span>`;
        }
        return starsHTML;
    }

    // Mostrar detalles de la película
    function showMovieDetails(movieId) {
        const movie = movies.find(m => m.id == movieId);
        if (movie) {
            const offcanvasBody = document.getElementById("offcanvasBody");
            offcanvasBody.innerHTML = `
          <h3>${movie.title}</h3>
          <p>${movie.overview || 'No hay descripción disponible.'}</p>
          <ul>${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}</ul>
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Más detalles
          </button>
          <ul class="dropdown-menu">
            <li>Año de lanzamiento: ${new Date(movie.release_date).getFullYear()}</li>
            <li>Duración: ${movie.runtime || 'Desconocido'} minutos</li>
            <li>Presupuesto: $${movie.budget.toLocaleString()}</li>
            <li>Ganancias: $${movie.revenue.toLocaleString()}</li>
          </ul>
        `;

            const offcanvasElement = new bootstrap.Offcanvas(document.getElementById('offcanvasTop'));
            offcanvasElement.show();
        }
    }
});
