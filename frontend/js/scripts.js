import { apiRequest } from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            tab.classList.add("active");
            const selectedTab = tab.getAttribute("data-tab");
            document.getElementById(selectedTab + "Form").classList.add("active");
        });
    });

    const loginModal = document.getElementById("loginModal");
    const closeLogin = document.getElementById("closeLogin");
    const loginForm = document.getElementById("loginForm");
    const appContent = document.getElementById("appContent");

    // Show modal if not logged in
    const token = localStorage.getItem("access_token");
    if (!token) {
        loginModal.classList.add("show");
    } else {
        appContent.style.display = "flex";
    }

    // Close modal (disable manual close unless debugging)
    closeLogin.addEventListener("click", () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            loginModal.classList.remove("show");
        } else {
            showToast("You must login to use the app.", "error");
        }
    });

    // Optional: remove Login/Register after login
    function updateNavAfterLogin() {
        document.querySelector(".nav-right").innerHTML = `<span>👤 Logged In</span>`;
    }

    // Login form
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const data = await apiRequest('/auth/login', 'POST', { email, password });
            // Success actions
            localStorage.setItem("access_token", data.access_token);
            loginModal.classList.remove("show");
            appContent.style.display = "flex"; // Ensure #appContent exists and is hidden initially
            updateNavAfterLogin(); // This should update nav UI (like hiding Login/Register)
            await populateOriginsAndDestinations(data.access_token);
            showToast("Login successful!");
        } catch (error) {
            showToast(error.message || "Login failed", true);
        }
    });

    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = message;

        const container = document.getElementById("toastContainer");
        container.appendChild(toast);

        // Remove after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    async function populateOriginsAndDestinations(token) {
        try {
            const originsRes = await apiRequest('/flights/origins', 'GET', null, token);
            const destinationsRes = await apiRequest('/flights/destinations', 'GET', null, token);

            const originSelect = document.getElementById('origin');
            const destinationSelect = document.getElementById('destination');

            // Clear previous options except default
            originSelect.length = 1;
            destinationSelect.length = 1;

            originsRes.data.forEach(origin => {
                const opt = document.createElement('option');
                opt.value = origin;
                opt.textContent = origin;
                originSelect.appendChild(opt);
            });

            destinationsRes.data.forEach(dest => {
                const opt = document.createElement('option');
                opt.value = dest;
                opt.textContent = dest;
                destinationSelect.appendChild(opt);
            });

        } catch (err) {
            console.error('Failed to populate airports:', err);
            showToast('Could not load origins/destinations', true);
        }
    }

});
