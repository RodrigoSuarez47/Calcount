//Actualización: 22/3/2024
/*Se desarrolla y se prueba con las siguientes credenciales:
Usuario: Rodrigo
Password: 1234
*/

//Constantes
const router = document.querySelector("#ruteo");
const menu = document.querySelector("#menu");
const home = document.querySelector("#pantalla-home");
const login = document.querySelector("#pantalla-login");
const registroUsuario = document.querySelector("#pantalla-registroUsuario");
const registroComida = document.querySelector("#pantalla-registroComida");
const listarComidas = document.querySelector("#pantalla-listarComidas");
const informeCalorias = document.querySelector("#pantalla-informeCalorias");
const mapa = document.querySelector("#pantalla-mapa");
let arrayAlimentos = new Array();
let ultimosRegistrosObtenidos = new Array();

//EndPoint de API
const URLBase = "https://calcount.develotion.com/";

Inicio()

function Inicio() {
    Eventos();
    ChequearSesion();
    LimitarFecha();
    ObtenerAlimentos();
    ObtenerMiPosicion();
}

function CerrarMenu() {
    menu.close();
}

function Eventos() {
    router.addEventListener("ionRouteDidChange", Navegar);
    document.querySelector("#btnRegistrarUsuario").addEventListener("click", ObtenerPaises);
    document.querySelector("#btnConfirmarRegistrarUsuario").addEventListener("click", RegistrarUsuario);
    document.querySelector("#btnHacerLogin").addEventListener("click", LoguearUsuario);
    document.querySelector("#btnRegistrarComida").addEventListener("click", ObtenerAlimentos);
    document.querySelector("#btnConfirmarRegistroComida").addEventListener("click", RegistrarComida);
    document.querySelector("#btnListarComidas").addEventListener("click", LimpiarListadoComidas);
    document.querySelector("#btnConfirmarListarComidas").addEventListener("click", ObtenerRegistros);
    document.querySelector("#btnInformeCalorias").addEventListener("click", MostrarInformeDeCalorias);
    document.querySelector("#btnConfirmarFiltrarMapa").addEventListener("click", ObtenerUsuariosPorPais);

}

function Navegar(evento) {
    OcultarPantallas();
    if (evento.detail.to == "/") home.style.display = "block";
    if (evento.detail.to == "/login") {
        login.style.display = "block";
        document.querySelector("#txtLoginUsuario").value = "";
        document.querySelector("#txtLoginPassword").value = "";
    }
    if (evento.detail.to == "/registrarUsuario") {
        registroUsuario.style.display = "block";
        document.querySelector("#txtRegistroUsuario").value = "";
        document.querySelector("#txtRegistroPassword").value = "";
        document.querySelector("#selRegistroPais").value = "";
        document.querySelector("#txtCaloriasDiarias").value = "";

    }
    if (evento.detail.to == "/registrarComida") {
        registroComida.style.display = "block";
        document.querySelector("#selRegistroComidaAlimento").value = "";
        document.querySelector("#txtRegistroComidaCantidad").value = "";
        document.querySelector("#txtRegistroComidaFecha").value = "";
    }
    if (evento.detail.to == "/listarComidas") {
        listarComidas.style.display = "block";
        document.querySelector("#txtListarComidaDesde").value = "";
        document.querySelector("#txtListarComidaHasta").value = "";
    }
    if (evento.detail.to == "/informeCalorias") informeCalorias.style.display = "block";
    if (evento.detail.to == "/mapa") {
        mapa.style.display = "block";
        document.querySelector("#txtMapaDeRegistrosFiltro").value = "";
    }
}

function OcultarPantallas() {
    home.style.display = "none";
    login.style.display = "none";
    registroUsuario.style.display = "none";
    registroComida.style.display = "none";
    listarComidas.style.display = "none";
    informeCalorias.style.display = "none"
    mapa.style.display = "none"
}

function ChequearSesion() {
    OcultarBotonesMenu();
    if (localStorage.getItem("id") !== null && localStorage.getItem("token") !== null) {
        MostrarMenuTotal();
    } else {
        MostrarMenuParcial();
    }
}

