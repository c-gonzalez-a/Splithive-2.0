import React from 'react';
import { useState } from 'react';
import { getGrupos, getUsuarios, getCurrentUser, getSaldos, getApodos } from "../utils/utilities"
import {Tabs, Tab, Card, CardBody, CardHeader, CardFooter, Button, Link, useDisclosure} from '@nextui-org/react';
import {
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter
  } from "@nextui-org/modal";
import inputStyle from "../styles/form.module.css"
import CerrarSesion from './cerrarsesion';
import "../styles/global.css"

export default function ShopListDisplay(props) {
    let [id,setId] = useState(props.id);
    let [grupos, setGrupos] = useState(getGrupos());
    let [grupo, setGrupo] = useState(grupos[id]);
    let [usuarios, setUsuarios] = useState(getUsuarios());
    let [apodos, setApodos] = useState(getApodos()[getCurrentUser()]);
    const currentUser = getCurrentUser();


    function calcularDeudas() {
        var metaSaldos = JSON.parse(sessionStorage.getItem("saldos"));

        var deudas = {};

        grupo.integrantes.forEach((integrante) => {
            deudas[integrante] = {};
        })
        if (!metaSaldos) {
            metaSaldos = {};
        }
        else if (id in metaSaldos) {
            deudas = metaSaldos[id];
        }

        let itemsProcesados = JSON.parse(sessionStorage.getItem("itemsProcesados"));
        if (!itemsProcesados) itemsProcesados = {};
        
        for (const id in grupo.articulos) {
            if (id in itemsProcesados) {
                continue;
            };

            if (grupo.articulos.hasOwnProperty(id) && grupo.articulos[id].comprado) {

                itemsProcesados[id] = 1;
                var reparto = (grupo.articulos[id].costo / grupo.integrantes.length);

                grupo.integrantes.forEach((integrante) => {

                    if (integrante != grupo.articulos[id].payer) { // NO soy el payer, debo dinero.

                        if (grupo.articulos[id].payer in deudas[integrante]) { // Ya le debia plata?
                            var deuda_anterior = deudas[integrante][grupo.articulos[id].payer];
                            deudas[integrante][grupo.articulos[id].payer] = deuda_anterior + reparto;
                        }
                        else { // Si no le debia, seteo la deuda al valor del reparto.
                            deudas[integrante][grupo.articulos[id].payer] = reparto;
                        }

                        // chequear si el payer me debe a mi.
                        if (integrante in deudas[grupo.articulos[id].payer]) {

                            var deuda_payer = deudas[grupo.articulos[id].payer][integrante];
                            var deuda_integrante = deudas[integrante][grupo.articulos[id].payer];

                            if (deuda_payer == deuda_integrante) {
                                deudas[grupo.articulos[id].payer][integrante] = 0;
                                deudas[integrante][grupo.articulos[id].payer] = 0;
                            }
                            else if (deuda_payer > deuda_integrante) {
                                var diferencia = deuda_payer - deuda_integrante;
                                deudas[grupo.articulos[id].payer][integrante] = diferencia;
                                deudas[integrante][grupo.articulos[id].payer] = 0;
                            }
                            else if (deuda_integrante > deuda_payer) {
                                var diferencia = deuda_integrante - deuda_payer;
                                deudas[integrante][grupo.articulos[id].payer] = diferencia;
                                deudas[grupo.articulos[id].payer][integrante] = 0;
                            }
                        }
                    }
                })
            }
        }

        metaSaldos[id] = deudas;

        sessionStorage.setItem("itemsProcesados", JSON.stringify(itemsProcesados));
        sessionStorage.setItem("saldos", JSON.stringify(metaSaldos));
        
        return deudas;
    }

    function calcularSaldos(deudas) {
        if (!deudas) return {};
        var saldos = {};
        grupo.integrantes.forEach((integrante) => {
            saldos[integrante] = 0;
        })
        for (const integrante in deudas) {
            for (const acreedor in deudas[integrante]) {
                saldos[integrante] -= deudas[integrante][acreedor];
                saldos[acreedor] += deudas[integrante][acreedor];
            }
        }
        return saldos;
    }

    function saldar(deudor, acreedor) {
        var metaSaldos = JSON.parse(sessionStorage.getItem("saldos"));
        if (!metaSaldos) return;

        metaSaldos[id][deudor][acreedor] = 0;
        sessionStorage.setItem("saldos", JSON.stringify(metaSaldos));
    }

    function getApodo(usuario) {
        if (!apodos || !apodos.hasOwnProperty(usuario) || apodos[usuario] == "") {
            return usuarios[usuario].nombre
        }
        return apodos[usuario]
    }

    const [nuevoItem, setNuevoItem] = useState(false);

    const switchNuevoItem = () => setNuevoItem(!nuevoItem);

    const [nombreNuevoItem, setNombreNuevoItem] = useState('');

    const handleNuevoItem = (event) => {
        setNombreNuevoItem(event.target.value);
    }

    const agregarArticulo = () => {
        var id = obtenerItemID();
        grupo.articulos[id] = {nombre: nombreNuevoItem, comprado: false, costo: 0};
        sessionStorage.setItem("grupos", JSON.stringify(grupos));
        window.location.reload();
    }

    const {isOpen, onOpen, onClose} = useDisclosure();

    const [costoItem, setCostoItem] = useState(0);

    const handleCostoItem = (event) => {
        setCostoItem(event.target.value);
    }

    const [itemIndex, setItemIndex] = useState(0);

    const [nombreItemComprado, setNombreItemComprado] = useState('');

    const handleOpen = (index, nombre) => {
        setItemIndex(index);
        setNombreItemComprado(nombre);
        onOpen();
    }

    const pagarItem = () => {
        var itemComprado = {nombre: nombreItemComprado, comprado: true, costo: Number(costoItem), payer: Number(getCurrentUser())};
        grupo.articulos[itemIndex] = itemComprado;
        sessionStorage.setItem("grupos", JSON.stringify(grupos));
        window.location.reload();
    }

    function obtenerItemID() {
        var maxID = 0;
        for (const id in grupo.articulos) {
            if (grupo.articulos.hasOwnProperty(id)){
                if (Number(id) > Number(maxID)){
                    maxID = Number(id);
                }
            }
        }
        return maxID + 1;
    }

    function calcularSuma() {
        var suma = 0;
        Object.entries(grupo.articulos).map(([id, articulo]) => {
            suma += articulo.costo;
        })
        return suma;
    }

    var suma = calcularSuma();

    calcularDeudas();
    let [metaSaldos, setMetaSaldos] = useState(getSaldos());
    var saldos = calcularSaldos(metaSaldos[id]);

    return (
        <div className="p-5">
            <Card className='p-4' style={{background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39"}}>
                <CardHeader className='header'>
                    <h4 className="font-bold text-large">
                        {grupo.nombre}
                    </h4>
                    {currentUser && (
                        <CerrarSesion client:only></CerrarSesion>
                    )}
                </CardHeader>
                <CardBody>
                    <Tabs aria-label="Options" variant="underlined" radius="full">
                        <Tab key="articulos" title="Artículos">
                            
                            {grupo.articulos.length === 0 ? (
                                <p style={{color:"gold"}}>No se han agregado artículos aún.</p>
                            ) : (
                                Object.entries(grupo.articulos).map(([id, articulo]) => {
                                    return (
                                        <Card key={id} style={{background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39", marginBottom: "10px", display: "flex", justifyContent: "center"}}>
                                            <CardBody>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <p style={{color: articulo.comprado ? "#17c964" : "black"}}>{articulo.nombre}</p>
                                                        {!articulo.comprado && (
                                                            <div>
                                                                <Button style={{ marginLeft: "10px" }} key={id} color="warning" variant="flat" onPress={() => handleOpen(id, articulo.nombre)}>Comprar artículo</Button>
                                                                <Modal isOpen={isOpen} onClose={onClose}>
                                                                    <ModalContent>
                                                                        {(onClose) => (
                                                                            <>
                                                                                <ModalHeader>Ingrese el costo:</ModalHeader>
                                                                                <ModalBody>
                                                                                    <input style={{marginLeft: '10px', marginBottom: '12px'}} className={inputStyle.formInputStyle} type="number" value={costoItem} onChange={handleCostoItem}/>
                                                                                </ModalBody>
                                                                                <ModalFooter>
                                                                                    <Button color="danger" variant="light" onPress={onClose}>Cerrar</Button>
                                                                                    <Button color="warning" onClick={() => pagarItem()} onPress={onClose}>Pagar</Button>
                                                                                </ModalFooter>
                                                                            </>
                                                                        )}
                                                                    </ModalContent>
                                                                </Modal>
                                                            </div>
                                                        )}
                                                        {articulo.comprado && (
                                                            <p>Costo: ${articulo.costo} | Pagado por {articulo.payer === Number(getCurrentUser()) ? "mí" : getApodo(articulo.payer)}</p>
                                                        )}
                                                    </div>
                                            </CardBody>
                                        </Card>
                                    )
                                })
                            )}
                            <Button color="warning" style={{marginBottom: '12px', width: "100%"}} onClick={() => switchNuevoItem()}>Nuevo artículo</Button>
                            {nuevoItem && (
                                <p>
                                    <label>Nombre:</label>
                                    <input style={{marginLeft: '10px', marginBottom: '12px'}} className={inputStyle.formInputStyle} type="text" value={nombreNuevoItem} onChange={handleNuevoItem}/>
                                    <Button style={{marginLeft: '10px'}} color="warning" onClick={() => agregarArticulo()}>Agregar</Button>
                                </p>
                            )}
                            <p style={{marginTop: '20px', marginLeft: "8px"}}>Total: ${suma}</p>
                            
                        </Tab>
                        <Tab key="abejas" title="Abejas">
                            {grupo.integrantes.map((id, index) =>
                                <Card key={id} style={{background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39", marginBottom: "10px"}}>
                                    <CardBody>
                                        <p>{getApodo(id)}</p>
                                        <p style={{color: (saldos[id] >= 0 ? "#17c964" : 'red')}}>Saldo: ${saldos[id]}</p>
                                    </CardBody>
                                </Card>
                            )}
                        </Tab>
                        <Tab key="deudas" title="Deudas">
                            {Object.entries(metaSaldos[id]).map(([deudor, acreedores]) => {
                                return (
                                    <div key={deudor}>
                                        {Object.entries(acreedores).map(([acreedor, monto]) => {
                                            if (monto > 0) return (
                                                <Card key={acreedor} style={{background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39", marginBottom: "10px"}}>
                                                    <CardBody >
                                                        {deudor === getCurrentUser() ? (
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                Yo le debo ${monto} a {getApodo(acreedor)}
                                                                <Button color="warning" variant="flat" style={{display: "flex", alignContent: "center", width: "auto"}} name="Saldar" onClick={() => {saldar(deudor, acreedor), window.location.reload()}}>Saldar</Button>
                                                            </div>
                                                        ) : (
                                                            <p>{acreedor === getCurrentUser() ? (`${getApodo(deudor)} me debe $${monto}`) : (`${getApodo(deudor)} le debe $${monto} a ${getApodo(acreedor)}`)}</p>
                                                        )}
                                                    </CardBody>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </Tab>
                    </Tabs>
                </CardBody>
                <CardFooter>
                    <Button href='/home' as={Link} color="warning" showAnchorIcon variant="solid">
                        My Hive
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
