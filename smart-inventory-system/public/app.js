const API_URL = "https://smart-inventory-backend-xc1s.onrender.com/api/products/";

const appState = {
    products: []
};

async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        appState.products = await response.json();
        renderProducts();
        renderOverview();
    } catch (error) {
        console.error(error);
    }
}

async function addProduct(product) {
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: product.name,
                category: product.category,
                price: parseFloat(product.price),
                quantity: parseInt(product.quantity)
            })
        });

        await loadProducts();
        closeProductModal();
    } catch (error) {
        console.error(error);
    }
}

function renderOverview() {
    document.getElementById("totalProducts").textContent =
        appState.products.length;

    document.getElementById("totalStock").textContent =
        appState.products.reduce((sum, p) => sum + p.quantity, 0);

    const tbody = document.getElementById("overviewProductsTable");

    tbody.innerHTML = appState.products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td>${product.quantity > 0 ? "In Stock" : "Out of Stock"}</td>
        </tr>
    `).join("");
}

function renderProducts() {
    const tbody = document.getElementById("productsTable");

    tbody.innerHTML = appState.products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td>${product.quantity > 0 ? "In Stock" : "Out of Stock"}</td>
            <td>-</td>
        </tr>
    `).join("");
}

function openProductModal() {
    document.getElementById("productModal").style.display = "flex";
}

function closeProductModal() {
    document.getElementById("productModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

    const productForm = document.getElementById("productForm");

    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        await addProduct({
            name: document.getElementById("productName").value,
            category: document.getElementById("productCategory").value,
            price: document.getElementById("productPrice").value,
            quantity: document.getElementById("productQuantity").value
        });
    });

    document.getElementById("addProductBtn")
        ?.addEventListener("click", openProductModal);

    document.getElementById("newProductBtn")
        ?.addEventListener("click", openProductModal);

    document.querySelectorAll(".btn-close-modal")
        .forEach(btn => btn.addEventListener("click", closeProductModal));
});