function OcultarBotonesMenu() {
    document.querySelector("#btnHome").style.display = "none";
    document.querySelector("#btnLogin").style.display = "none";
    document.querySelector("#btnRegistrarUsuario").style.display = "none";
    document.querySelector("#btnRegistrarComida").style.display = "none";
    document.querySelector("#btnListarComidas").style.display = "none";
    document.querySelector("#btnInformeCalorias").style.display = "none";
    document.querySelector("#btnVerMapa").style.display = "none";
    document.querySelector("#btnCerrarSesion").style.display = "none";
}

function MostrarMenuTotal() {
    document.querySelector("#btnHome").style.display = "block";
    document.querySelector("#btnRegistrarComida").style.display = "block";
    document.querySelector("#btnListarComidas").style.display = "block";
    document.querySelector("#btnInformeCalorias").style.display = "block";
    document.querySelector("#btnVerMapa").style.display = "block";
    document.querySelector("#btnCerrarSesion").style.display = "block";
}

function MostrarMenuParcial() {
    document.querySelector("#btnHome").style.display = "block";
    document.querySelector("#btnLogin").style.display = "block";
    document.querySelector("#btnRegistrarUsuario").style.display = "block";
}

//Mostrar mensaje:
function MostrarMensaje(tipo, titulo, texto, duracion) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = texto;
    if (!duracion) {
        duracion = 2000;
    }
    toast.duration = duracion;
    if (tipo === "ERROR") {
        toast.color = 'danger';
        toast.icon = "alert-circle-outline";
    } else if (tipo === "WARNING") {
        toast.color = 'warning';
        toast.icon = "warning-outline";
    } else if (tipo === "SUCCESS") {
        toast.color = 'success';
        toast.icon = "checkmark-circle-outline";
    }
    document.body.appendChild(toast);
    toast.present();
}

//LOGIN:
//Clases:
class UsuarioLogin {
    constructor(usuario, password) {
        this.usuario = usuario;
        this.password = password;
    }
}

function LoguearUsuario() {
    let usuario = document.querySelector("#txtLoginUsuario").value;
    let password = document.querySelector("#txtLoginPassword").value;
    if (usuario !== "" && usuario !== undefined) {
        if (password !== "" && password !== undefined) {
            let usuarioRecibido = new UsuarioLogin(usuario, password)
            LoguearUsuarioEnAPI(usuarioRecibido);
        } else {
            MostrarMensaje("ERROR", "Error", "Ingrese su contraseña", 5000)
        }
    } else {
        MostrarMensaje("ERROR", "Error", "Ingrese su usuario", 5000)
    }
}

