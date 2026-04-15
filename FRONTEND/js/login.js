// // Toggle Password Visibility
// function togglePassword() {
//     const passwordInput = document.getElementById("password");
//     const icon = document.getElementById("eyeIcon");
    
//     if (passwordInput.type === "password") {
//         passwordInput.type = "text";
//         icon.classList.replace("bi-eye", "bi-eye-slash");
//     } else {
//         passwordInput.type = "password";
//         icon.classList.replace("bi-eye-slash", "bi-eye");
//     }
// }

// /* NORMAL LOGIN */
// document.getElementById("loginForm").addEventListener("submit", async function(e) {
//     e.preventDefault();
//     const btn = document.getElementById("loginBtn");
//     const errorDiv = document.getElementById("login-error");

//     const formData = {
//         email: document.getElementById("email").value,
//         password: document.getElementById("password").value
//     };

//     btn.disabled = true;
//     btn.innerText = "Verifying...";
//     errorDiv.classList.add('d-none');

//     try {
//         const res = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(formData)
//         });

//         const result = await res.json();

//         if (res.ok) {
//             // MATCHING YOUR DJANGO VIEW KEYS:
//             localStorage.setItem("token", result.access_token);
//             localStorage.setItem("userName", result.user.name); 
            
//             console.log("Login Success! Name:", result.user.name);
//             window.location.href = "dashboard.html";
//         } else {
//             errorDiv.innerText = result.error || "Invalid email or password.";
//             errorDiv.classList.remove('d-none');
//         }
//     } catch (err) {
//         errorDiv.innerText = "Server connection failed.";
//         errorDiv.classList.remove('d-none');
//     } finally {
//         btn.disabled = false;
//         btn.innerText = "Login";
//     }
// });

// /* GOOGLE LOGIN CALLBACK */
// function handleCredentialResponse(response) {
//     const googleToken = response.credential;

//     fetch("http://127.0.0.1:8000/api/accounts/google-login/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token: googleToken })
//     })
//     .then(res => res.json())
//     .then(data => {
//         // Ensure Google login also uses the correct key returned by your backend
//         if (data.access_token) {
//             localStorage.setItem("token", data.access_token);
//             localStorage.setItem("userName", data.user.name);
//             window.location.href = "dashboard.html";
//         } else {
//             alert("Google Login Failed: " + JSON.stringify(data));
//         }
//     })
//     .catch(err => console.error("Google Auth Error:", err));
// }


function togglePassword() {
    const passwordInput = document.getElementById("password");
    const icon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.replace("bi-eye", "bi-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.replace("bi-eye-slash", "bi-eye");
    }
}


// NORMAL LOGIN
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const btn = document.getElementById("loginBtn");
    const errorDiv = document.getElementById("login-error");

    const formData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    btn.disabled = true;
    btn.innerText = "Verifying...";
    errorDiv.classList.add("d-none");

    try {
        const res = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await res.json();

        if (res.ok) {

            // ✅ FIXED KEY NAME (IMPORTANT)
            localStorage.setItem("token", result.access_token);
            localStorage.setItem("userName", result.user.name);

            console.log("Login Success:", result.user.name);

            window.location.href = "dashboard.html";

        } else {
            errorDiv.innerText = result.error || "Invalid email or password.";
            errorDiv.classList.remove("d-none");
        }

    } catch (err) {
        errorDiv.innerText = "Server connection failed.";
        errorDiv.classList.remove("d-none");
    } finally {
        btn.disabled = false;
        btn.innerText = "Login";
    }
});


// GOOGLE LOGIN
function handleCredentialResponse(response) {
    const googleToken = response.credential;

    fetch("http://127.0.0.1:8000/api/accounts/google-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken })
    })
    .then(res => res.json())
    .then(data => {

        if (data.access_token) {

            // ✅ SAME KEY USED HERE
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("userName", data.user.name);

            window.location.href = "dashboard.html";

        } else {
            alert("Google Login Failed");
        }
    })
    .catch(err => console.error(err));
}