document.addEventListener("DOMContentLoaded", function () {

  const loginBtn = document.getElementById("loginBtn");

  if (!loginBtn) {
    console.error("loginBtn not found in login.html");
    return;
  }

  loginBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const emailEl = document.getElementById("email");
    const passwordEl = document.getElementById("password");

    if (!emailEl || !passwordEl) {
      alert("Form fields missing in HTML");
      return;
    }

    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    loginBtn.innerText = "Logging in...";
    loginBtn.disabled = true;

    try {

      const res = await postAPI("accounts/login/", {
        email,
        password
      });

      console.log("LOGIN RESPONSE:", res);

      // ✅ FIXED TOKEN HANDLING (your backend uses access_token)
      const token = res.access_token;

      if (token) {

        localStorage.setItem("token", token);
        localStorage.setItem("refresh", res.refresh_token || "");
        localStorage.setItem("userEmail", email);

        if (res.user?.name) {
          localStorage.setItem("userName", res.user.name);
        }

        document.body.innerHTML = `
          <div style="
            height:100vh;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);
            color:white;
            font-family:Arial;
          ">
            <h1 style="color:#7b2ff7">Login Successful 🎉</h1>
            <p>Redirecting to dashboard...</p>
          </div>
        `;

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);

      } else {
        alert(res.detail || res.error || "Invalid credentials");
        loginBtn.innerText = "Login";
        loginBtn.disabled = false;
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Server error. Please try again.");

      loginBtn.innerText = "Login";
      loginBtn.disabled = false;
    }
  });

});