function LoguearUsuarioEnAPI(usuarioRecibido) {
    fetch(`${URLBase}login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioRecibido)
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            if (data.id !== "" && data.id !== undefined && data.apiKey !== "" && data.apiKey !== undefined) {
                localStorage.setItem('id', data.id);
                localStorage.setItem('token', data.apiKey);
                localStorage.setItem('caloriasDiarias', data.caloriasDiarias);
                MostrarMensaje("SUCCESS", "Bienvenido", "Ha iniciado sesión correctamente", 5000);
                OcultarPantallas();
                OcultarBotonesMenu();
                home.style.display = "block"
                MostrarMenuTotal()
            } else {
                MostrarMensaje("ERROR", "Error", `${data.mensaje}`, 5000);
            }
        })
        .catch(function (error) {
            MostrarMensaje("ERROR", "Error", `${error}`, 10000);
        })
}

//Registro Usuarios:
//Clases:
class UsuarioRegistro {
    constructor(usuario, password, idPais, caloriasDiarias) {
        this.usuario = usuario;
        this.password = password;
        this.idPais = idPais;
        this.caloriasDiarias = caloriasDiarias;
    }
}

function RegistrarUsuario() {
    let usuario = document.querySelector("#txtRegistroUsuario").value;
    let password = document.querySelector("#txtRegistroPassword").value;
    let idPais = Number(document.querySelector("#selRegistroPais").value);
    let caloriasDiarias = Number(document.querySelector("#txtCaloriasDiarias").value);

    if (usuario !== "" && usuario !== undefined) {
        if (password !== "" && password !== undefined) {
            if (idPais > 0 && idPais !== undefined) {
                if (caloriasDiarias > 0 && caloriasDiarias !== undefined) {
                    let nuevoUsuario = new UsuarioRegistro(usuario, password, idPais, caloriasDiarias)
                    RegistrarUsuarioEnAPI(nuevoUsuario);
                } else {
                    MostrarMensaje("ERROR", "Error", "Debe ingresar calorias diarias", 5000)
                }
            } else {
                MostrarMensaje("ERROR", "Error", "Debe seleccionar un País", 5000)
            }
        } else {
            MostrarMensaje("ERROR", "Error", "La contraseña ingresada no cumple los requisitos", 5000)
        }
    } else {
        MostrarMensaje("ERROR", "Error", "El usuario ingresado es incorrecto", 5000)
    }
}

function RegistrarUsuarioEnAPI(usuarioRecibido) {
    fetch(`${URLBase}usuarios.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioRecibido)
    })
        .then(function (response) {
            if (response.status == 200) {
                MostrarMensaje("SUCCESS", "Confirmación", "Se ha registrado correctamente, procederemos a iniciar sesión", 5000);
                document.querySelector("#txtRegistroUsuario").value = "";
                document.querySelector("#txtRegistroPassword").value = "";
                document.querySelector("#selRegistroPais").value = "";
                document.querySelector("#txtCaloriasDiarias").value = "";
                LoguearUsuarioEnAPI(usuario);
            }
            return response.json()
        })
        .then(function (data) {
            if (data.mensaje !== undefined && data.mensaje !== "") MostrarMensaje("ERROR", "Error", `${data.mensaje}`, 5000);
        })
        .catch(function (error) {
            MostrarMensaje("ERROR", "Error", `${error}`, 5000);
        })
}

//Obtener Paises:
function ObtenerPaises() {
    fetch(`${URLBase}paises.php`, {
        method: 'GET',
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            InsertarPaises(data.paises);
            listaPaises = data.paises;
        })
        .catch(function (error) {
            console.log(error)
        })
}

function InsertarPaises(paisesRecibidos) {
    let opciones = `<ion-select-option value="0" disabled>Seleccione su País</ion-select-option>`;
    for (let pais of paisesRecibidos) {
        opciones += `<ion-select-option value="${pais.id}">${pais.name}</ion-select-option>`;
    }
    document.querySelector("#selRegistroPais").innerHTML = opciones;
}

//Cerrar Sesion:
function CerrarSesion() {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    ChequearSesion();
    OcultarPantallas();
    home.style.display = "block";
}

