document.addEventListener("DOMContentLoaded", function () {
  loadModules();
});

function loadModules() {

const modules = [
  { id: 2, title: "Python", img: "../images/python.jpg", desc: "Learn Python programming" },
  { id: 3, title: "Java", img: "../images/java.jpg", desc: "Core Java concepts" },
  { id: 4, title: "React", img: "../images/react.jpg", desc: "React UI development" },
  { id: 5, title: "HTML", img: "../images/html.jpg", desc: "Web structure basics" },
  { id: 6, title: "CSS", img: "../images/css.jpg", desc: "Styling websites" },
  { id: 7, title: "JavaScript", img: "../images/js.jpg", desc: "Interactive web apps" },
  { id: 8, title: "Finance", img: "../images/finance.jpg", desc: "Finance basics" },
  { id: 9, title: "HR", img: "../images/hr.jpg", desc: "HR management" },
  { id: 10, title: "SQL", img: "../images/sql.jpg", desc: "Database queries" },
  { id: 11, title: "DSA", img: "../images/dsa.jpg", desc: "Algorithms" },
  { id: 12, title: "Machine Learning", img: "../images/ml.jpg", desc: "AI basics" },
  { id: 13, title: "Aptitude", img: "../images/aptitude.jpg", desc: "Exam prep" }
];

  const container = document.getElementById("modules");
  container.innerHTML = "";

  modules.forEach(m => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${m.img}" alt="${m.title}">
      <div class="card-content">
        <h3>${m.title}</h3>
        <p>${m.desc}</p>
        <button>Start Quiz</button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => {
      localStorage.setItem("moduleId", m.id);

      // ✅ FIXED REDIRECT
      window.location.href = "./quiz.html";
    });

    container.appendChild(card);
  });
}