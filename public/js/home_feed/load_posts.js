const homeFeedPostsSection = document.getElementById("home_feed_posts");
let loadedPosts = "";

const loadDefaultProfileDetails = async () => {
  const serverRequest = await fetch("http://192.168.0.3:4001/current-user-details");
  const serverResponse = await serverRequest.json();

  return serverResponse;
}

loadDefaultProfileDetails().then((user) => {
  document.getElementById("profile_image_home_feed").src = user.profileImage;
})

const getPostsFromServer = async () => {
  const url = "http://192.168.0.3:4001/recent-posts";
  const request = await fetch(url);
  const response = await request.json();

  for (let res of response) {
    const username = await getPostersDetails(res.posters_id).then((user) => {
      res.username = user.username;
      res.profileImage = user.profilePicPath;

      const hasLikedPost = getHasLikedPost(res.post_id).then((post_matched_liked) => {
        if (post_matched_liked.liked_post) {
          res.likedPost = true
        } else {
          res.likedPost = false;
        }
      })
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

const getHasLikedPost = async (post_id) => {
  const url = "http://192.168.0.3:4001/has-liked-post?post_id="+post_id;

  const request = await fetch(url);
  const response = await request.json();

  return response;
}

const secondsToFormattedTime = (secondsToConvert) => {
  if (secondsToConvert < 60) {
    return Math.floor(secondsToConvert) + "s";
  }

  if (secondsToConvert < 3600) {
    return Math.floor(secondsToConvert / 60) + "m";
  }

  if (secondsToConvert < 86400) {
    return Math.floor(secondsToConvert / 3600) + "hr";
  }

  if (secondsToConvert < 604800) {
    return Math.floor(secondsToConvert / 86400) + "d";
  }
}

const createNewPostDiv = (post) => {
  const timeSincePosted = (Date.now() / 1000) - post.date_posted;
  let likedButtonClass = "";

  console.log(post);

  if (post.likedPost) {
    likedButtonClass = "liked_active";
  }

  const div = `
    <div class="post">
      <div class="post-content-container">
        <div class="post-top-level-content">
          <div class="profile-image">
            <img src="${post.profileImage}" alt="profile-pic">
          </div>

          <div class="post-main-content">
            <p class="username">:${post.username}</p>
            <p class="uploadedTime">${secondsToFormattedTime(timeSincePosted)}</p>
            <h2 class="content">${post.post_content}</h2>
          </div>
        </div>

        <div class="post-action-buttons">
          <button id="post_action_comment"><i class="fa-solid fa-comment fa-lg"></i><span>${post.comments_count}</span></button>
          <button class="post_action_like ${likedButtonClass}" value="${post.post_id}"><i class="fa-solid fa-heart fa-lg"></i></i><span>${post.likes}</span></button>
          <button id="post_action_share"><i class="fa-solid fa-arrow-up-from-bracket fa-lg"></i></button>
        </div>
      </div>
    </div>
  `

  return div
}

const updatePostsFeed = () => {
  loadedPosts = "";
  getPostsFromServer()
    .then((posts) => {
      for (let post of posts) loadedPosts += createNewPostDiv(post);

      homeFeedPostsSection.innerHTML = loadedPosts;

      getLikeButtons();
    })
}

// Load home feed with posts
updatePostsFeed();

setInterval(() => {
  updatePostsFeed();
}, 30000);