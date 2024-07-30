// make a function that calculates the free incomes of a person using the formula incomes less expenses

const CapacidadDePagoTotalF = (incomes, expenses) => {
    return incomes - expenses;
    }   

const CapacidadDePagoDiario = (incomes, expenses, plazoDeDias) => {
    console.log('CapacidadDePagoDiario');
    console.log('incomes', incomes);
    const CapacidadDePagoTotal = incomes - expenses;
    return CapacidadDePagoTotal/plazoDeDias;
}

const CalculoDeDiasDeCredito = (CapacidadDePagoDiario) => {
    FactorDeMultiplicacionDiario = 1 + (0.0124 * 99);

    TotalPagar = CapacidadDePagoDiario * 99;

    MontoMaximoDePrestamo = TotalPagar / FactorDeMultiplicacionDiario;

    return MontoMaximoDePrestamo;
}

const ParametroDiasDePago = (CapacidadDePagoDiario, montoSolicitado) => {
    const interesDiario = montoSolicitado * 0.0124;
    const pagoDiarioTotal = montoSolicitado + (1 + 0.0124);
    const numeroDeDias = pagoDiarioTotal / 300;
    const pagoDiario = pagoDiarioTotal / numeroDeDias;
    const res = {
        interesDiario: interesDiario,
        pagoDiarioTotal: pagoDiarioTotal,
        numeroDeDias: numeroDeDias,
        pagoDiario: pagoDiario
    }

    return res;
}

function calcularPuntuacionCapacidadPago(datosCliente) {
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

const calcularDiasDePago = (capacidadPagoDiaria, montoSolicitado, tasaInteresDiaria) => {
    // Calcular el monto total a pagar (capital + intereses)
    const montoTotal = montoSolicitado * ( 1 + tasaInteresDiaria)

    // Calcular los días necesarios para pagar el monto total
    const diasDePago = montoTotal / capacidadPagoDiaria;

    // Verificar si el número de días excede el límite de 99 días
    if (diasDePago > 99) {
        return 99; // El máximo número de días permitido es 99
    }

    return diasDePago;
}

module.exports = {
    CapacidadDePagoTotalF,
    CapacidadDePagoDiario,
    ParametroDiasDePago,
    CalculoDeDiasDeCredito,
    calcularPuntuacionCapacidadPago,
    calcularDiasDePago
}