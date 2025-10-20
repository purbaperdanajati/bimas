const scriptURL = "https://script.google.com/macros/s/AKfycbyu2gOnsWRuqrugz9bdF5BaaJ9pwQ4RaRLBOa32RWo4HJ57I9ihCArfLz64Eby7sqHnYQ/exec"; // URL Web App kamu

document.getElementById("dataForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  console.log("🔸 Mengirim data ke:", scriptURL);
  for (let pair of formData.entries()) {
    console.log("   ➤", pair[0], "=", pair[1]);
  }

  document.getElementById("status").innerText = "Mengirim...";

  try {
    const res = await fetch(scriptURL, { method: "POST", body: formData });
    console.log("📥 Response status:", res.status);
    const text = await res.text();
    console.log("📄 Response body:", text);
    document.getElementById("status").innerText = text;
  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
    document.getElementById("status").innerText = "Error: " + err.message;
  }
});
