def calcular_digito_verificador(clabe_sin_dv):
    # Factores de ponderación fijos
    ponderaciones = [3, 7, 1] * 6  # Se repiten cada 3 posiciones hasta completar 17 dígitos
    
    # Multiplicar cada dígito por su ponderación
    resultados = [int(clabe_sin_dv[i]) * ponderaciones[i] for i in range(17)]
    
    # Obtener módulo 10 de cada resultado
    modulos = [res % 10 for res in resultados]
    
    # Sumar todos los valores
    suma_total = sum(modulos)
    
    # Obtener módulo 10 de la suma
    A = suma_total % 10
    
    # Calcular el dígito verificador
    digito_verificador = (10 - A) % 10
    
    # Retornar la CLABE completa
    return clabe_sin_dv + str(digito_verificador)

# USO
cod_banco = "646" #STP
cod_plaza = "180" # default
pref_cliente = "5761" #burs 
cuenta_cliente_final = "0000002"
clabe_base = cod_banco + cod_plaza + pref_cliente + cuenta_cliente_final  # 17 dígitos sin el último
clabe_valida = calcular_digito_verificador(clabe_base)
print(f"CLABE válida: {clabe_valida}")
