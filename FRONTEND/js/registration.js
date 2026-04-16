document.addEventListener("DOMContentLoaded", function () {

  const btn = document.getElementById("registerBtn");

  if (!btn) {
    console.error("registerBtn not found in HTML");
    return;
  }

  btn.addEventListener("click", async function (e) {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };

    const res = await postAPI("accounts/register/", data);

    if (res.message || res.id) {

      document.querySelector(".auth-form").innerHTML = `
        <h2 style="color:#7b2ff7">🎉 Registration Successful</h2>
        <p style="text-align:center;color:#ccc">
          Welcome ${data.name}
        </p>
        <button onclick="window.location.href='login.html'">
          Go to Login
        </button>
      `;

      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);

    } else {
      alert(res.error || "Registration Failed");
    }
  });

});