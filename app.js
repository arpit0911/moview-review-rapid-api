let searchedMovie = document.getElementById("input-data");
let moviesData = [];
let searchBtn = document.getElementById("search-btn");
let root = document.getElementById("root");
let movieReviewSection = document.getElementById("review-section");

let imdbRating = {};
let userReview = {};
searchBtn.addEventListener("click", getMoviesData);

function getMoviesData() {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "5b43486dafmshabdbc99b466a72ep1a23bajsn3f48d880aff6",
      "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
    },
  };

  fetch(
    `https://imdb8.p.rapidapi.com/auto-complete?q=${searchedMovie.value}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      moviesData = response.d;
      setMoviesData();
    //   console.log(moviesData);
    })
    .catch((err) => console.error(err));
}

function setMoviesData() {
  root.innerHTML = "";

  movieReviewSection.innerHTML = "";
  moviesData.map((movie) => {
    let movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.addEventListener("click", () =>
      getMovieReview(movie.id, movie?.i?.imageUrl)
    );

    let poster = document.createElement("img");
    poster.src = movie?.i?.imageUrl;
    poster.alt = "poster";
    poster.classList.add("movie-poster");

    let movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-details");

    let title = document.createElement("h1");
    title.textContent = movie.l;

    let cast = document.createElement("p");
    cast.innerHTML = `<span>Cast: </span>${movie.s}`;

    let release = document.createElement("p");
    release.innerHTML = `<span>Release:</span> ${movie.y}`;

    movieDetail.appendChild(title);
    movieDetail.appendChild(cast);
    movieDetail.appendChild(release);
    movieCard.appendChild(poster);
    movieCard.appendChild(movieDetail);
    root.appendChild(movieCard);
  });
}

function getMovieReview(id, image) {
//   console.log("Movie Review", id);
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "5b43486dafmshabdbc99b466a72ep1a23bajsn3f48d880aff6",
      "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
    },
  };

  fetch(
    `https://imdb8.p.rapidapi.com/title/get-reviews?tconst=${id}&currentCountry=ind&purchaseCountry=ind`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      imdbRating = response.imdbrating;
      userReview = response.featuredUserReview.review;
    //   console.log(userReview);
      setMovieReview(image);
    })
    .catch((err) => {
      alert("No Reviews", err);
    });
}

function setMovieReview(image) {
  root.innerHTML = "";
  //   root.classList.toggle("hide-section");
  movieReviewSection.innerHTML = "";

  let content = `
        <img class="poster" src=${image} alt="poster"/>
        <h1 class="title">${imdbRating.title} <span>${imdbRating.year}</span></h1>
        <div class="rating-rank">
            <p>IMDB Rating: <span>${imdbRating.rating}</span>/10</p>
            <p>Ranking: <span>${imdbRating.topRank}</span> </p>
        </div>
        <div class="user-review" >
            <div class="user-profile">
                <div class="profile-pic"></div>
                <h4>${userReview.author.displayName}</h4>
            </div>
            <div class="rating-rank">
                <p>User Rating: <span>${userReview.authorRating}</span>/10</p>
                <button class="explore-btn" onClick="handleSeeMore()">See more movies</button>
            </div>
            <p>${userReview.reviewText}</p>
        </div>
  `;
  movieReviewSection.innerHTML = content;
}

function handleSeeMore() {
  //   console.log("ess more");
  movieReviewSection.innerHTML = "";
  root.innerHTML = "";
  getMoviesData();
}
