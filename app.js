const searchBtn = document.querySelector(".search-btn");
const mealList = document.querySelector("#meal");
const mealDetails = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");
const emptySearch = document.querySelector(".empty-search");
const recipeBtn = document.querySelector(".recipe-btn");
//event Listener.
let isFetchingMeal = false;
searchBtn.addEventListener("click", !isFetchingMeal && getMealList);
function toggleSearchInnerState() {
	if (isFetchingMeal) {
		searchBtn.innerHTML = `<i class="fa-solid fa-spinner search-spinner"></i>`;
	} else {
		searchBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
	}
}
toggleSearchInnerState();

//get meal list that matches with the ingredients

function getMealList() {
	let searchInputTxt = document
		.getElementById("search-input")
		.value.trim()
		.toLowerCase();

	console.log(searchInputTxt.length);
	if (searchInputTxt.length > 0) {
		isFetchingMeal = true;
		toggleSearchInnerState();
		// emptySearch.innerHTML = "";
		fetch(
			`https://cors-anywhere.herokuapp.com/https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
		)
			// mealList.classList.remove("notFound");
			.then((res) => res.json())
			.then((data) => {
				let html = "";
				if (data.meals) {
					data.meals.forEach((meal) => {
						html += `
						<div class="meal-item" data-id ="${meal.idMeal}">
												<div class="meal-img">
													<img src="${meal.strMealThumb}" alt="food" />
												</div>
												<div class="meal-name">
													<h3>${meal.strMeal}</h3>
													<a href="#" class="recipe-btn">Get Recipe</a>
												</div>
										</div>
							`;
					});
				} else {
					html = "Oops, we couldn't find your meal!";
					mealList.classList.add("notFound");
				}
				mealList.innerHTML = html;
				isFetchingMeal = false;

				toggleSearchInnerState();
			});
	} else {
		emptySearch.innerHTML = "You must enter a search word e.g egg!";
	}
}
mealList.addEventListener("click", getMealRecipe);

// function toggleFetchInnerState() {
// 	if (isFetchingRecipe) {
// 		recipeBtn.innerHTML = `<i class="fa-solid fa-spinner search-spinner"></i>`;
// 	} else {
// 		recipeBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
// 	}
// }
// toggleFetchInnerState();

//get meal recipe
function getMealRecipe(e) {
	e.preventDefault();
	if (e.target.classList.contains("recipe-btn")) {
		let mealItem = e.target.parentElement.parentElement;
		fetch(
			`https://cors-anywhere.herokuapp.com/https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
		)
			.then((res) => res.json())
			.then((data) => mealRecipeModal(data.meals));
	}
}

// create a modal
function mealRecipeModal(meal) {
	console.log(meal);
	meal = meal[0];
	let html = `<h2 class="recipe-title">${meal.strMeal}</h2>
						<p class="recipe-category">${meal.strCategory}</p>
						<div class="recipe-instruct">
							<h3>Instructions:</h3>
					<p>${meal.strInstructions}</p>
						</div>
						<div class="recipe-meal-img">
							<img src="${meal.strMealThumb}" alt="" />
							</div>
							<div class="recipe-link">
								<a href="${meal.strYoutube}" target="_blank">Watch Video</a>
							</div>`;
	mealDetails.innerHTML = html;
	mealDetails.parentElement.classList.add("showRecipe");
}
recipeCloseBtn.addEventListener("click", () => {
	mealDetails.parentElement.classList.remove("showRecipe");
});
