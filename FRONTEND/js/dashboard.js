
// document.addEventListener("DOMContentLoaded", async function () {

//   const container = document.getElementById("modules");

//   const token = localStorage.getItem("token");

//   if (!token) {
//     window.location.href = "login.html";
//     return;
//   }

//   try {

//     const res = await fetch("http://127.0.0.1:8000/api/questions/categories/", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       }
//     });

//     const data = await res.json();

//     console.log("API RESPONSE:", data);

//     const categories =
//       Array.isArray(data) ? data :
//       Array.isArray(data.results) ? data.results :
//       Array.isArray(data.data) ? data.data :
//       [];

//     if (categories.length === 0) {
//       container.innerHTML = "<p>No categories found</p>";
//       return;
//     }

//     categories.forEach(item => {

//       const card = document.createElement("div");
//       card.className = "card";

//       card.innerHTML = `
//         <img src="${item.image || '/assets/images/default.png'}" class="card-img" />
//         <h3>${item.title || item.name}</h3>
//         <p>${item.description || ''}</p>
//         <button class="explore-btn">Explore</button>
//       `;

//       card.querySelector(".explore-btn").addEventListener("click", function () {
//         localStorage.setItem("selectedCategory", item.id);
//         window.location.href = "quiz.html?category=" + item.id;
//       });

//       container.appendChild(card);
//     });

//   } catch (err) {
//     console.error("Dashboard API Error:", err);
//     container.innerHTML = "<p style='color:red'>Failed to load data</p>";
//   }

// });

document.addEventListener("DOMContentLoaded", function () {

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("userName");

  // 🔐 AUTH CHECK (IMPORTANT FIX)
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Show user name
  document.getElementById("userName").innerText = "Hi, " + (name || "User");

  loadCategories();
});

async function loadCategories() {

  const container = document.getElementById("modules");
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/questions/categories/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log("API RESPONSE:", data);

    // ❌ FIX: prevent error "data.forEach is not a function"
    if (!Array.isArray(data)) {
      console.error("Invalid API format:", data);
      container.innerHTML = "<p style='color:red'>Failed to load categories</p>";
      return;
    }

    container.innerHTML = "";

    data.forEach(category => {

      const image = getImage(category.name);
      const desc = getDescription(category.name);

      const card = document.createElement("div");
      card.className = "dashboard-card";

      card.innerHTML = `
        <div class="card-image">
          <img src="../assets/images/${image}" alt="${category.name}">
        </div>

        <div class="card-content">
          <h3>${category.name}</h3>
          <p>${desc}</p>
          <button class="explore-btn">Explore</button>
        </div>
      `;

      card.querySelector(".explore-btn").addEventListener("click", () => {
        localStorage.setItem("selectedCategory", category.id);
        window.location.href = "quiz.html";
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error("API ERROR:", error);
  }
}

/* IMAGE MAP */
function getImage(name) {
  const map = {
    "Python": "python.jpg",
    "Java": "java.jpg",
    "React": "react.jpg",
    "Html": "html.jpg",
    "CSS": "css.jpg",
    "JavaScript": "js.jpg",
    "Finance": "finance.jpg",
    "HR": "hr.jpg",
    "SQL": "sql.jpg",
    "OOPs": "oop.jpg",
    "DSA": "dsa.jpg",
    "Machine Learning": "ml.jpg",
    "Aptitude": "aptitude.jpg",
    "Current Affairs": "current.jpg",
    "Machine Design": "machine design.jpg",
    "Fluid Mechanics": "fluid.jpg",
    "Structural Engineering": "structural.jpg"
  };

  return map[name] || "default.jpg";
}

/* DESCRIPTION MAP */
function getDescription(name) {
  const desc = {
    "Python": "Backend, AI & automation",
    "Java": "OOP based programming",
    "React": "Frontend UI development",
    "Html": "Web structure",
    "CSS": "Styling & layout",
    "JavaScript": "Dynamic web behavior",
    "Finance": "Money & investment",
    "HR": "Human resource skills",
    "SQL": "Database queries",
    "OOPs": "Core programming concepts",
    "DSA": "Logic & problem solving",
    "Machine Learning": "AI & models",
    "Aptitude": "Math & reasoning",
    "Current Affairs": "Latest news",
    "Machine Design": "Mechanical concepts",
    "Fluid Mechanics": "Fluid behavior",
    "Structural Engineering": "Construction basics"
  };

  return desc[name] || "Explore this topic";
}

/* LOGOUT */
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}