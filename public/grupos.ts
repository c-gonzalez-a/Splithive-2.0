export var grupos = {
    0: {
        nombre: "FacuAmigos",
        integrantes: [1, 2, 4, 6, 7],
        tipo: "gastos", // 0 para division de gastos, 1 para lista de compras
        gastos: [0, 1, 3],
        publico: false,
        invitados: [0]
    },
    1: {
        nombre: "Viaje a la costa",
        integrantes: [6, 3, 4, 5],
        tipo: "gastos", // num o texto
        gastos: [2],
        publico: false
    },
    2: {
        nombre: "Roomies",
        integrantes: [1, 2, 7],
        tipo: "gastos", // num o texto
        gastos: [4, 5],
        publico: false
    },
    3: {
        nombre: "Todos por Alan",
        tipo: "recaudación",
        objetivo: 1500,
        donaciones: [0, 1, 2],
        integrantes: [1, 3, 6],
        infoSaludo: "¡Hola! Soy Alan 🎾",
        infoCuerpo: "He sido seleccionado para representar a Argentina en los Juegos Sudamericanos de Ping Pong en Chile. Necesito su ayuda para cubrir los costos de viaje, alojamiento y equipo. Cualquier contribución será invaluable para lograr mi sueño.",
        infoFinal: " ¡Gracias por su apoyo!",
        publico: true
    },
    4: {
        nombre: "Fundación Patitas Felices 🐾",
        tipo: "recaudación",
        objetivo: 10000000,
        donaciones: [],
        integrantes: [],
        infoSaludo: "¡Ayúdanos a salvar más perritos y gatitos en situación de calle!",
        infoCuerpo: "En Fundación Patitas Felices, rescatamos y cuidamos a animales abandonados. Necesitamos tu ayuda para ampliar nuestra área de refugio y acoger a más mascotas en peligro.",
        infoFinal: "¡Con tu ayuda, podemos darles un hogar seguro y amoroso!",
        publico: true
    },
    5: {
        nombre: "Fundación Sonrisas Brillantes 🎒",
        tipo: "recaudación",
        objetivo: 5000000,
        donaciones: [],
        integrantes: [],
        infoSaludo: "¡Ayúdanos a proporcionar mochilas escolares a niños de bajos recursos!",
        infoCuerpo: "Con tu ayuda, podemos asegurar que más niños tengan los útiles que necesitan para un año escolar exitoso!",
        infoFinal: "",
        publico: true
    },
    6: {
        nombre: "Fiesta del viernes",
        tipo: "compras",
        integrantes: [1, 6],
        articulos: {0: {nombre: "sillas", comprado: true, costo: 5000, payer: 1},
                    1: {nombre: "bebidas", comprado: false, costo: 0, payer: -1},
                    2: {nombre: "parlante", comprado: false, costo: 0, payer: -1}},
        publico: false
    },
    7: {
        nombre: "Los 15 de Mari",
        tipo: "WishList",
        admins: [1],
        integrantes: [1],
        infoSaludo: "Hola a todos!",
        infoCuerpo: "Estoy muy emocionada por celebrar mis 15 años, y me encantaría compartir este momento tan especial con ustedes. Cada uno de estos regalos significaría mucho para mí y haría que este día sea aún más inolvidable. Gracias por ser parte de esta celebración tan importante para mí y por considerar estos regalos. ¡Su cariño y compañía son lo que más valoro en este día tan especial!",
        infoFinal: "Con cariño, Mari ❤️", 
        deseos: [0,1,2,3,4,5],
        publico: true
    },
    8: {
        nombre: "Nuestra Boda 💍 Raul y Cristina",
        tipo: "WishList",
        admins: [9],
        integrantes: [8,9],
        infoSaludo: "¡Queridos amigos y familiares!",
        infoCuerpo: "Estamos emocionados de compartir nuestro amor y compromiso con ustedes mientras nos preparamos para el matrimonio. Hemos creado una lista de deseos que refleja nuestros sueños y esperanzas para el futuro. Cada regalo será recibido con gratitud y cariño, y nos recordará su apoyo durante este momento especial. Gracias por ser parte de nuestras vidas y por celebrar con nosotros.",
        infoFinal: "Con amor, Raúl y Cristina", 
        deseos: [6],
        publico: true
    }
}