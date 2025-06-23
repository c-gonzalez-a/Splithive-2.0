import { invitados } from "./invitados.ts";

export var gastos = {
    0: 
        {
            nombre: "Pizza en Kentucky",
            deudores: [2, 4, 6, 7],
            payer: 1,
            monto: 30000,
            fecha: "19/5/2024",
            reparto: {
                1: 5000,
                2: 5000,
                4: 5000,
                6: 5000,
                7: 5000
            },
            invitados: {
                0: 5000
            }
        },
    1: {
            nombre: "Galletitas Buffet",
            deudores: [2, 4, 6],
            payer: 1,
            monto: 2500,
            fecha: "19/5/2024",
            reparto: {
                1: 625,
                2: 625,
                4: 625,
                6: 625
            }
        },
    2: {
            nombre: "Nafta",
            deudores: [4],
            payer: 5,
            monto: 40000,
            fecha: "19/5/2024",
            reparto: {
                5: 20000,
                4: 20000
            }
        },
    3:{
            nombre:"Fotocopias para la expo de Gestion",
            deudores:[6],
            payer:2,
            monto: 400,
            fecha: "19/5/2024",
            reparto:{
                6:200,
                2:200
        }
    },
    4: {
            nombre: "Internet",
            deudores: [1,2],
            payer: 7,
            monto: 21000,
            fecha: "19/5/2024",
            reparto: {
                1: 7000,
                2: 7000,
                7: 7000
        }
    },
    5:{
            nombre:"Luz",
            deudores:[7,2],
            payer:1,
            monto: 12000,
            fecha: "19/5/2024",
            reparto:{
                1: 4000,
                7: 4000,
                2: 4000
        }
    },
}
