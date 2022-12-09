let searchBtn = document.querySelector('#searchBtn');
let searchInput = document.querySelector('#searchInput');
let mainContent = document.querySelector('.posts');
let flashElement = document.getElementById('flash-message');

// interval for flash message
function setFLashMessageFadeOut(flashMessageElement) {
  setTimeout(() => {
    let currentOpacity = 1.0;
    let timer = setInterval(() => {
      if(currentOpacity < 0.05) {
        clearInterval(timer);
        flashMessageElement.remove();
      }
      currentOpacity = currentOpacity - .05;
      flashMessageElement.style.opacity = currentOpacity;
    }, 50);
  }, 4000);
}

// flash to front end
function addFlashFromFrontEnd(message){
  let flashMessageDiv = document.createElement('div');
  let innerFlashDiv = document.createElement('div');
  let innerTextNode = document.createTextNode(message);

  innerFlashDiv.appendChild(innerTextNode);
  flashMessageDiv.appendChild(innerFlashDiv);

  flashMessageDiv.setAttribute('id', 'flash-message');
  innerFlashDiv.setAttribute('class', 'alert alert-info');

  document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
  setFLashMessageFadeOut(flashMessageDiv)
}


// render card off search
function createCard(postData) {
  return `<div class="col-lg-3 col-md-4 col-sm-6">
            <div  class="card" id="post-${postData.idPost}">
              <img class="cardImage" src="${postData.thumbnail}" alt="Missing image">
              <div class="cardBody">
                <p id="title" class="cardTitle">${postData.title}</p>
                <div id="viewPost">
                  <a href="/post/${postData.idPost}" class="anchorButton">Post Details</a>
                </div>
              </div>
            </div>
          </div>
        `;
}

// give us searched results
function executeSearch(){

  if (!searchInput.value){
    location.replace('/');
    return;
  } 

  let searchURL = `/api/posts/search?search=${searchInput.value}`;
  fetch(searchURL)
    .then((data) => {
      // console.log(data);
      return data.json();
    })
    .then((data_json) => {
      let newMainContentHTML = '';
      console.log(data_json);
      data_json.results.forEach((row) => {
        newMainContentHTML += createCard(row);
      })
      
      mainContent.innerHTML = newMainContentHTML;
      if (data_json.message) {
        addFlashFromFrontEnd(data_json.message);
      }
    })
    .catch((err) => console.log(err));
}


if(flashElement){
  setFLashMessageFadeOut(flashElement);
}


if (searchBtn) {
  searchBtn.onclick = executeSearch;
}



