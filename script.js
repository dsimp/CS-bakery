var bakeryProducts = [
    { id: "bread", name: "Daily Breads", note: "Sourdough, honey oat, and rye" },
    { id: "pastry", name: "Morning Pastries", note: "Croissants, muffins, and cinnamon rolls" },
    { id: "cake", name: "Cakes", note: "Birthday and event cakes" },
    { id: "signature", name: "Signature Sourdough Loaf", note: "Baked every morning" }
];

var savedFavorites = [];

function loadFavorites() {
    var stored = localStorage.getItem("nsbFavorites");
    if (stored) {
        savedFavorites = JSON.parse(stored);
    } else {
        savedFavorites = [];
    }
}

function saveFavorites() {
    localStorage.setItem("nsbFavorites", JSON.stringify(savedFavorites));
}

function toggleFavorite(productId) {
    var index = savedFavorites.indexOf(productId);
    if (index === -1) {
        savedFavorites.push(productId);
    } else {
        savedFavorites.splice(index, 1);
    }
    saveFavorites();
    renderFavorites();
    updateFavoriteButtons();
}

function getProductById(productId) {
    var i;
    for (i = 0; i < bakeryProducts.length; i++) {
        if (bakeryProducts[i].id === productId) {
            return bakeryProducts[i];
        }
    }
    return null;
}

function renderFavorites() {
    var list = document.getElementById("saved-list");
    var message = document.getElementById("saved-message");
    if (!list) {
        return;
    }
    list.innerHTML = "";
    if (savedFavorites.length === 0) {
        if (message) {
            message.textContent = "No items saved yet. Tap Save for pickup on an item you want later.";
        }
        return;
    }
    if (message) {
        message.textContent = "Saved for pickup (" + savedFavorites.length + "):";
    }
    var i;
    for (i = 0; i < savedFavorites.length; i++) {
        var item = getProductById(savedFavorites[i]);
        if (item) {
            var li = document.createElement("li");
            li.textContent = item.name + " - " + item.note;
            list.appendChild(li);
        }
    }
}

function updateFavoriteButtons() {
    var buttons = document.querySelectorAll("[data-product]");
    var i;
    for (i = 0; i < buttons.length; i++) {
        var id = buttons[i].getAttribute("data-product");
        if (savedFavorites.indexOf(id) !== -1) {
            buttons[i].textContent = "Saved";
        } else {
            buttons[i].textContent = "Save for pickup";
        }
    }
}

function setupFavoriteButtons() {
    var buttons = document.querySelectorAll("[data-product]");
    var i;
    for (i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function (event) {
            var id = event.target.getAttribute("data-product");
            toggleFavorite(id);
        });
    }
}

function showError(fieldId, message) {
    var box = document.getElementById(fieldId + "-error");
    var field = document.getElementById(fieldId);
    if (box) {
        box.textContent = message;
    }
    if (field) {
        field.classList.add("invalid");
    }
}

function clearError(fieldId) {
    var box = document.getElementById(fieldId + "-error");
    var field = document.getElementById(fieldId);
    if (box) {
        box.textContent = "";
    }
    if (field) {
        field.classList.remove("invalid");
    }
}

function isValidEmail(email) {
    return email.indexOf("@") !== -1 && email.indexOf(".") !== -1;
}

function validateContactForm(event) {
    var nameValue = document.getElementById("fullname").value.trim();
    var emailValue = document.getElementById("email").value.trim();
    var detailsValue = document.getElementById("itemdetails").value.trim();
    var formOk = true;

    clearError("fullname");
    clearError("email");
    clearError("itemdetails");

    if (nameValue.length < 2) {
        showError("fullname", "Please enter your first and last name.");
        formOk = false;
    }

    if (!isValidEmail(emailValue)) {
        showError("email", "Please enter a valid email like name@email.com.");
        formOk = false;
    }

    if (detailsValue.length < 8) {
        showError("itemdetails", "Please add a little more detail about what you want to order.");
        formOk = false;
    }

    if (!formOk) {
        event.preventDefault();
        return false;
    }

    saveFormDraft();
    event.preventDefault();
    document.getElementById("form-success").textContent = "Request ready to send. Your name and email were saved for next time.";
    return false;
}

function saveFormDraft() {
    var draft = {
        fullname: document.getElementById("fullname").value,
        email: document.getElementById("email").value
    };
    localStorage.setItem("nsbFormDraft", JSON.stringify(draft));
}

function loadFormDraft() {
    var stored = localStorage.getItem("nsbFormDraft");
    if (!stored) {
        return;
    }
    var draft = JSON.parse(stored);
    if (draft.fullname && document.getElementById("fullname")) {
        document.getElementById("fullname").value = draft.fullname;
    }
    if (draft.email && document.getElementById("email")) {
        document.getElementById("email").value = draft.email;
    }
}

function setupContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) {
        return;
    }
    loadFormDraft();
    form.addEventListener("submit", validateContactForm);
    document.getElementById("fullname").addEventListener("blur", saveFormDraft);
    document.getElementById("email").addEventListener("blur", saveFormDraft);
}

function initPage() {
    loadFavorites();
    setupFavoriteButtons();
    renderFavorites();
    updateFavoriteButtons();
    setupContactForm();
}

document.addEventListener("DOMContentLoaded", initPage);
