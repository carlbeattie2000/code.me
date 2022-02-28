const homeFeedPostsSection = document.getElementById("home_feed_posts");
let loadedPosts = "";

const getPostsFromServer = async () => {
  const url = "http://192.168.0.3:4001/recent-posts";
  const request = await fetch(url);
  const response = await request.json();

  for (let res of response) {
    const username = await getPostersDetails(res.posters_id).then((user) => {
      res.username = user.username;
    })
  }

  return response
}

const getPostersDetails = async (postersID) => {
  const url = "http://192.168.0.3:4001/public-user-by-id" + "?user_id="+postersID;
  const request = await fetch(url);
  const response = await request.json();

  return response
}

const createNewPostDiv = (post) => {
  console.log(post);
  const div = `
    <div class="post">
      <div class="post-content-container">
        <div class="post-top-level-content">
          <div class="profile-image">
            <img src="../img/test/profile-pic-test.jpg" alt="profile-pic">
          </div>

          <div class="post-main-content">
            <p class="username">:${post.username}</p>
            <h2 class="content">${post.post_content}</h2>
          </div>
        </div>

        <div class="post-action-buttons">
          <button id="post_action_comment"><i class="fa-solid fa-comment fa-lg"></i></button>
          <button id="post_action_like"><i class="fa-solid fa-heart fa-lg"></i></i></button>
          <button id="post_action_share"><i class="fa-solid fa-arrow-up-from-bracket fa-lg"></i></button>
        </div>
      </div>
    </div>
  `

  return div
}

// Load home feed with posts
getPostsFromServer()
  .then((posts) => {
    for (let post of posts) loadedPosts += createNewPostDiv(post);

    homeFeedPostsSection.innerHTML = loadedPosts;
  })

setInterval(() => {
  loadedPosts = "";
  getPostsFromServer()
  .then((posts) => {
    for (let post of posts) loadedPosts += createNewPostDiv(post);

    homeFeedPostsSection.innerHTML = loadedPosts;
  })
}, 30000);