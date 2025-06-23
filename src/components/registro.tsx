import React, { useEffect, useState } from "react";
import registro from "../styles/registro.module.css"
import { Button, Input } from "@nextui-org/react";
import {getContactos, getGastos, getGrupos, getHives, getUsuarios} from "../utils/utilities"
import { navigate } from "astro/virtual-modules/transitions-router.js";
import cargarDatos from "../utils/initLogica";
import { relacionarUsuarioInvitado } from "../utils/logicaNegocio";
import { EyeFilledIcon } from "../styles/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../styles/EyeSlashFilledIcon";

export default function Registro({ grupo, invitado }){
    
    let [username,setUsername] = useState(null)
    let [okUsername,setOkUsername] = useState(false)
    
    let [password,setPassword] = useState(null)
    let [okContra,setOkContra] = useState(false)
    
    let [emailUser, setEmail] = useState(null)
    let [errorEmailMessage, setErrorEmailMessage] = useState("")
    let [okEmail, setOkEmail] = useState(false)

    let [nombreUser,setNombre] = useState(null)
    let [okNombre, setOkNombre] = useState(false)
    
    useEffect(() => {
        cargarDatos();
    }, [])
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);


    function handleSubmit(){
        var userCorrect = handleUsername();
        if (!userCorrect){
            return
        }
        var passCorrect = handelPassword();
        if (!passCorrect){
            return
        }
        var emailCorrect = handleEmail()
        if (!emailCorrect){
            return
        }

        var newUser = {nombre:nombreUser, usuario:username, pass:password, mail:emailUser, alias:""}
        var usuarios = getUsuarios()
        var user;
        var maximo = 0;
        for (const key in usuarios){
            if (usuarios.hasOwnProperty(key)){
                if (Number(key) > Number(maximo)){
                    maximo = Number(key);
                }
            }
        }
        var hives = getHives();
        maximo = 0
        for (const key in hives){
            if (usuarios.hasOwnProperty(key)){
                if (Number(key) > Number(maximo)){
                    maximo = Number(key);
                }
            }
        }
        var contactos = getContactos();
        usuarios[maximo+1] = newUser
        hives[maximo+1] = []
        contactos[maximo+1] = []

        sessionStorage.setItem("usuarios",JSON.stringify(usuarios))
        sessionStorage.setItem("hives",JSON.stringify(hives))
        sessionStorage.setItem("userID",JSON.stringify(maximo+1))
        sessionStorage.setItem("contactos",JSON.stringify(contactos))

        relacionarUsuarioInvitado(maximo+1, grupo, invitado);

        navigate("/home")
        
    }

    function onChangeUser(e){
        setOkUsername(false)
        setUsername(e.target.value)
    }

    function onChangePass(e){
        setOkContra(false)
        setPassword(e.target.value)
    }

    function onChaneEmail(e){
        setOkEmail(false)
        setEmail(e.target.value)
    }

    function onChangeNombre(e){
        setOkNombre(false)
        setNombre(e.target.value)
    }

    function handleUsername(){
        let usuarios = getUsuarios();
        var user;
        for (user in usuarios){
            if (!usuarios.hasOwnProperty(user)){
                continue;
            }
            if (usuarios[user].usuario == username){
                setOkUsername(true)
                return false
            }
        }
        
        return true
    }

    function handelPassword(){
        let usuarios = getUsuarios();
        var user;
        if (password == ""){
            setOkContra(true)
            return false    
        }
        
        return true
    }

    function handleEmail(){
        let usuarios = getUsuarios();
        var user;
        for (user in usuarios){
            if (!usuarios.hasOwnProperty(user)){
                continue
            }
            if (String(usuarios[user].mail) === String(emailUser)){
                setErrorEmailMessage("Email ya esta en uso")
                setOkEmail(true)
                return false
            }
        }
        var regex = new RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
        if (regex.test(emailUser)){
            return true
        }
        setErrorEmailMessage("Dirección email invalida");
        setOkEmail(true)
        return false
    }


    return(
    <div className={registro.main_body}>
        <div className={registro.username_bar}>
            <div className= {registro.username_info}>Nombre</div>
            <Input className={registro.name_bar} isInvalid={okNombre}
                errorMessage="Email ya esta en uso" onChange={(e => {onChangeNombre(e)})} type ="username">
            </Input>    
        </div>
        <div className={registro.username_bar}>
            <div className={registro.username_info}>Username</div>
            <Input className={registro.bar} isInvalid={okUsername}
                errorMessage="Usuario Ya existe" onChange={(e => {onChangeUser(e)})} type="username"></Input>
        </div>
        <div className={registro.password_bar}>
            <div className={registro.password_info}>Password</div>
            <Input className={registro.bar} isInvalid={okContra}
                errorMessage="Contraseña invalida" type={isVisible ? "text" : "password"} onChange={(e =>{onChangePass(e)})}
                endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                    }>

            </Input>
        </div>
        <div className={registro.username_bar}>
            <div className= {registro.username_info}>Email</div>
            <Input className={registro.bar_email} isInvalid={okEmail}
                errorMessage={errorEmailMessage} onChange={(e => {onChaneEmail(e)})} type ="username">
            </Input>    
        </div>

        <div className={registro.buttons}>
            <Button color="warning" onClick={e => {handleSubmit()}}>Sign In</Button>
            <Button onClick={e => navigate("/")}>Cancelar</Button>
        </div>
    </div> 
    );
}