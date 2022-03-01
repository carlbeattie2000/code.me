const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const getUserDetails = async (profile_query) => {
  const url = "http://192.168.0.3:4001/profile?profile_query=" + profile_query;

  const serverRequest = await fetch(url);
  const serverResponse = await serverRequest.json();

  const userPosts = await serverResponse.posts;

  for (let post of userPosts) {
    await getHasLikedPost(post.post_id)
      .then((post_liked) => {
        if (post_liked.liked_post) {
          post.user_liked = true;

          return
        }

        post.user_liked = false;
      });
  }

  serverResponse.posts = userPosts;

  return serverResponse;
}

const updateProfileDetails = (user_details) => {
  const topBannerName = document.getElementById("top_banner_username").textContent = ":" + user_details.username;
  const topBannerPostsCount = document.getElementById("top_banner_post_count").textContent = user_details.posts_count + " posts";
  // const bannerImage = document.getElementById("profile_banner_image"); not implemented yet

  const profileImage = document.getElementById("profile_image").src = user_details.profilePicPath;

  const profileName = document.getElementById("profile_name").textContent = user_details.name;
  const profileUsername = document.getElementById("profile_username").textContent = ":" + user_details.username;
  // const profileBio = document.getElementById("profile_bio"); not implemented yet
  const profileJoinDate = document.getElementById("joined_date").textContent = "Joined " + user_details.created_at.split("T")[0];

  const followingCount = document.getElementById("profile_following").textContent = user_details.following;
  const followersCount = document.getElementById("profile_followers").textContent = user_details.followers;

  const profilePosts = document.getElementById("profile_posts");
  let postsContainers = "";
  
  for (let post of user_details.posts) {
    postsContainers += buildPostDiv(post, user_details)
  }

  profilePosts.innerHTML = postsContainers;
}

const buildPostDiv = (post, user) => {
  let likedButtonClass = "";

  if (post.user_liked) {
    likedButtonClass = "liked_active";
  }

  const timeSincePosted = (Date.now() / 1000) - post.date_posted;

  return (
    `
      <div class="post">
        <div class="post-content-container">
          <div class="post-top-level-content">
            <div class="profile-image">
              <img src="${user.profilePicPath}" alt="profile-pic">
            </div>
    
            <div class="post-main-content">
              <p class="username">:${user.username}</p>
              <h2 class="content">${post.post_content}</h2>
            </div>
          </div>
  
          <div class="post-action-buttons">
            <p class="uploadTime">${secondsToFormattedTime(timeSincePosted)}</p>
            <button id="post_action_comment"><i class="fa-solid fa-comment fa-lg"></i><span>${post.comments_count}</span></button>
            <button id="post_action_like" class="${likedButtonClass}"><i class="fa-solid fa-heart fa-lg"></i></i><span>${post.likes}</span></button>
            <button id="post_action_share"><i class="fa-solid fa-arrow-up-from-bracket fa-lg"></i></button>
          </div>
        </div>
      </div>
    `
  )
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
    return Math.floor(secondsToConvert / 3600) + "h";
  }

  if (secondsToConvert < 604800) {
    return Math.floor(secondsToConvert / 86400) + "d";
  }
}

getUserDetails(urlParams.get("profile_query"))
  .then(result => updateProfileDetails(result));