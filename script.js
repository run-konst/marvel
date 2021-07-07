document.addEventListener('DOMContentLoaded', () => {

    let heroesDB = {};

    const
        heroesBlock = document.querySelector('.heroes'),
        heroSelect = document.querySelector('.hero-select'),
        getRealName = hero => (!hero.realName || hero.realName === hero.name) ? '' : `<div class="real-name">${hero.realName}</div>`,
        getCityzen = hero => !hero.citizenship ? '' : `<span class="citizenship">${hero.citizenship}</span>`,
        createYearsBlock = hero => {
            const status = {};
            if (hero.status === 'alive') {
                status.class = 'status status-alive';
            } else if (hero.status === 'deceased') {
                status.class = 'status status-deceased';
            } else if (hero.status === 'unknown') {
                status.class = 'status status-unknown';
            } else {
                status.class = 'status';
            }
            status.birthYear = !hero.birthDay ? '???' : hero.birthDay;

            if (!hero.birthDay && !hero.deathDay) {
                return `
                    <span class="${status.class}">${hero.status}</span>
                `;
            }

            if (hero.birthDay && !hero.deathDay) {
                return `
                    <span class="birth-year">Born ${hero.birthDay}</span>
                    <span class="${status.class}">${hero.status}</span>
                `;
            }

            return `
                <span class="birth-year">${status.birthYear}</span>
                -
                <span class="death-year">${hero.deathDay}</span>
                <span class="${status.class}">${hero.status}</span>
            `;

        },
        getMovies = movies => {
            if (!movies) {
                return '';
            }
            let moviesHTML = `
                <h3 class="movies-title">Movies:</h3>
                <ul class="movies">
            `;
            movies.forEach(movie => {
                moviesHTML += `<li class="movie">${movie}</li>`;
            });
            moviesHTML += `</ul>`;
            return moviesHTML;
        },
        createCard = hero => {
            const card = document.createElement('div');
            card.classList.add('hero-card');
            card.dataset.heroName = hero.name;
            card.innerHTML = `            
                <img src="${hero.photo}" alt="${hero.name}" class="hero-img">
                <div class="wrapper">
                    <div class="info">
                        <div class="col-right">
                            <h2 class="name">${hero.name}</h2>
                            ${getRealName(hero)}
                            <div class="actor">Acting: ${hero.actors}</div>
                        </div>
                        <div class="col-left">
                            <div class="gender-species">
                                <span class="gender">${hero.gender}</span>
                                <span class="species">${hero.species}</span>
                            </div>
                            ${getCityzen(hero)}
                            <div class="years">
                            ${createYearsBlock(hero)}
                            </div>
                        </div>
                    </div>
                    ${getMovies(hero.movies)}    
                </div>
            `;
            heroesBlock.append(card);
        },
        createCards = heroes => {
            heroes.forEach(hero => createCard(hero));
            heroesDB = heroes;
            return heroes;
        },
        getMovieList = heroes => {
            const movieList = new Set();
            heroes.forEach(hero => {
                if (hero.movies) {
                    hero.movies.forEach(movie => {
                        movieList.add(movie);
                    });
                }
            });
            return movieList;
        },
        createMovieSelect = movies => {
            movies.forEach(movie => {
                const option = document.createElement('option');
                option.value = movie;
                option.innerHTML = movie;
                heroSelect.append(option);
            });
        },
        selectMovie = (heroes, movieStr) => {
            const heroesInMovie = [];
            heroes.forEach(hero => {
                if (!hero.movies) {
                    return;
                }
                hero.movies.forEach(movie => {
                    if (movie === movieStr) {
                        heroesInMovie.push(hero.name);
                    }
                });
            });
            return heroesInMovie;
        },
        filterCards = heroes => {
            const cards = document.querySelectorAll('.hero-card');
            if (heroSelect.value === 'All heroes') {
                cards.forEach(card => {
                    card.classList.remove('hidden');
                });
                return;
            }
            cards.forEach(card => {
                card.classList.add('hidden');
                heroes.forEach(hero => {
                    if (hero === card.dataset.heroName) {
                        card.classList.remove('hidden');
                    }
                });
            });
        },
        addListeners = () => {
            heroSelect.addEventListener('change', () => {
                const
                    movie = heroSelect.value,
                    heroes = selectMovie(heroesDB, movie);
                filterCards(heroes);
            });
            document.addEventListener('click', event => {
                const targetMovie = event.target.closest('.movie');
                if (!targetMovie) {
                    return;
                }
                const movie = targetMovie.textContent;
                heroSelect.value = movie;
                const heroes = selectMovie(heroesDB, movie);
                filterCards(heroes);
            });
        };

    fetch('dbHeroes.json')
        .then(response => {
            if (response.status !== 200) {
                throw new Error('Network status is not 200');
            }
            return response.json();
        })
        .then(createCards)
        .then(getMovieList)
        .then(createMovieSelect)
        .then(addListeners)
        .catch(error => {
            console.error(error);
        });

});
