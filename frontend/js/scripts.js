import { apiRequest } from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
    (async () => {
        const isValid = await validateToken();

        // if (!isValid) {
        //     window.location.href = `${window.APP_CONFIG.UI_BASE_URL}/login.html`;
        //     return;
        // }

        document.getElementById("appContent").style.display = "flex";
    })();
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
    const searchForm = document.getElementById("searchForm");

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
    async function updateNavAfterLogin() {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        try {
            const profile = await apiRequest('/auth/profile', 'GET', null, token);
            const email = profile?.email || "User";
            document.getElementById("welcomeUser").innerHTML = `👋 Welcome, <strong>${email}</strong>!`;
        } catch (err) {
            console.error("Failed to fetch user profile:", err.message);
            showToast("Failed to load user info", true);
        }
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

    searchForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const origin = document.getElementById("origin").value;
        const destination = document.getElementById("destination").value;
        const departureDate = document.getElementById("departureDate").value;
        const passengers = document.getElementById("passengers").value;

        const token = localStorage.getItem("access_token");

        if (!token) {
            showToast("You must login to search flights", true);
            return;
        }

        try {
            const params = new URLSearchParams({
                origin,
                destination,
                date: departureDate,
                passengers
            });

            const res = await apiRequest(`/flights/search?${params.toString()}`, "GET", null, token);
            const totalFlights = res.totalItems || 0;
            showToast(`Fetched ${totalFlights} flight${totalFlights === 1 ? '' : 's'}`);
            displayFlights(res.data); // ✅ Helper to render flights

        } catch (error) {
            showToast(error.message || "Flight search failed", true);
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

    async function displayFlights(flights) {
        const container = document.getElementById("flightResults");
        container.innerHTML = ""; // Clear previous results

        if (flights.length === 0) {
            container.innerHTML = "<p>No flights found.</p>";
            return;
        }

        flights.forEach(flight => {
            const card = document.createElement("div");
            card.className = "flight-card";

            const departureTime = new Date(flight.departure).toLocaleTimeString([], {
                hour: "2-digit", minute: "2-digit", hour12: true
            });

            const arrivalTime = new Date(flight.arrival).toLocaleTimeString([], {
                hour: "2-digit", minute: "2-digit", hour12: true
            });

            card.innerHTML = `
            <div class="card-left">
                <h2 class="flight-price">₹${flight.price}</h2>
                <p class="flight-name">${flight.airline} (${flight.airline_code}${flight.flight_number})</p>
                <p class="flight-route">${flight.origin} → ${flight.destination}</p>
                <p>Depart: ${departureTime}</p>
                <p>Arrive: ${arrivalTime}</p>
            </div>
            <div class="card-right">
                <button class="book-btn">Book this ticket</button>
            </div>
            `;
            container.appendChild(card);
        });
    }

    async function validateToken() {
        const token = localStorage.getItem("access_token");
        if (!token) return false;

        try {

            await apiRequest('/auth/profile', 'GET', null, token); // Will throw if token is invalid
            return true;
        } catch (err) {
            console.error("Token validation failed:", err.message);
            localStorage.removeItem("access_token");
            return false;
        }
    }
});
