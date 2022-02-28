//  like post
const getLikeButtons = () => {
  const likeButtons = Array.from(document.querySelectorAll(".post_action_like"));

  likeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const post_id = btn.value;

      sendLikeRequest(post_id).then(updatePostsFeed());
    })
  })
}

const sendLikeRequest = async (post_id) => {
  const serverRequest = await fetch("http://192.168.0.3:4001/like-post/?post_id=" + post_id);

  const response = await serverRequest.json();

  return response
}