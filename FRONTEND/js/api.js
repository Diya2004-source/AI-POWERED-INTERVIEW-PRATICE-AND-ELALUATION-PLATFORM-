const BASE_URL = "http://127.0.0.1:8000/api/";

async function postAPI(endpoint, data) {
  try {
    const res = await fetch(BASE_URL + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return await res.json();

  } catch (err) {
    console.error("API Error:", err);
    return { error: "Server error" };
  }
}