//Obtener Alimentos:
function ObtenerAlimentos() {
    fetch(`${URLBase}alimentos.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': `${localStorage.getItem('token')}`,
            'iduser': `${localStorage.getItem('id')}`
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            arrayAlimentos = data.alimentos;
            InsertarAlimentos(data.alimentos);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function InsertarAlimentos(alimentosRecibidos) {
    let opciones = `<ion-select-option value="0" disabled>Seleccione alimento</ion-select-option>`;
    for (let alimento of alimentosRecibidos) {
        opciones += `<ion-select-option value="${alimento.id}">${alimento.nombre}</ion-select-option>`;
    }
    document.querySelector("#selRegistroComidaAlimento").innerHTML = opciones;
}


//Registrar Comida
//Clases:
class RegistroComida {
    constructor(idAlimento, idUsuario, cantidad, fecha) {
        this.idAlimento = idAlimento;
        this.idUsuario = idUsuario;
        this.cantidad = cantidad;
        this.fecha = fecha;
    }
}

//Limitar fecha seleccionada por el usuario:
function LimitarFecha() {
    let hoy = new Date();
    let hoyFormato = hoy.toISOString().slice(0, 10);
    let ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);
    let ayerFormato = ayer.toISOString().slice(0, 10);
    document.getElementById("txtRegistroComidaFecha").setAttribute("min", ayerFormato);
    document.getElementById("txtRegistroComidaFecha").setAttribute("max", hoyFormato);
}

//Obtener fecha actual:
function ObtenerFechaActualFormateada() {
    const now = new Date();
    const year = now.getFullYear().toString();
    let month = (now.getMonth() + 1).toString();
    if (month.length === 1) {
        month = `0${month}`;
    }
    let day = now.getDate().toString();
    if (day.length === 1) {
        day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
}

function RegistrarComida() {
    let idAlimento = Number(document.querySelector("#selRegistroComidaAlimento").value);
    let idUsuario = localStorage.getItem('id');
    let cantidad = Number(document.querySelector("#txtRegistroComidaCantidad").value);
    let fechaString = document.querySelector("#txtRegistroComidaFecha").value;

    let hoy = new Date();
    let ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);
    hoy.setHours(0, 0, 0, 0);
    ayer.setHours(0, 0, 0, 0);

    if (idAlimento && idAlimento > 0) {
        if (cantidad && cantidad > 0) {
            if (fechaString) {
                let [año, mes, dia] = fechaString.split('-');
                let fecha = new Date(año, mes - 1, dia);
                if (!isNaN(fecha.getTime()) && fecha <= hoy && fecha >= ayer) {
                    let comida = new RegistroComida(idAlimento, idUsuario, cantidad, fecha);
                    RegistrarComidaEnAPI(comida);
                } else {
                    MostrarMensaje("ERROR", "Error", "Debe ingresar una fecha válida y dentro del rango permitido", 5000);
                }
            } else {
                MostrarMensaje("ERROR", "Error", "Debe ingresar una fecha", 5000);
            }
        } else {
            MostrarMensaje("ERROR", "Error", "Debe ingresar una cantidad válida", 5000);
        }
    } else {
        MostrarMensaje("ERROR", "Error", "Debe seleccionar un alimento", 5000);
    }
}

function RegistrarComidaEnAPI(comidaRecibida) {
    fetch(`${URLBase}registros.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': `${localStorage.getItem('token')}`,
            'iduser': `${localStorage.getItem('id')}`
        },
        body: JSON.stringify(comidaRecibida)
    })
        .then(function (response) {
            if (response.status == 200) {
                document.querySelector("#selRegistroComidaAlimento").value = "";
                document.querySelector("#txtRegistroComidaCantidad").value = "";
                document.querySelector("#txtRegistroComidaFecha").value = "";
            }
            return response.json();
        })
        .then(function (data) {
            if (data.mensaje !== undefined && data.mensaje !== "") {
                MostrarMensaje("SUCCESS", "", `${data.mensaje}`, 5000);
            }
        })
        .catch(function (error) {
            MostrarMensaje("ERROR", "Error", `${error}`, 5000);
        })
}

//Obtener Registros:
function LimpiarListadoComidas() {
    document.querySelector("#divListarAlimentos").innerHTML = "";
}

