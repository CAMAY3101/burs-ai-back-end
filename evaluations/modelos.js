// make a function that calculates the free incomes of a person using the formula incomes less expenses

export const CapacidadDePagoTotalF = (incomes, expenses) => {
    return incomes - expenses;
    }   

export const CapacidadDePagoDiario = (incomes, expenses, plazoDeDias) => {
    const CapacidadDePagoTotal = incomes - expenses;
    return CapacidadDePagoTotal/plazoDeDias;
}

export const CalculoDeDiasDeCredito = (CapacidadDePagoDiario) => {
    FactorDeMultiplicacionDiario = 1 + (0.0124 * 99);

    TotalPagar = CapacidadDePagoDiario * 99;

    MontoMaximoDePrestamo = TotalPagar / FactorDeMultiplicacionDiario;
}

export function calcularPuntuacionCapacidadPago(datosCliente) {
    let puntuacion = 0;

    // Puntuación por ingresos mensuales netos
    if (datosCliente.ingresosMensualesNetos < 5000) {
        puntuacion += 0;
    } else if (datosCliente.ingresosMensualesNetos <= 10000) {
        puntuacion += 3;
    } else {
        puntuacion += 5;
    }

    // Puntuación por egresos mensuales
    const porcentajeEgresos = (datosCliente.egresosMensuales / datosCliente.ingresosMensualesNetos) * 100;
    if (porcentajeEgresos > 50) {
        puntuacion -= 3;
    } else if (porcentajeEgresos > 30) {
        puntuacion -= 1;
    }

    // Puntuación por relación deuda-ingreso
    const porcentajeDeudaIngreso = (datosCliente.deuda / datosCliente.ingresosMensualesNetos) * 100;
    if (porcentajeDeudaIngreso > 40) {
        puntuacion -= 5;
    } else if (porcentajeDeudaIngreso > 20) {
        puntuacion -= 2;
    }

    return puntuacion;
}

export const calcularDiasDePago = (capacidadPagoDiaria, montoSolicitado, tasaInteresDiaria) => {
    // Calcular el monto total a pagar (capital + intereses)
    const montoTotal = montoSolicitado * ( 1 + tasaInteresDiaria)

    // Calcular los días necesarios para pagar el monto total
    const diasDePago = montoTotal / capacidadPagoDiaria;

    // Verificar si el número de días excede el límite de 99 días
    if (diasDePago > 99) {
        return 99; // El máximo número de días permitido es 99
    }

    return diasDePago;
};
