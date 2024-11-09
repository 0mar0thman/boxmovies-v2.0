// js/main.js

const apiKey = '724fa79eddb78094bf31242df4a56d93'; // استخدم مفتاح الـ API الخاص بك
const apiBaseUrl = 'https://api.themoviedb.org/3';
const posterBaseUrl = 'https://image.tmdb.org/t/p/w500';
const sectionsContainer = document.getElementById('sections-container');

// دالة لجلب التصنيفات المتاحة
async function fetchGenres() {
    const url = `${apiBaseUrl}/genre/tv/list?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.genres;
}

// دالة لجلب الأفلام بناءً على التصنيف والصفحة
async function fetchMoviesByGenre(genreId, page = 0) {
    const url = `${apiBaseUrl}/discover/tv?api_key=${apiKey}&with_genres=${genreId}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}

// دالة لعرض الأفلام في السلايدر
function displayMovies(sliderInner, moviesList) {
    sliderInner.innerHTML = ''; // تنظيف السلايدر
    moviesList.forEach(movie => {
        const movieCard = createMovieCard(movie);
        sliderInner.appendChild(movieCard);
    });
}

// دالة لإنشاء كارد للفيلم
function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('card');
    
    const moviePoster = document.createElement('img');
    moviePoster.src = `${posterBaseUrl}${movie.poster_path}`;
    moviePoster.alt = movie.title;
    movieCard.appendChild(moviePoster);

    return movieCard;
}

// دالة لإضافة سلايدر جديد بناءً على التصنيف
async function addMovieSection(genre) {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('section');

    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = genre.name;
    sectionDiv.appendChild(sectionTitle);

    const sliderDiv = document.createElement('div');
    sliderDiv.classList.add('slider');
    
    const sliderInnerDiv = document.createElement('div');
    sliderInnerDiv.classList.add('slider-inner');
    sliderDiv.appendChild(sliderInnerDiv);
    
    sectionDiv.appendChild(sliderDiv);

    // إضافة أزرار التحكم في السلايدر
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('slider-buttons');
    
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    buttonsDiv.appendChild(prevButton);
    
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    buttonsDiv.appendChild(nextButton);
    
    sectionDiv.appendChild(buttonsDiv);
    
    // إضافة أزرار الصفحات
    const paginationDiv = document.createElement('div');
    paginationDiv.classList.add('pagination-buttons');
    sectionDiv.appendChild(paginationDiv);

    // إضافة السكشن إلى الحاوية الأساسية
    sectionsContainer.appendChild(sectionDiv);

    // جلب وعرض الأفلام في السلايدر
    let currentPage = 1;
    const itemsPerPage = 5;
    let totalPages;

    async function updateSlider(page) {
        const moviesList = await fetchMoviesByGenre(genre.id, page);
        displayMovies(sliderInnerDiv, moviesList);
        
        // تحديث الصفحات
        paginationDiv.innerHTML = '';
        totalPages = Math.ceil(moviesList.length / itemsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === page) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                updateSlider(currentPage);
            });
            paginationDiv.appendChild(pageButton);
        }
    }

    // استدعاء أولي لتحديث السلايدر
    updateSlider(currentPage);

    // ربط أزرار السلايدر
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateSlider(currentPage);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateSlider(currentPage);
        }
    });
}

// إنشاء السكاشن ديناميكيًا بناءً على التصنيفات المتاحة
async function init() {
    const genres = await fetchGenres();
    genres.forEach((genre) => {
        addMovieSection(genre);
    });
}

init();