function ObtenerRegistros() {
    fetch(`${URLBase}registros.php?idUsuario=${localStorage.getItem('id')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': `${localStorage.getItem('token')}`,
            'iduser': `${localStorage.getItem('id')}`
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ultimosRegistrosObtenidos = data.registros;
            MostrarRegistros(data.registros);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function MostrarRegistros(registrosRecibidos) {
    let html = "";
    let fechaDesde = document.querySelector("#txtListarComidaDesde").value;
    let fechaHasta = document.querySelector("#txtListarComidaHasta").value;

    for (let registro of registrosRecibidos) {
        let alimento = BuscarAlimentoPorId(registro.idAlimento);
        if (alimento !== null) {
            let sufijoAlimento = ObtenerSufijoAlimento(alimento.id);
            if ((!fechaDesde || registro.fecha >= fechaDesde) && (!fechaHasta || registro.fecha <= fechaHasta)) {
                let card =
                    `<ion-card class="ion-margin ion-padding"> 
                    <img alt="${alimento.nombre}" src="https://calcount.develotion.com/imgs/${alimento.id}.png"/>
                    <ion-card-header>
                        <ion-card-title>${alimento.nombre}</ion-card-title>
                        <ion-card-subtitle>Calorias ingeridas: ${CalcularCaloriasIngeridas(alimento, registro.cantidad, sufijoAlimento)}</ion-card-subtitle>
                    </ion-card-header>
                    <ion-card-content>
                        <ion-button shape="round" color="danger" onclick="EliminarRegistro(${registro.id})">Eliminar</ion-button>
                    </ion-card-content>
                    </ion-card>`;
                html += card;
            }
        }
    }

    if (html === "") {
        MostrarMensaje("WARNING", "ALERTA", "No se encontraron registros para las fechas seleccionadas", 5000);
    } else {
        document.querySelector("#divListarAlimentos").innerHTML = html;
        if (fechaDesde && fechaHasta) {
            MostrarMensaje("SUCCESS", "", "Se listaron todos los registros entre las fechas seleccionadas", 5000);
        } else if (fechaDesde) {
            MostrarMensaje("SUCCESS", "", "Se listaron todos los registros desde la fecha seleccionada", 5000);
        } else if (fechaHasta) {
            MostrarMensaje("SUCCESS", "", "Se listaron todos los registros hasta la fecha seleccionada", 5000);
        }
    }
}

//Buscar alimento
function BuscarAlimentoPorId(idAlimentoRecibido) {
    for (let elemento of arrayAlimentos) {
        if (elemento.id === idAlimentoRecibido) return elemento;
    }
    return null;
}

//Obtener sufijo
function ObtenerSufijoAlimento(idAlimento) {
    for (let alimento of arrayAlimentos) {
        if (alimento.id === idAlimento) {
            let porcion = alimento.porcion;

            let ultimaLetra = porcion[porcion.length - 1];
            if (ultimaLetra === "g") return "gramos";
            if (ultimaLetra === "u") return "unidades";
            return "militros";
        }
    }
}

//Calcular calorias
function CalcularCaloriasIngeridas(alimento, cantidadIngerida, sufijoAlimento) {
    let caloriasPorPorcion = alimento.calorias;
    let caloriasIngeridas = 0;

    let porcionNumerica = parseFloat(alimento.porcion);

    switch (sufijoAlimento) {
        case "gramos":
        case "mililitros":
            caloriasIngeridas = (caloriasPorPorcion / porcionNumerica) * cantidadIngerida;
            break;
        case "unidades":
            caloriasIngeridas = caloriasPorPorcion * cantidadIngerida;
            break;
    }
    return caloriasIngeridas;
}

//Eliminar Registro
function EliminarRegistro(idRegistro) {
    fetch(`${URLBase}/registros.php?idRegistro=${idRegistro}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'apikey': `${localStorage.getItem('token')}`,
            'iduser': `${localStorage.getItem('id')}`
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.codigo === 200) {
                MostrarMensaje("SUCCESS", "Eliminado", `${data.mensaje}`, 5000);
                LimpiarListadoComidas();
                ObtenerRegistros();
            }
            else MostrarMensaje("WARNING", "Ops...", `${data.mensaje}`, 5000);
            setTimeout(function () {
                ObtenerRegistros();
            }, 5000)
        })
        .catch(function (error) {
            console.log(error);
        });
}

