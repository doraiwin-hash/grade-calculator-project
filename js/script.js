const API_BASE = "https://fakestoreapi.com/products";

// Local cache of products fetched from the API. The Fake Store API is a
// mock backend: POST/PUT/DELETE respond successfully but don't actually
// persist, so this array is what the UI renders from after each request.
let products = [];
let editingId = null;

// Form fields
const productForm = document.getElementById("productForm");
const formTitle = document.getElementById("formTitle");
const titleInput = document.getElementById("titleInput");
const priceInput = document.getElementById("priceInput");
const categoryInput = document.getElementById("categoryInput");
const customCategoryWrap = document.getElementById("customCategoryWrap");
const customCategoryInput = document.getElementById("customCategoryInput");
const descriptionInput = document.getElementById("descriptionInput");
const imageInput = document.getElementById("imageInput");
const imageFileInput = document.getElementById("imageFileInput");
const imagePreview = document.getElementById("imagePreview");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const searchInput = document.getElementById("searchInput");
const statusMessage = document.getElementById("statusMessage");
const productGrid = document.getElementById("productGrid");

const PRESET_CATEGORIES = ["electronics", "jewelery", "men's clothing", "women's clothing"];

// Data URL of a locally attached image file, if any. Takes priority over the URL field.
let attachedImageData = null;

productForm.addEventListener("submit", handleSubmit);
cancelEditBtn.addEventListener("click", exitEditMode);
searchInput.addEventListener("input", () => renderProducts(getFilteredProducts()));

categoryInput.addEventListener("change", () => {
  customCategoryWrap.classList.toggle("d-none", categoryInput.value !== "__other__");
});

imageInput.addEventListener("input", () => {
  if (imageInput.value.trim()) {
    attachedImageData = null;
    imageFileInput.value = "";
  }
  showImagePreview(imageInput.value.trim());
});

imageFileInput.addEventListener("change", () => {
  const file = imageFileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    attachedImageData = reader.result;
    imageInput.value = "";
    showImagePreview(attachedImageData);
  };
  reader.readAsDataURL(file);
});

function showImagePreview(src) {
  if (!src) {
    imagePreview.classList.add("d-none");
    imagePreview.src = "";
    return;
  }
  imagePreview.src = src;
  imagePreview.classList.remove("d-none");
}

fetchProducts();

// ---- Read ----

async function fetchProducts() {
  setStatus("Loading products...");
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    products = await response.json();
    setStatus("");
    renderProducts(getFilteredProducts());
  } catch (err) {
    setStatus("Could not load products. Please try again later.", true);
  }
}

function getFilteredProducts() {
  const query = searchInput.value.trim().toLowerCase();
  if (query === "") return products;
  return products.filter((p) => p.title.toLowerCase().includes(query));
}

function renderProducts(list) {
  productGrid.innerHTML = "";

  if (list.length === 0) {
    setStatus("No products found.");
    return;
  }
  if (statusMessage.textContent === "No products found.") {
    setStatus("");
  }

  list.forEach((product) => productGrid.appendChild(buildProductCard(product)));
}

function buildProductCard(product) {
  const col = document.createElement("div");
  col.className = "col-sm-6 col-md-4 col-lg-3";

  const card = document.createElement("div");
  card.className = "card product-card";

  const img = document.createElement("img");
  img.src = product.image || "https://via.placeholder.com/200?text=No+Image";
  img.alt = product.title;
  card.appendChild(img);

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("p");
  title.className = "product-title mb-1";
  title.textContent = product.title;
  body.appendChild(title);

  const category = document.createElement("span");
  category.className = "badge bg-secondary align-self-start mb-2";
  category.textContent = product.category;
  body.appendChild(category);

  const price = document.createElement("p");
  price.className = "product-price mb-3";
  price.textContent = `$${Number(product.price).toFixed(2)}`;
  body.appendChild(price);

  const actions = document.createElement("div");
  actions.className = "product-actions";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn btn-outline-secondary btn-sm";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => enterEditMode(product));
  actions.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-outline-danger btn-sm";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteProduct(product.id));
  actions.appendChild(deleteBtn);

  body.appendChild(actions);
  card.appendChild(body);
  col.appendChild(card);
  return col;
}

// ---- Create / Update ----

async function handleSubmit(event) {
  event.preventDefault();

  const category = categoryInput.value === "__other__"
    ? customCategoryInput.value.trim()
    : categoryInput.value;

  const payload = {
    title: titleInput.value.trim(),
    price: parseFloat(priceInput.value),
    category,
    description: descriptionInput.value.trim(),
    image: attachedImageData || imageInput.value.trim(),
  };

  if (!payload.title || isNaN(payload.price) || !payload.category) {
    alert("Please fill in title, price and category.");
    return;
  }

  if (editingId === null) {
    await createProduct(payload);
  } else {
    await updateProduct(editingId, payload);
  }
}

async function createProduct(payload) {
  setStatus("Adding product...");
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    const created = await response.json();

    // The API echoes back an id, but doesn't actually store the product.
    products.unshift({ ...payload, id: created.id ?? Date.now() });
    setStatus("");
    productForm.reset();
    customCategoryWrap.classList.add("d-none");
    attachedImageData = null;
    showImagePreview("");
    renderProducts(getFilteredProducts());
  } catch (err) {
    setStatus("Could not add the product. Please try again.", true);
  }
}

async function updateProduct(id, payload) {
  setStatus("Updating product...");
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) products[index] = { ...products[index], ...payload };

    setStatus("");
    exitEditMode();
    renderProducts(getFilteredProducts());
  } catch (err) {
    setStatus("Could not update the product. Please try again.", true);
  }
}

function enterEditMode(product) {
  editingId = product.id;
  titleInput.value = product.title;
  priceInput.value = product.price;
  descriptionInput.value = product.description || "";

  if (PRESET_CATEGORIES.includes(product.category)) {
    categoryInput.value = product.category;
    customCategoryWrap.classList.add("d-none");
    customCategoryInput.value = "";
  } else {
    categoryInput.value = "__other__";
    customCategoryWrap.classList.remove("d-none");
    customCategoryInput.value = product.category || "";
  }

  attachedImageData = null;
  imageFileInput.value = "";
  imageInput.value = product.image || "";
  showImagePreview(product.image || "");

  formTitle.textContent = "Edit Product";
  submitBtn.textContent = "Save Changes";
  cancelEditBtn.classList.remove("d-none");
  productForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function exitEditMode() {
  editingId = null;
  productForm.reset();
  customCategoryWrap.classList.add("d-none");
  attachedImageData = null;
  showImagePreview("");
  formTitle.textContent = "Add New Product";
  submitBtn.textContent = "Add Product";
  cancelEditBtn.classList.add("d-none");
}

// ---- Delete ----

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  setStatus("Deleting product...");
  try {
    const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

    products = products.filter((p) => p.id !== id);
    if (editingId === id) exitEditMode();
    setStatus("");
    renderProducts(getFilteredProducts());
  } catch (err) {
    setStatus("Could not delete the product. Please try again.", true);
  }
}

// ---- Status helper ----

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}
