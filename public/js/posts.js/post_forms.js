const homeFeedPostButton = document.getElementById("home_feed_send_post");


homeFeedPostButton.addEventListener("click", () => {
  const postContent = document.getElementById("home_feed_post_content");


  sendPostToApi({content: postContent.value})
    .then(updatePostsFeed())
  
  postContent.value = "";
})