//Informe de Calorias: 
function MostrarInformeDeCalorias() {
    MostrarCargaInformeDeCalorias();
    ObtenerRegistros();
    // Le doy tiempo a ObtenerRegistros().
    setTimeout(function () {
        let caloriasTotales = CalcularCaloriasTotales();
        let mensajeCaloriasTotales = `Usted ha ingerido en total: ${caloriasTotales.toFixed(0)} calorias`;

        let caloriasDiarias = CalcularCaloriasDiarias();
        //Extras:
        let proteinasDiarias = CalcularNutrienteDiario("proteinas");
        let carbohidratosDiarios = CalcularNutrienteDiario("carbohidratos");
        let grasasDiarias = CalcularNutrienteDiario("grasas");
        //
        let mensajeCaloriasDiarias = `Usted ha ingerido ${caloriasDiarias.toFixed(0)} calorias <br>
        <br>
        Proteinas: ${proteinasDiarias.toFixed(0)} gramos. <br> 
        <br>
        Carbohidratos: ${carbohidratosDiarios.toFixed(0)} gramos. <br>
        <br>
        Grasas: ${grasasDiarias.toFixed(0)} gramos. <br>`;

        OcultarCargaInformeDeCalorias();

        document.querySelector("#subtituloCaloriasTotales").innerHTML = mensajeCaloriasTotales;
        document.querySelector("#subtituloCaloriasDiarias").innerHTML = mensajeCaloriasDiarias;

        let caloriasMaximasUsuario = parseInt(localStorage.getItem("caloriasDiarias"));
        let cardCaloriasDiarias = document.querySelector("#cardCaloriasDiarias");
        if (caloriasDiarias > caloriasMaximasUsuario) {
            cardCaloriasDiarias.setAttribute("color", "danger");
        } else if (caloriasDiarias >= caloriasMaximasUsuario * 0.9) {
            cardCaloriasDiarias.setAttribute("color", "warning");
        } else {
            cardCaloriasDiarias.setAttribute("color", "success");
        }
    }, 2000);
}


//Calorias totales:
function CalcularCaloriasTotales() {
    let registros = ultimosRegistrosObtenidos;
    let caloriasTotales = 0;
    for (let registro of registros) {
        let alimento = BuscarAlimentoPorId(registro.idAlimento);
        if (alimento !== null) {
            let sufijoAlimento = ObtenerSufijoAlimento(alimento.id);
            caloriasTotales += CalcularCaloriasIngeridas(alimento, registro.cantidad, sufijoAlimento);
        }
    }
    return caloriasTotales;
}

//Calorias Diarias:
function CalcularCaloriasDiarias() {
    let registros = ultimosRegistrosObtenidos;
    let caloriasIngeridas = 0;
    let hoy = ObtenerFechaActualFormateada();
    for (let registro of registros) {
        if (registro.fecha === hoy) {
            let alimento = BuscarAlimentoPorId(registro.idAlimento);
            if (alimento !== null) {
                let sufijoAlimento = ObtenerSufijoAlimento(alimento.id);
                caloriasIngeridas += CalcularCaloriasIngeridas(alimento, registro.cantidad, sufijoAlimento);
            }
        }
    }
    return caloriasIngeridas;
}

function MostrarCargaInformeDeCalorias() {
    document.querySelector("#contenidoInformeCalorias").innerHTML = `<ion-item>
    <ion-label>Creando su informe de calorias...</ion-label>
    <ion-spinner color="success" name="lines"></ion-spinner>
    </ion-item>`
}

function OcultarCargaInformeDeCalorias() {
    document.querySelector("#contenidoInformeCalorias").innerHTML =
        `<ion-card id="cardCaloriasDiarias">
    <ion-card-header>
        <ion-card-title>Calorías Diarias</ion-card-title>
        <ion-card-subtitle id="subtituloCaloriasDiarias"></ion-card-subtitle>
    </ion-card-header>
    </ion-card>
    <br>
    <ion-card>
    <ion-card-header>
        <ion-card-title>Calorías Totales</ion-card-title>
        <ion-card-subtitle id="subtituloCaloriasTotales"></ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
        Recuerde que este valor incluye todos los registros de comidas ingresados en su cuenta.
    </ion-card-content>
    </ion-card>
    <br>`
}

//Extras:
function CalcularNutrienteIngerido(alimento, cantidadIngerida, sufijoAlimento, nutriente) {
    let nutrientePorPorcion = alimento[nutriente];
    let nutrienteIngerido = 0;

    let porcionNumerica = parseFloat(alimento.porcion);

    switch (sufijoAlimento) {
        case "gramos":
        case "mililitros":
            nutrienteIngerido = (nutrientePorPorcion / porcionNumerica) * cantidadIngerida;
            break;
        case "unidades":
            nutrienteIngerido = nutrientePorPorcion * cantidadIngerida;
            break;
    }
    return nutrienteIngerido;
}

