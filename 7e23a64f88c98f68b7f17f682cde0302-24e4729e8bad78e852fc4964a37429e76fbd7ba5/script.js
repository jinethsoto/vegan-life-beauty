// SPA
function mostrarSeccion(id) {
  document
    .querySelectorAll(".seccion")
    .forEach((sec) => sec.classList.remove("activo"));
  document.getElementById(id).classList.add("activo");
}

// Carrito
let carrito = [];
let productos = JSON.parse(localStorage.getItem("productos")) || [
  { nombre: "Crema", precio: 10, img: "", destacado: true },
  { nombre: "Serum", precio: 15, img: "", destacado: true },
  { nombre: "Mascarilla", precio: 12, img: "", destacado: true }
];

// Render productos
function renderProductos() {
  const cont = document.getElementById("products-list");
  cont.innerHTML = "";
  productos.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "producto-card slide-up";
    if (p.img) {
      const img = document.createElement("img");
      img.src = p.img;
      card.appendChild(img);
    }
    const h3 = document.createElement("h3");
    h3.textContent = p.nombre;
    card.appendChild(h3);
    const btn = document.createElement("button");
    btn.textContent = `Agregar - $${p.precio}`;
    btn.onclick = () => agregarCarrito(p.nombre, p.precio);
    card.appendChild(btn);
    cont.appendChild(card);
  });
  renderInicioDestacados();
}

// Render productos destacados en Inicio
function renderInicioDestacados() {
  const cont = document.getElementById("inicio-productos");
  cont.innerHTML = "";
  productos
    .filter((p) => p.destacado)
    .forEach((p) => {
      const card = document.createElement("div");
      card.className = "producto-card slide-up";
      if (p.img) {
        const img = document.createElement("img");
        img.src = p.img;
        card.appendChild(img);
      }
      const h3 = document.createElement("h3");
      h3.textContent = p.nombre;
      card.appendChild(h3);
      const btn = document.createElement("button");
      btn.textContent = `Agregar - $${p.precio}`;
      btn.onclick = () => agregarCarrito(p.nombre, p.precio);
      card.appendChild(btn);
      cont.appendChild(card);
    });
}

// Inicializar
renderProductos();

// Carrito
function agregarCarrito(nombre, precio) {
  const index = carrito.findIndex((p) => p.nombre === nombre);
  if (index !== -1) carrito[index].cantidad += 1;
  else carrito.push({ nombre, precio, cantidad: 1 });
  actualizarCarrito();
}
function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";
  let total = 0;
  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.nombre} - $${item.precio} x ${item.cantidad} = $${
      item.precio * item.cantidad
    }`;
    const btn = document.createElement("button");
    btn.textContent = "Eliminar";
    btn.onclick = () => {
      carrito.splice(index, 1);
      actualizarCarrito();
    };
    li.appendChild(document.createElement("br"));
    li.appendChild(btn);
    lista.appendChild(li);
    total += item.precio * item.cantidad;
  });
  document.getElementById("total").textContent = "Total: $" + total;
  if (carrito.length === 0)
    document.getElementById("carrito").classList.add("oculto");
}
function pagarCarrito() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  const total = carrito.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
  alert(`Gracias por tu compra! Total: $${total}`);
  carrito = [];
  actualizarCarrito();
}
function toggleCarrito() {
  const c = document.getElementById("carrito");
  c.classList.toggle("oculto");
  c.classList.add("movible");
}

// PANEL ADMIN
function mostrarAdminPrompt() {
  const pass = prompt("Ingrese la contraseña del panel admin:");
  if (pass === "jineth") {
    document.getElementById("admin-panel").classList.remove("oculto");
    renderAdminProductos();
  } else alert("Contraseña incorrecta");
}
function cerrarAdmin() {
  document.getElementById("admin-panel").classList.add("oculto");
}

// ADMIN: agregar producto con imagen
document.getElementById("admin-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const nombre = document.getElementById("admin-nombre").value;
  const precio = parseFloat(document.getElementById("admin-precio").value);
  const file = document.getElementById("admin-img").files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    productos.push({ nombre, precio, img: e.target.result, destacado: false });
    guardarProductos();
    renderProductos();
    renderAdminProductos();
  };
  if (file) reader.readAsDataURL(file);
  else {
    productos.push({ nombre, precio, img: "", destacado: false });
    guardarProductos();
    renderProductos();
    renderAdminProductos();
  }
  this.reset();
});

// ADMIN: listar productos, destacar y eliminar
function renderAdminProductos() {
  const ul = document.getElementById("admin-productos");
  ul.innerHTML = "";
  productos.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - $${p.precio}`;
    // Destacado
    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.checked = p.destacado;
    chk.onchange = () => {
      p.destacado = chk.checked;
      renderInicioDestacados();
      guardarProductos();
    };
    li.appendChild(document.createElement("br"));
    li.appendChild(document.createTextNode(" Destacado "));
    li.appendChild(chk);
    // Eliminar
    const btn = document.createElement("button");
    btn.textContent = "Eliminar";
    btn.onclick = () => {
      productos.splice(i, 1);
      renderProductos();
      renderAdminProductos();
      guardarProductos();
    };
    li.appendChild(document.createElement("br"));
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

// LocalStorage
function guardarProductos() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

// Movible paneles (drag)
document.querySelectorAll(".movible").forEach((panel) => {
  panel.onmousedown = function (e) {
    let offsetX = e.clientX - panel.offsetLeft;
    let offsetY = e.clientY - panel.offsetTop;
    function mouseMoveHandler(e) {
      panel.style.left = e.clientX - offsetX + "px";
      panel.style.top = e.clientY - offsetY + "px";
    }
    function mouseUpHandler() {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    }
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };
});

// Menú hamburguesa
function toggleMenu() {
  const nav = document.getElementById("nav-links");
  nav.classList.toggle("mostrar");
}
