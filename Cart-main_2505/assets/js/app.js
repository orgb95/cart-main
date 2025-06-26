const listaProducto = document.querySelector('#listProducts');

// creando arreglos de productos
let productArray = [];

const contenProduc = document.querySelector('#contentProducts'); // variable contenedora de elementos del carrito
const borrarCarrito = document.querySelector('#emptyCart');

document.addEventListener('DOMContentLoaded', function () {
    Moverinfo();
    EventListeners();

});
function Moverinfo()
{
const swapy= Swapy.createSwapy(listaProducto);
Animation:'spring'

}

function EventListeners() {
    listaProducto.addEventListener('click', getDataElement);
    borrarCarrito.addEventListener('click', function () {
        productArray = [];
        productsHTML();
        actulizaContador();
        totales();
    });
  /*  const cargarprod=localStorage.getItem('products'); 

    if(localStorage)
    {
        productArray=JSON.parse(cargarprod);
        productsHTML();

    }
    else
    {
        productArray=[];
    }*/
}

function actulizaContador() {
    const contador = document.querySelector('#cartCount');
    contador.textContent = productArray.length;
}


function totales() {
    const total = document.querySelector('#total');
    let totalprod = productArray.reduce((total, prod) => total + prod.precio * prod.cantidad, 0);
    total.textContent = `$${totalprod.toFixed(2)}`;

}

function getDataElement(evento) {
    //console.log(evento.target); //Evento para extraer los valores de las etiquetas independietes
    //console.log(evento.target.classList) //evento para extraer los valores de la clase boton// 
    //console.log(evento.target.classList.contains('btn-add')) // evento para determinar si el contenido es verdadero o falo

    if (evento.target.classList.contains('btn-add')) {

        // console.log(evento.target) //extrae todos el contenido de la etiqueta boton
        // Necesitamos a traves del boton llegar a la clase que contiene toda la informacion del producto, imagen, descripcion, precio..
        //console.log(evento.target.parentElement); // estamos en el DOM listProduct
        // console.log(evento.target.parentElement.parentElement) // muestra en consola en contenido de product
        const elemtosHTML = evento.target.parentElement.parentElement; // definimos una variable para los datos de products
        selectData(elemtosHTML);

    }


}

function selectData(prod) {

    //console.log(prod); // verificamos si esta seleccionando los datos de la clase de productos

    const prodObj = { // definimos la variable de tipo objeto
        img: prod.querySelector('img').src, // seleccionamos la ruta de la imagen
        prodName: prod.querySelector('h4').textContent, // seleccionamos el nombre del producto
        precio: parseFloat(prod.querySelector('#currentPrice').textContent.replace('$', '')), // reenmplazamos el signo de dolar por un vacio y convertimos a float
        id: parseInt(prod.querySelector('button[type="button"]').dataset.id, 10),// seleccionamos el id del producto y lo convertimos a entero
        cantidad: 1
    };
    // para evitar que los productos se dupliquen

    const exist = productArray.some(prod => prod.id === prodObj.id);

    if (exist) {
        alerta('El producto ya esta en el carrito', 'error');
        return;

    }

    // console.log(prodObj); // imprimimos el objeto
    productArray = [...productArray, prodObj]; // parra llenar el arreglo con los objetos
    // console.log(productArray); // impresion en consola de los datos del arreglo

    alerta('El producto fue agregado', 'success'); //Llamado de la funcion alerta con tipo success
    productsHTML(); //funcion param mostrar en el carrito de HTML*/
    actulizaContador(); //llamado a la funcion que actualiza el contador del carrito
    totales();// llamado a la funcion que calcula el todal de prductos


}


// funcion para crear el html que va al carrito
function productsHTML() {
    cleanHTML();

    productArray.forEach(prod => {
        //console.log(prod);// imprime el arreglo de pructos

        const { img, prodName, precio, cantidad, id } = prod;

        //Creamos el contenido tr

        const tr = document.createElement('tr');
        //Creamos el contenido td imagen


        const TdImg = document.createElement('td');
        const prodImg = document.createElement('img');
        prodImg.src = img;
        TdImg.appendChild(prodImg);
        tr.appendChild(TdImg); // agregamos los elementos a la tabla

        // console.log(tr); //verificamos si se crea al tr/td


        // cramos el titulo de la producto en la tabla
        const tdTitulo = document.createElement('td');
        const prodN = document.createElement('p');
        prodN.textContent = prodName;
        tdTitulo.appendChild(prodN);


        //tr.append(TdImg, tdTitulo); //agregamos el elemento descripcion a la tabla

        // console.log(tr); //verificamos si se agrega el titulo a la tabla

        //creamos el precio del producto a la tabla

        const tdPrecio = document.createElement('td');
        const prodPrecio = document.createElement('p');
        prodPrecio.textContent = `$${precio.toFixed(2)}`; // para poner el sombolo de dolar y dos decimales
        tdPrecio.appendChild(prodPrecio);


        const tdCantidad = document.createElement('td');
        const prodCantidad = document.createElement('input');
        prodCantidad.type = 'number';
        prodCantidad.min = '1'; //para evitar numeros negativos
        prodCantidad.value = cantidad;
        prodCantidad.dataset.id = id;
        prodCantidad.oninput = ActualizarCantidadInterna; // Actualiza la cantidad de productos seleccionaso


        tdCantidad.appendChild(prodCantidad);

        // para el boton de la tabla del carrito

        const tdBorrar = document.createElement('td');
        const prodBorrar = document.createElement('button');
        prodBorrar.type = 'button';
        prodBorrar.textContent = 'X';

        // para eliminar producto con el boton
        prodBorrar.onclick = () => destruirProducto(id);
        tdBorrar.appendChild(prodBorrar);


        tr.append(TdImg, tdTitulo, tdPrecio, tdCantidad, tdBorrar); //agregamos el elemento precio a la tabla
        // console.log(tr); //verificamos si se agrega el precio a la tabla*/

        contenProduc.appendChild(tr);


        //Observacion, esto crea la tabla del carrito, esta se encuentra embebida en el HTMl, para sustituirla mendiante javascript, ubicamos la etiqueta

    });
    localSaveStorage();


}

// funcion para almacenar en locatstorage - ver en inspecionar codigo/ aplication
function localSaveStorage()
{

localStorage.setItem('products', JSON.stringify(productArray));


}

function ActualizarCantidadInterna(e) {

    const nuevaCantidad = parseInt(e.target.value, 10);
    const idprod = parseInt(e.target.dataset.id, 10);
    const product = productArray.find(prod => prod.id === idprod);

    if (product && nuevaCantidad > 0) {
        product.cantidad = nuevaCantidad;
    }
    productsHTML();
    totales();

}

function destruirProducto(idprod) {
    console.log('elemento borrado', idprod);
    productArray = productArray.filter(prod => prod.id !== idprod);
    console.log(productArray);
    alerta('El producto fue eliminado', 'success');

    //llamado de funciones
    productsHTML();
    actulizaContador();
    totales();

}

function cleanHTML() {
    console.log('Hola mundo');
    contenProduc.innerHTML = ''
}

// la mandamos a llamar de SelectData
function alerta(mensaje, type) {

    const nonrepeatalert = document.querySelector('.alert');
    if (nonrepeatalert)
        nonrepeatalert.remove // para no repetir la alerta
    const div = document.createElement('div');
    div.classList.add('alert', type);
    div.textContent = mensaje;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 5000);

}