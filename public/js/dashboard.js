// Dark Mode Toggle
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

// Success Popup Trigger Example
function showSuccess() {
    const popup = document.getElementById("successPopup");
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}