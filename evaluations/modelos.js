// make a function that calculates the free incomes of a person using the formula incomes less expenses

const CapacidadDePagoTotalF = (incomes, expenses) => {
    return incomes - expenses;
    }   

const CapacidadDePagoDiario = (incomes, expenses, plazoDeDias) => {
    const CapacidadDePagoTotal = incomes - expenses;
    const res = {
        CapacidadDePagoTotal: CapacidadDePagoTotal,
        CapacidadDePagoDiario: CapacidadDePagoTotal / plazoDeDias
    };
    return res;
}

const CalculoDeDiasDeCredito = (CapacidadDePagoDiario) => {
    const FactorDeMultiplicacionDiario = 1 + (0.0124 * 99);

    const TotalPagar = CapacidadDePagoDiario * 99;

    const MontoMaximoDePrestamo = TotalPagar / FactorDeMultiplicacionDiario;

    const res = {
        FactorDeMultiplicacionDiario: FactorDeMultiplicacionDiario,
        TotalPagar: TotalPagar,
        MontoMaximoDePrestamo: MontoMaximoDePrestamo
    };

    return res;
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

function calcularPuntuacionCapacidadPago(ingresos, egresos) {
    let puntuacion = 0;
    let puntajeIngresos = 0;
    let puntajeEgresos = 0;
    let puntajeRelacionDeudaIngreso = 0;

    // Puntuación por ingresos mensuales netos
    if (ingresos < 5000) {
        puntuacion += 0;
        puntajeIngresos = 0;
    } else if (ingresos <= 10000) {
        puntuacion += 3;
        puntajeIngresos = 3;
    } else {
        puntuacion += 5;
        puntajeIngresos = 5;
    }

    // Puntuación por egresos mensuales
    const porcentajeEgresos = (egresos / ingresos) * 100;
    if (porcentajeEgresos > 50) {
        puntuacion -= 3;
        puntajeEgresos = 3;
    } else if (porcentajeEgresos > 30) {
        puntuacion -= 1;
        puntajeEgresos = 1;
    }

    const deuda = ingresos - egresos;

    // Puntuación por relación deuda-ingreso
    const porcentajeDeudaIngreso = (deuda / ingresos) * 100;
    if (porcentajeDeudaIngreso > 40) {
        puntuacion -= 5;
        puntajeRelacionDeudaIngreso = 5;
    } else if (porcentajeDeudaIngreso > 20) {
        puntuacion -= 2;
        puntajeRelacionDeudaIngreso = 2;
    }

    res = {
        puntuacion: puntuacion,
        deuda: deuda,
        porcentajeEgresos: porcentajeEgresos,
        porcentajeDeudaIngreso: porcentajeDeudaIngreso,
        puntajeEgresos: puntajeEgresos,
        puntajeIngresos: puntajeIngresos,
        puntajeRelacionDeudaIngreso: puntajeRelacionDeudaIngreso
    }
    console.log(deuda);

    return res;
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