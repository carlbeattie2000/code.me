const homeFeedPostButton = document.getElementById("home_feed_send_post");


homeFeedPostButton.addEventListener("click", () => {
  const postContent = document.getElementById("home_feed_post_content");

  console.log(postContent);

  sendPostToApi({content: postContent.value});
})