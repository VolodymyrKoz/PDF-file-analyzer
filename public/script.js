async function uploadPDF() {
  const fileInput = document.getElementById("fileInput");
  const resultDiv = document.getElementById("result");

  const file = fileInput.files[0];

  if (file) {
    const base64PDF = await toBase64(file);

    const response = await fetch("/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ base64PDF }),
    });

    const data = await response.json();

    if (data.success) {
      resultDiv.innerHTML = `<p>${data.text}</p>`;
      sessionStorage.setItem("pdfText", data.text);
    } else {
      resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
    }
  } else {
    resultDiv.innerHTML = "Please choose a PDF file.";
  }
}

function askQuestion() {
  const userQuery = document.getElementById("userQuery").value;
  const pdfText = sessionStorage.getItem("pdfText");

  if (pdfText) {
    const queryResult = performQuery(pdfText, userQuery);
    resultDiv.innerHTML += `<p>Query Result: ${queryResult}</p>`;
  } else {
    resultDiv.innerHTML += `<p>No PDF text available. Please analyze a PDF first.</p>`;
  }
}

function performQuery(pdfText, userQuery) {
  const names = extractNames(pdfText);

  // Implement your specific queries here
  // For example, searching for names
  const regex = new RegExp(`\\b${userQuery}\\b`, "gi");
  const matches = names.filter((name) => regex.test(name));

  return matches.length > 0 ? matches.join(", ") : "No matches found.";
}

function extractNames(text) {
  // Simple implementation to extract names (assumes names start with a capital letter)
  const regex = /\b[A-Z][a-z]*\b/g;
  return text.match(regex) || [];
}