function CalcularNutrienteDiario(nutriente) {
    let registros = ultimosRegistrosObtenidos;
    let nutrienteIngerido = 0;
    let hoy = ObtenerFechaActualFormateada();
    for (let registro of registros) {
        if (registro.fecha === hoy) {
            let alimento = BuscarAlimentoPorId(registro.idAlimento);
            if (alimento !== null) {
                let sufijoAlimento = ObtenerSufijoAlimento(alimento.id);
                nutrienteIngerido += CalcularNutrienteIngerido(alimento, registro.cantidad, sufijoAlimento, nutriente);
            }
        }
    }
    return nutrienteIngerido;
}

//Mapa:
let miLatitud;
let miLongitud;
let miMapa = null;
let listaPaises = [];
let posicionUsuarioIcon = L.icon({
    iconUrl: 'img/user.png',
    iconSize: [25, 25]
});
let posicionPaisIcon = L.icon({
    iconUrl: 'img/pais.png',
    iconSize: [25, 25]
});

function ObtenerMiPosicion() {
    navigator.geolocation.getCurrentPosition(MiUbicacion);
}

function MiUbicacion(posicion) {
    miLatitud = posicion.coords.latitude;
    miLongitud = posicion.coords.longitude;
    ArmarMapa();
    AgregarMarcadorUsuario();
}

function ArmarMapa() {
    if (miLatitud && miLongitud && !miMapa) {
        miMapa = L.map('map').setView([miLatitud, miLongitud], 15);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(miMapa);
    }
}

function ArmarMapaPaisesFiltrados() {
    if (miLatitud && miLongitud && !miMapa) {
        miMapa = L.map('map').setView([miLatitud, miLongitud], 2.5);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(miMapa);
        AgregarMarcadorUsuario();
    }
}

function AgregarMarcadorUsuario() {
    if (miLatitud && miLongitud && miMapa) {
        L.marker([miLatitud, miLongitud], { icon: posicionUsuarioIcon }).addTo(miMapa);
    }
}

function ObtenerUsuariosPorPais() {
    fetch(`${URLBase}usuariosPorPais.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': localStorage.getItem('token'),
            'iduser': localStorage.getItem('id')
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data && data.codigo === 200 && data.paises && data.paises.length > 0) {
                if (miMapa != null) miMapa.remove(), miMapa = null;
                ArmarMapaPaisesFiltrados();
                MarcarPaisesEnMapa(data)
            } else {
                MostrarMensaje('WARNING', 'Error', 'No se han encontrado paises con usuarios registrados.');
            }
        })
        .catch(error => console.error('Error al obtener usuarios por país:', error));
}

function MarcarPaisesEnMapa(data) {
    ObtenerPaises();
    let marcadorPais, latP, longP
    let filtro = document.querySelector("#txtMapaDeRegistrosFiltro").value;
    for (let unPais of data.paises) {
        if (PaisEsSudamericano(unPais.id)) {
            if (unPais.cantidadDeUsuarios >= filtro) {
                latP = ObtenerLatitudPais(unPais.id)
                longP = ObtenerLongitudPais(unPais.id)
                if (latP !== null && longP !== null) {
                    marcadorPais = L.marker([latP, longP], { icon: posicionPaisIcon }).addTo(miMapa);
                }
            }
        }
    }
    document.querySelector("#txtMapaDeRegistrosFiltro").value = "";
}

function PaisEsSudamericano(idPais) {
    const idsPaisesSudamericanos = [11, 27, 31, 44, 48, 64, 172, 173, 235, 239];
    if (idsPaisesSudamericanos.includes(idPais)) return true;
    return false;
}

function ObtenerLatitudPais(idPais) {
    for (let pais of listaPaises) {
        if (pais.id === idPais) {
            return pais.latitude;
        }
    }
    return null;
}

function ObtenerLongitudPais(idPais) {
    for (let pais of listaPaises) {
        if (pais.id === idPais) {
            return pais.longitude;
        }
    }
    return null;
}


