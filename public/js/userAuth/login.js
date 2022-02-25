const loginSubmitButton = document.getElementById("auth_login");

loginSubmitButton.addEventListener("click", () => {
  sendLoginDetails(getUserLoginFormDetails());
})

const getUserLoginFormDetails = () => {
  const usernameOrEmail = document.getElementById("username_login").value;
  const password = document.getElementById("password_login").value;

  return ({
    usernameOrEmail,
    password
  })
}
 
const sendLoginDetails = async (data) => {
  const url = "http://192.168.0.3:4001/login-auth"
  
  const loginRequest = fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data)
  })

  return (await loginRequest).json();
}