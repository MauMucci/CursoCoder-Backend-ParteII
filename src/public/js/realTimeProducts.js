console.log("HOLA DESDE EL REAL TIME PRODUCTS");

const socket = io();

const addProductForm = document.getElementById('addProductForm')

//Manejo el envio del formulario
addProductForm.addEventListener('submit',async (event) => {
    event.preventDefault();  // Evita que el formulario se envíe de forma normal
    

    //obtengo los datos del formulario
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const status = document.getElementById('status').value;


 //Armo el producto para luego enviarlo
 const product={
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status
}
// Emito un mensaje al servidor con el nuevo producto
socket.emit('addProduct',product);
console.log(`Producto agregado ${product.title} RTP`) //esto lo muestra en el sit

// Limpiar los campos del formulario
addProductForm.reset();

});


const deleteProductForm = document.getElementById('deleteProductForm');

deleteProductForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe normalmente
    const productId = document.getElementById('productId').value; // Obtiene el ID del producto a eliminar del campo de entrada
    socket.emit('deleteProduct', productId); // Envía el ID del producto al servidor para eliminarlo

    deleteProductForm.reset();  // Limpia el formulario
});


// Actualizar la lista de productos en tiempo real
socket.on('updateProducts', (products) => {
    const productList = document.getElementById('realTimeProductsList');
    productList.innerHTML = '';

    products.forEach(product => {
        const item = document.createElement('li');
        item.className = 'list-group-item';
        item.innerHTML = `
            <strong>${product.title}</strong>: ${product.description} - $${product.price}
        `;
        productList.appendChild(item);
    });
});