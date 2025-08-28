document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");

  fetch("/images")
    .then(res => res.json())
    .then(files => {
      gallery.innerHTML = files.map((url, i) => `
        <img src="${url}" alt="Minecraft Screenshot" style="animation-delay:${i * 0.1}s">
      `).join("");
    });
});
