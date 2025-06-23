import { useEffect, useState } from 'react';
import { Button, Card, Input, Link, Select, SelectItem,  } from '@nextui-org/react';
import { getContactos, getApodos, getInvitados, getUsuarios, getGrupos, getUserByUsername, getHives, getCurrentUser } from "../../utils/utilities"
import ImageContainer from './ImageContainer'
import '../../styles/global.css'
import '../../styles/formGroups.css'

export default function FormularioDivisionDeGastos() {
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [grupos, setGrupos] = useState(getGrupos());
    const [usuarios, setUsuarios] = useState(getUsuarios());
    const [hive_userActual, setHive_userActual] = useState(getHives());
    const [userContacts, setUserContacts] = useState(getContactos()[currentUser] || [])
    const [userContactsNames, setUserContactsNames] = useState(userContacts.map(id => usuarios[id]?.nombre || `Usuario ${id}`));
    const [apodos, setApodos] = useState(getApodos()[currentUser]);
    const [invitados, setInvitados] = useState([])
    const [invitadosTodos, setInvitadosTodos] = useState(getInvitados())
    const [nombreInvitado, setNombreInvitado] = useState("");

    useEffect(() => {
        document.getElementById('agregarIntegranteBtn').addEventListener('click', function() {
            var contadorIntegrantes = integrantesContainer.children.length + 2;
            var nuevoCampoIntegrante = document.createElement('div');
            var contactosDisponibles = userContacts.filter(name => {
                // Comprobar si el contacto ya ha sido seleccionado
                var val= ![...integrantesContainer.querySelectorAll('select')].some(select => {
                    console.log(select.selectedIndex)
                    return select[select.selectedIndex].value == name
                });
                return val
            });
            
            nuevoCampoIntegrante.innerHTML = `
            <select id="nombreIntegrante${contadorIntegrantes}" name="nombreIntegrante${contadorIntegrantes}" class="custom-select">
                <option value="" label="Selecciona un integrante">Selecciona un integrante</option>
                ${contactosDisponibles.map(id => `<option value="${id}">${getApodo(id)}</option>`).join('')}
            </select>`;
            integrantesContainer.appendChild(nuevoCampoIntegrante);
        });

        document.getElementById('executeSearch').addEventListener('click', function() {
            const username = document.getElementById('searchUsername').value;
            console.log(username);
            const user = getUserByUsername(username);
            console.log("User: ", user);
            if (user) {
                var contadorIntegrantes = integrantesContainer.children.length + 2;
                var nuevoCampoIntegrante = document.createElement('div');
                nuevoCampoIntegrante.innerHTML = `
                    <select disabled id="nombreIntegrante${contadorIntegrantes}" name="nombreIntegrante${contadorIntegrantes}" class="custom-select added-user">
                        <option selected value="${user.id}">${user.usuario}</option>
                    </select>`;
                integrantesContainer.appendChild(nuevoCampoIntegrante);
                document.getElementById('searchUsername').value = "";
                
            } else {
                alert('El usuario no existe');
            }
        });

        
    }, [])

    function getApodo(id) {
        if (!apodos || !apodos.hasOwnProperty(id) || apodos[id] == "") {
            return usuarios[id].nombre
        }
        return apodos[id]
    }

    function crearGrupo(event) {
        event.preventDefault(); 
            var nombreGrupo = document.getElementById('nombreGrupo').value;
            var integrantes = [];
            integrantes.push(currentUser)
            var maximo = 0;
            for (const key in grupos){
                if (grupos.hasOwnProperty(key)){
                    if (Number(key) > Number(maximo)){
                        maximo = Number(key);
                    }
                }
            }
            
            hive_userActual[currentUser].push(maximo+1)
            for (var i = 2; i <= integrantesContainer.children.length + 1; i++) {
                var id = document.getElementById(`nombreIntegrante${i}`).value;
                var nombre = userContacts[id]; 
                if (id in userContacts) {
                    integrantes.push(Number(id));
                    hive_userActual[id].push(maximo+1);
                } 
                // Agrego no contacto al grupo
                else {
                    let user = getUserByUsername(nombre);
                    console.log(id)
                    integrantes.push(Number(id));
                    hive_userActual[id].push(maximo+1);
                }
            }


        var nuevoGrupo = { 
            nombre: nombreGrupo, 
            integrantes: integrantes, 
            tipo: "gastos", 
            gastos: [], 
            publico: false
        };

        if (invitados.length > 0) {
            const count = Object.keys(invitadosTodos).length
            const nuevoInvitados = {...invitadosTodos};

            invitados.forEach((e, index) => {
                nuevoInvitados[count + index] = e
            });

            nuevoGrupo.invitados = invitados.map((e, index) => index + count)

            sessionStorage.setItem('invitados', JSON.stringify(nuevoInvitados))
        }

        grupos[maximo+1] = nuevoGrupo;
        sessionStorage.setItem('grupos', JSON.stringify(grupos));

        sessionStorage.setItem("hives", JSON.stringify(hive_userActual));


        function actualizarListaGrupos() {
            var contenedorGrupos = document.getElementById('grupos');
            contenedorGrupos.innerHTML = ''; 

            hive_userActual[currentUser].forEach(i => {
                var grupo = grupos[i];
                console.log(grupo)
                var grupoElemento = document.createElement('div');

                var cantidadIntegrantes = grupo.integrantes.length + (grupo.invitados?.length ?? 0);
                grupoElemento.innerHTML = '<h2>' + grupo.nombre + '</h2><p>Cantidad de integrantes: ' + cantidadIntegrantes + '</p>';

                var enlaceDetalle = document.createElement('a');
                enlaceDetalle.classNameList.add('grupo-card');
                enlaceDetalle.href = 'grupos/' + (i);
                
                enlaceDetalle.appendChild(grupoElemento);
                contenedorGrupos.appendChild(enlaceDetalle);
            });
        }

        window.location.href = '/home';

        actualizarListaGrupos();

        document.getElementById('crearGrupoFormulario').reset();
        document.getElementById('integrantesContainer').innerHTML = '';
    }

    return <><Card classNameName='p-4'>

    <form id="crearGrupoFormulario" onSubmit={crearGrupo}>

        
        <ImageContainer rightImageSrc='/public/images/gastos.png'/>
                    
        <div className="form-group">

                <label htmlFor="nombreGrupo" className='form-group-item'>Nombre del grupo:</label>

                <Input
                    className='form-group-item'
                    classNames={{
                    label: ["text-black/50 dark:text-white/90"],
                    input: [
                        "bg-yellow-300",
                        "text-black/90 dark:text-white/90"
                    ],
                    innerWrapper: "bg-yellow-300",
                    inputWrapper: [
                        "shadow-md",
                        "!bg-yellow-300",
                        "dark:bg-blue-500/60",
                        "backdrop-blur-xl",
                        "backdrop-yellow-300",
                        "hover:bg-yellow-300",
                        "dark:hover:bg-default/70",
                        "group-data-[focus=false]:bg-yellow-200/50",
                        "dark:group-data-[focus=false]:bg-default/60",
                        "!cursor-text",
                    ],
                    }} type="text" id="nombreGrupo" name="nombreGrupo"
                />

        </div>

        <div id="containerIntegrante1" className="form-group">

            <label htmlFor="nombreIntegrante1" className="form-group-item">Integrantes:</label>

            <div className="form-group-item">

                <Input classNames={{
                        label: ["text-black/50 dark:text-white/90"],
                        input: [
                            "bg-yellow-300",
                            "text-black/90 dark:text-white/90"
                        ],
                        innerWrapper: "bg-yellow-300",
                        inputWrapper: [
                            "shadow-md",
                            "!bg-yellow-300",
                            "dark:bg-blue-500/60",
                            "backdrop-blur-xl",
                            "backdrop-yellow-300",
                            "hover:bg-yellow-300",
                            "dark:hover:bg-default/70",
                            "group-data-[focus=false]:bg-yellow-200/50",
                            "dark:group-data-[focus=false]:bg-default/60",
                            "!cursor-text",
                        ],
                        }} disabled color='warning' id="nombreIntegrante1" name="nombreIntegrante1" value={usuarios[currentUser].nombre + " (Yo)"}></Input>
            </div>

            <div id="integrantesContainer" className="form-group-item">
            </div>

            <div className="form-group-item">
                <button type="button" id="agregarIntegranteBtn">+</button>
            </div>

            <div className="form-group-item flex searchContainer">

                <Input
                        classNames={{
                        label: ["text-black/50 dark:text-white/90"],
                        input: [
                            "bg-yellow-300",
                            "text-black/90 dark:text-white/90"
                        ],
                        innerWrapper: "bg-yellow-300",
                        inputWrapper: [
                            "shadow-md",
                            "!bg-yellow-300",
                            "dark:bg-blue-500/60",
                            "backdrop-blur-xl",
                            "backdrop-yellow-300",
                            "hover:bg-yellow-300",
                            "dark:hover:bg-default/70",
                            "group-data-[focus=false]:bg-yellow-200/50",
                            "dark:group-data-[focus=false]:bg-default/60",
                            "!cursor-text",
                        ],
                        }} id="searchUsername" name="searchUsername" placeholder="Nombre de usuario fuera de mi colmena"
                 />

                <Button className="submitBtn" id="executeSearch" color="warning" >Agregar</Button>

            </div>

        </div>

        <div className="form-group">

            <label className="form-group-item">Invitados:</label>

            <div className="form-group-item" id='invitadosContainer'>
                {invitados.map((x, index) => {
                    return <Input key={index} disabled value={x.nombre} color='warning'></Input>
                })}
            </div>

            <div className="searchContainer flex form-group-item">

                <Input classNames={{
                        label: ["text-black/50 dark:text-white/90"],
                        input: [
                            "bg-yellow-300",
                            "text-black/90 dark:text-white/90"
                        ],
                        innerWrapper: "bg-yellow-300",
                        inputWrapper: [
                            "shadow-md",
                            "!bg-yellow-300",
                            "dark:bg-blue-500/60",
                            "backdrop-blur-xl",
                            "backdrop-yellow-300",
                            "hover:bg-yellow-300",
                            "dark:hover:bg-default/70",
                            "group-data-[focus=false]:bg-yellow-200/50",
                            "dark:group-data-[focus=false]:bg-default/60",
                            "!cursor-text",
                        ],
                        }} placeholder="Nombre del invitado fuera de la app" value={nombreInvitado} onValueChange={setNombreInvitado} />
                
                <Button className="submitBtn" onClick={() => {
                    if (invitados.some(x => x.nombre == nombreInvitado)) {
                        alert("Ya existe un invitado con ese nombre")
                    } else {
                        const nuevoInvitados = [ ...invitados ];
                        nuevoInvitados.push({ nombre: nombreInvitado });
                        setInvitados(nuevoInvitados);
                        setNombreInvitado('');
                    }
                }}>Agregar </Button>

            </div>

        </div>

        <div style={{margin: "20px", display: "flex", gap: "5px"}} >
            <Button className="submitBtn font-semibold fs-5" type="submit">Crear</Button>
            <Button as={Link} className="cancelarBtn font-semibold fs-5" href='/home'>Cancelar</Button>
        </div>
    </form>
</Card></>
}