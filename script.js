const API_URL = 'https://api.github.com/users/';
const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

// Fetch Form data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = search.value;

  if (user) {
    getUser(user);
    search.value = '';
  }
});

// Make request to Github
async function getUser(username) {
  try {
    const { data } = await axios(API_URL + username);
    createUserCard(data);
    getRepos(username);
  } catch (error) {
    if (error.response.status === 404)
      createErrorCard('No profile with entered username');
  }
}

// MFetch Repos
async function getRepos(username) {
  try {
    const { data } = await axios(API_URL + username + '/repos?sort=created');
    addReposToCard(data);
  } catch (error) {
    if (error.response.status === 404)
      createErrorCard('Problem fetching Repos');
  }
}

function createUserCard(user) {
  const cardElement = `
  <div class="card">
        <div>
          <img
            src="${user.avatar_url}"
            alt="${user.name}"
            class="avatar"
          />
        </div>

        <div class="user-info">
          <h2>${user.login}</h2>
          <p>
            ${user.bio}
          </p>

          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
          </ul>

          <div id="repos">
            <a href="#" class="repos">Repo 1</a>
            <a href="#" class="repos">Repo 2</a>
            <a href="#" class="repos">Repo 3</a>
          </div>
        </div>
      </div>
  `;

  main.innerHTML = cardElement;
}

function createErrorCard(message) {
  const cardElement = `
  <div class="card">
    <h1> ${message} </h1>
  </div>
  `;
  main.innerHTML = cardElement;
}

function addReposToCard(repos) {
  const reposList = document.getElementById('repos');
  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repos');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.innerText = repo.name;

    reposList.appendChild(repoEl);
  });
}
