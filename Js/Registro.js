class Registro_Estudiantes {
    constructor(nombre, apellido, matricula, nota) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.matricula = matricula;
        this.nota = nota;
    }
}

let listaEstudiantes = JSON.parse(localStorage.getItem("listaEstudiantes")) || [];

const formulario = document.getElementById("formularioEstudiante");
const tablaCuerpo = document.querySelector("#tablaEstudiantes tbody");
const buscarInput = document.getElementById("buscarInput");

let editando = false;
let indiceEditando = null;

const valorEntero = valor => Number.isInteger(Number(valor));

const guardarEnLocalStorage = () => {
    localStorage.setItem("listaEstudiantes", JSON.stringify(listaEstudiantes));
};

const mostrarEstudiantes = () => {
    tablaCuerpo.innerHTML = "";

    listaEstudiantes.forEach((estudiante, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
      <td>${estudiante.nombre}</td>
      <td>${estudiante.apellido}</td>
      <td>${estudiante.matricula}</td>
      <td>${estudiante.nota}</td>
      <td>
        <button class="editar" data-index="${index}">Editar</button>
        <button class="eliminar" data-index="${index}">Eliminar</button>
      </td>
    `;

        tablaCuerpo.appendChild(fila);
    });

    asignarEventos();
};

const asignarEventos = () => {
    document.querySelectorAll(".editar").forEach(boton => {
        boton.addEventListener("click", () => {
            const index = boton.getAttribute("data-index");
            const estudiante = listaEstudiantes[index];

            document.getElementById("nombre").value = estudiante.nombre;
            document.getElementById("apellido").value = estudiante.apellido;
            document.getElementById("matricula").value = estudiante.matricula;
            document.getElementById("nota").value = estudiante.nota;

            editando = true;
            indiceEditando = index;
            formulario.querySelector("button[type='submit']").textContent = "Guardar Cambios";
        });
    });

    document.querySelectorAll(".eliminar").forEach(boton => {
        boton.addEventListener("click", () => {
            const index = boton.getAttribute("data-index");
            listaEstudiantes.splice(index, 1);
            guardarEnLocalStorage();
            mostrarEstudiantes();
        });
    });
};

formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const nota = document.getElementById("nota").value.trim();

    if (!nombre || !apellido || !matricula || !nota) {
        alert("Tienes uno o mas campos vacios.");
        return;
    }
   
    if (!valorEntero(nota)) {
        alert("La nota debe ser un número entero.");
        return;
    }

    if (editando) {
        listaEstudiantes[indiceEditando] = {
            nombre,
            apellido,
            matricula,
            nota: parseInt(nota),
        };

        editando = false;
        indiceEditando = null;
        formulario.querySelector("button[type='submit']").textContent = "Agregar Estudiante";
    } else {
        const nuevoEstudiante = new Registro_Estudiantes(
            nombre,
            apellido,
            matricula,
            parseInt(nota)
        );
        listaEstudiantes.push(nuevoEstudiante);
    }

    guardarEnLocalStorage();
    formulario.reset();
    mostrarEstudiantes();
});

// Buscar por nombre, apellido o matrícula (agregado)
buscarInput.addEventListener("input", () => {
    const texto = buscarInput.value.trim().toLowerCase();

    if (texto === "") {
        mostrarEstudiantes();
        return;
    }

    const estudiantesFiltrados = listaEstudiantes.filter(est =>
        est.nombre.toLowerCase().includes(texto) ||
        est.apellido.toLowerCase().includes(texto) ||
        est.matricula.toLowerCase().includes(texto)
    );

    mostrarFiltrados(estudiantesFiltrados);
});

const mostrarFiltrados = lista => {
    tablaCuerpo.innerHTML = "";

    lista.forEach(estudiante => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
      <td>${estudiante.nombre}</td>
      <td>${estudiante.apellido}</td>
      <td>${estudiante.matricula}</td>
      <td>${estudiante.nota}</td>
      <td>
        <button class="editar">Editar</button>
        <button class="eliminar">Eliminar</button>
      </td>
    `;

        tablaCuerpo.appendChild(fila);

        fila.querySelector(".editar").addEventListener("click", () => {
            document.getElementById("nombre").value = estudiante.nombre;
            document.getElementById("apellido").value = estudiante.apellido;
            document.getElementById("matricula").value = estudiante.matricula;
            document.getElementById("nota").value = estudiante.nota;

            editando = true;
            indiceEditando = listaEstudiantes.indexOf(estudiante);
            formulario.querySelector("button[type='submit']").textContent = "Guardar Cambios";
        });

        fila.querySelector(".eliminar").addEventListener("click", () => {
            const index = listaEstudiantes.indexOf(estudiante);
            listaEstudiantes.splice(index, 1);
            guardarEnLocalStorage();
            mostrarEstudiantes();
        });
    });
};

mostrarEstudiantes();