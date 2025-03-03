const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generatePDF(nombre) {
  return new Promise((resolve, reject) => {
    // Configuración del PDF: tamaño carta y márgenes
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 50, left: 50, right: 50, bottom: 50 }
    });

    // Usaremos las fuentes core de PDFKit: Times-Roman y Times-Bold
    doc.font('Times-Roman').fontSize(12);

    // Ruta temporal para el PDF generado
    const tempPdfPath = path.join(__dirname, 'temp.pdf');
    const pdfStream = fs.createWriteStream(tempPdfPath);
    const hash = crypto.createHash('sha256');

    doc.pipe(pdfStream);

    // =========================================================================
    // ENCABEZADO – CARÁTULA
    // =========================================================================
    doc
      .fontSize(12)
      .text("Burs Financiera Mexicana. Sociedad Anónima Promotora de Inversión de Capital Variable.", { align: 'center' });
    doc.moveDown(0.5);
    doc
      .text("Número de contrato: 11036340", { align: 'center' });
    doc.moveDown();
    doc
      .font('Times-Bold').fontSize(14)
      .text("CARÁTULA DE CRÉDITO", { align: 'center' });
    doc.moveDown(2);
    doc.font('Times-Roman').fontSize(12);

    // =========================================================================
    // BLOQUE DE DATOS – TABLA SIMULADA (dos columnas)
    // =========================================================================
    const tableLeft = doc.x;      // Posición X inicial de la "tabla"
    let tableTop = doc.y;         // Posición Y inicial
    const colWidth = 250;         // Ancho de la primera columna
    const colHeight = 22;         // Alto de cada fila
    const tableGap = 0;           // Separación entre columnas
    const lineWidth = 520;        // Ancho total de la "tabla"

    // Función para dibujar una fila con dos subceldas
    function drawRow(leftText, rightText) {
      doc
        .rect(tableLeft, tableTop, lineWidth, colHeight)
        .stroke();
      doc
        .font('Times-Bold')
        .text(leftText, tableLeft + 5, tableTop + 5, {
          width: colWidth - 10
        });
      doc
        .font('Times-Roman')
        .text(rightText, tableLeft + colWidth + tableGap + 5, tableTop + 5, {
          width: (lineWidth - colWidth) - 10
        });
      tableTop += colHeight;
    }

    drawRow("Nombre Comercial del Producto:", "Préstamo Personal");
    drawRow("Tipo de Crédito:", "Crédito simple");
    drawRow("CAT (Costo Anual Total):", "5,740.4% fijo (Sin IVA. Para fines informativos y de comparación)");
    drawRow("TASA DE INTERÉS ANUAL ORDINARIA Y MORATORIA:", "Tasa de Interés Ordinaria: 435.60% FIJA / Tasa de Interés Moratoria: 756.00% FIJA");
    drawRow("MONTO DEL CRÉDITO:", "$2,500.00 (dos mil quinientos pesos 00/100 M.N.)");
    drawRow("MONTO TOTAL A PAGAR:", "$2,921.08 (dos mil novecientos veintiun pesos 08/100 M.N.)");

    doc.moveDown();
    doc.font('Times-Bold').text("PLAZO DEL CREDITO:", { continued: true });
    doc.font('Times-Roman').text(" 12 días naturales.");
    doc.moveDown(0.5);
    doc.font('Times-Bold').text("FECHA LÍMITE DE PAGO:", { continued: true });
    doc.font('Times-Roman').text(" 18 de Octubre del 2023 ", { continued: true });
    doc.font('Times-Bold').text("   FECHA DE CORTE:", { continued: true });
    doc.font('Times-Roman').text(" 18 de Octubre del 2023");
    doc.moveDown(1);

    doc.font('Times-Bold').text("COMISIONES RELEVANTES");
    doc.font('Times-Roman').moveDown(0.5);
    doc.text("El producto Préstamo Personal no contempla el cobro de alguna comisión.");
    doc.moveDown(1);

    doc.font('Times-Bold').text("ADVERTENCIAS");
    doc.font('Times-Roman').moveDown(0.5);
    doc.text("Incumplir tus obligaciones te puede generar comisiones e intereses moratorios. Contratar créditos que excedan tu capacidad de pago afecta tu historial crediticio.");
    doc.moveDown(1);

    doc.font('Times-Bold').text("SEGUROS:");
    doc.font('Times-Roman').text("Seguro: No aplica");
    doc.text("Aseguradora: No aplica");
    doc.text("Cláusula: No aplica");
    doc.moveDown(1);

    doc.font('Times-Bold').text("ESTADO DE CUENTA");
    doc.font('Times-Roman').text("Enviar a domicilio:");
    doc.text("Consulta vía internet:");
    doc.text("Envío por correo electrónico: X");
    doc.moveDown(1);

    doc.font('Times-Bold').text("ACLARACIONES Y RECLAMACIONES:");
    doc.font('Times-Roman').text("Unidad Especializada para Atención a Usuarios:");
    doc.text("Domicilio: Av. Real Acueducto 300, int: 902, Col. Puerta de Hierro, Zapopan, Jalisco, México. C.P. 45116");
    doc.text("Teléfonos: 800 030 0015.");
    doc.text("Correo electrónico: usuarios@burs.com.mx   Página de Internet: www.burs.com.mx");
    doc.moveDown(2);

    doc.text("La presente caratula de crédito es parte integrante del contrato de Crédito Simple", { align: 'center' });
    doc.moveDown(2);

    // =========================================================================
    // INICIO DEL CONTRATO – SEGUNDA PÁGINA
    // =========================================================================
    doc.addPage();
    doc.moveDown();

    // Títulos del contrato
    doc.font('Times-Bold').fontSize(14).text("CONTRATO DE CRÉDITO SIMPLE", { align: 'center' });
    doc.moveDown();
    doc.font('Times-Roman').fontSize(12).text("“PRÉSTAMO PERSONAL”", { align: 'center' });
    doc.moveDown(2);

    // =========================================================================
    // DECLARACIONES
    // =========================================================================
    doc.font('Times-Bold').text("DECLARACIONES:");
    doc.moveDown();

    doc.font('Times-Roman').text("I.- Declara “BURS” por medio de su representante legal:");
    doc.text("    a) Ser una Sociedad Anónima Promotora de Inversión de Capital Variable, constituida de conformidad con las Leyes de la República Mexicana.");
    doc.text("    b) Que su registro federal de contribuyentes (RFC) es: BFM-240201-TZ6");
    doc.text("    c) Que su domicilio social y fiscal se encuentra ubicado en Av. Real Acueducto 300, interior 902ª, Col. Puerta de Hierro, Zapopan, Jalisco, México. C.P. 45116 y que su página de internet institucional es www.burs.com.mx y que la página de internet del producto financiero cuya contratación se formaliza mediante el presente contrato es: www.burs.com.mx.");
    doc.text("    d) Que garantiza a través de medidas de seguridad administrativas, técnicas y físicas que todo lo relativo a sus datos personales estarán protegidos en todo momento bajo los más altos estándares de seguridad, garantizando a su vez la más estricta Confidencialidad y Privacidad de los mismos, todo aunado a las políticas y procedimientos que “BURS” tenga implementados al respecto, apegándose en todo momento a lo establecido por la Ley Federal de Protección de Datos Personales en Posesión de Particulares, su Reglamento y el Aviso de Protección de Datos Personales que previo a la firma del presente contrato, estuvo a su disposición. De igual forma “BURS” no venderá, alquilará o enajenará de forma alguna sus datos personales ni los compartirá, transmitirá o transferirá de forma alguna, para fines de comercialización de bienes y servicios sin que medie su consentimiento. “BURS” podrá retener sus datos personales por los términos que las leyes prevean y a petición de la autoridad cuando medie orden judicial o trámite legal que lo involucre. “BURS” solamente recaba y utiliza sus datos personales para el cumplimiento de las finalidades descritas en el Aviso de Privacidad que se encuentra disponible y actualizado en todo momento en www.burs.com.mx.");
    doc.text("    e) Se formulan las siguientes indicaciones en favor de “EL ACREDITADO”: (i) Al momento de celebrarse el presente contrato de manera electrónica, se le proporciona de la misma manera un ejemplar del mismo, así como todos sus anexos, mismos que consisten en: Carátula del Contrato de crédito simple, Autorización de cargo a cuenta bancaria y Anexo de Disposiciones Legales. (ii) La Carátula que se proporciona, forma parte integrante del contrato. (iii) La autorización de cargo a cuenta bancaria que se proporciona, forma parte integral del presente contrato. (iv) El Anexo de Disposiciones Legales, así como el modelo del contrato de crédito simple que se encuentre vigente, estarán siempre disponibles para consulta en las oficinas de “BURS” para consulta.");
    doc.moveDown();

    doc.text("II.- Declara “EL ACREDITADO” bajo protesta de decir verdad:");
    doc.text("    a) Que es una persona física de nacionalidad mexicana, con pleno ejercicio y goce de sus facultades para la celebración del presente contrato y que se encuentra al corriente en el pago de las obligaciones fiscales a su cargo.");
    doc.text("    b) Su Clave Única de Registro de Población es: CAGF880705HJCMMR02.");
    doc.text("    c) Que actúa por cuenta propia y no por cuenta de terceros.");
    doc.text("    d) Que previamente a la celebración del presente contrato, “BURS” le dio a conocer mediante su publicación en el portal www.burs.com.mx el contenido del presente contrato y que ha comprendido el contenido y manifiesta estar de acuerdo en lo estipulado en el presente instrumento y en los demás documentos a suscribir, los cargos o gastos que se generen derivado del mismo, así como el CAT, mismo que equivale al 5,740.4% (cinco mil setecientos cuarenta punto cuarenta por ciento) y que se define como el “Costo Anual Total de financiamiento expresado en términos porcentuales anuales que, para fines informativos y de comparación, incorpora la totalidad de los costos y gastos inherentes a los Créditos” (sin incluir el valor agregado, correspondiente al presente Crédito) mismo que se indica también en la Carátula del presente contrato.");
    doc.text("    e) Declara bajo protesta de decir verdad que toda la información que proporcionó a “BURS” a la fecha de firma del presente contrato es verídica.");
    doc.text("    f) Que la celebración del presente contrato no constituye violación a ningún otro acuerdo, convenio u obligación contraída frente a terceros.");
    doc.text("    g) Que los recursos con los cuales ha de pagar los servicios o productos recibidos, así como las obligaciones contraídas, han sido obtenidos o generados a través de una fuente de origen lícito y con recursos propios. El destino de los servicios o productos adquiridos será dedicado tan solo a fines permitidos por la ley y que no se encuentran dentro de los supuestos establecidos por los artículos 139 Quáter y 400 Bis del Código Penal Federal.");
    doc.text("    h) Que “BURS” le ha brindado la siguiente información: (i) monto y fecha límite del pago a realizar en virtud de tratarse de un crédito que se paga en una sola amortización, así como la forma para liquidarlo; (ii) el derecho que tiene “EL ACREDITADO” para realizar pagos anticipados, adelantados o liquidar el Crédito anticipadamente, y las condiciones para ello; (iii) intereses ordinarios, forma de calcularlos y el tipo de tasa aplicable; (iv) el interés moratorio, forma de calcularlo y el tipo de tasa aplicable y (v) monto total a pagar por el crédito, intereses e impuestos, para lo cual le fueron proporcionados los referidos conceptos debidamente desglosados y que son los mismos que se indican en el presente contrato.");
    doc.text("    i) Que las disposiciones legales que se mencionan en el presente contrato pueden ser consultadas y que se encuentran a su disposición en las oficinas de “BURS”.");
    doc.text("    j) Que reconoce y acepta haber recibido de manera electrónica la totalidad de los anexos a los que se hace referencia el inciso e) del apartado de declaraciones de “BURS”.");
    doc.text("    k) Que valida que sus datos personales fueron obtenidos de una identificación oficial vigente.");
    doc.text("    l) Que está de acuerdo en manifestar su consentimiento por medios electrónicos cumpliendo con las Disposiciones del Código de Comercio, así como con la 7ª y la 13ª de las Disposiciones de Carácter General a que se refieren los artículos 115 de la Ley de Instituciones de Crédito en relación con el 87- D de la Ley General de Organizaciones y Actividades Auxiliares del Crédito y 95-Bis de este último ordenamiento, aplicables a las sociedades financieras de objeto múltiple respecto de las operaciones relativas al otorgamiento de créditos de manera remota y la celebración del presente contrato.");
    doc.moveDown();

    doc.text("III.- Las PARTES declaran:");
    doc.text("    Que es su voluntad celebrar el presente contrato de crédito simple con intereses, en los términos y condiciones pactadas en el presente instrumento, para lo cual otorgan las siguientes:");
    doc.moveDown();

    // =========================================================================
    // CLÁUSULAS
    // =========================================================================
    doc.font('Times-Bold').text("CLÁUSULAS:");
    doc.moveDown();

    // CAPÍTULO I – OBJETO DEL CONTRATO
    doc.font('Times-Bold').text("CAPÍTULO I");
    doc.font('Times-Bold').text("DEL OBJETO DEL CONTRATO");
    doc.moveDown();

    doc.font('Times-Roman').text("PRIMERA. - OBJETO DEL CONTRATO.");
    doc.text("En este acto “BURS” otorga un crédito simple en favor de “EL ACREDITADO”, por la cantidad de $2,500.00 (dos mil quinientos pesos 00/100 M.N.) y “EL ACREDITADO” se obliga a restituir a “BURS” el importe del crédito más los impuestos e intereses que se estipulan hasta la liquidación total del crédito.");
    doc.text("“EL ACREDITADO” pagará a “BURS” en una sola exhibición o amortización la totalidad del crédito otorgado, con los respectivos intereses ordinarios, impuestos a la fecha de vencimiento establecida en la cláusula DÉCIMA SEGUNDA del presente contrato.");
    doc.moveDown();

    doc.font('Times-Roman').text("SEGUNDA. - MEDIO DE DISPOSICIÓN DEL CRÉDITO.");
    doc.text("“EL ACREDITADO” dispondrá de la totalidad del Crédito en una sola exhibición mediante transferencia electrónica o mediante depósito bancario a la cuenta Clave Bancaria Estandarizada (CLABE) NO APLICA, número de tarjeta ************2109 que “EL ACREDITADO” tiene apertura en la institución bancaria denominada BBVA BANCOMER.");
    doc.text("El Crédito se entenderá dispuesto una vez que los recursos queden depositados en la cuenta señalada en la cláusula anterior y el comprobante de dicha operación hará las veces del recibo más amplio y suficiente que en derecho proceda.");
    doc.text("“EL ACREDITADO”, de conformidad con lo dispuesto en el artículo 11 Bis 1 de la Ley para la Transparencia y Ordenamiento de los Servicios Financieros, contará con un periodo de gracia de diez (10) días hábiles posteriores a la firma del presente contrato para cancelarlo, sin que por ello “BURS” pueda cobrar comisión alguna, así como tampoco cobrará intereses o penalizaciones, regresando las cosas al estado que guardaban antes de su firma, sin responsabilidad alguna para “EL ACREDITADO” siempre que éste último no haya dispuesto, ya sea de manera parcial o total, del crédito objeto del presente contrato. Transcurrido el término anterior y en caso de que “EL ACREDITADO” haya dispuesto del Crédito, deberá cumplir con todas y cada una de las obligaciones que se estipulan en este contrato, incluyendo el pago íntegro del Crédito que se le otorga, los impuestos e intereses ordinarios generados y en su caso, los intereses moratorios que se pudieran generar.");
    doc.moveDown();

    doc.font('Times-Roman').text("TERCERA. - DESTINO DEL CRÉDITO.");
    doc.text("“EL ACREDITADO” se obliga a destinar el importe total del Crédito recibido, tal y como lo manifestó en la solicitud de crédito, precisamente para uso personal.");
    doc.moveDown();

    // CAPÍTULO II – DEL PAGO
    doc.font('Times-Bold').text("CAPÍTULO II");
    doc.font('Times-Bold').text("DEL PAGO");
    doc.moveDown();

    doc.font('Times-Roman').text("CUARTA. - LUGAR Y FORMA DE PAGO.");
    doc.text("El pago del Crédito que “EL ACREDITADO” deba hacer a favor de “BURS”, derivado del presente contrato, lo hará en una sola exhibición o amortización y sin necesidad de previo cobro.");
    doc.text("“EL ACREDITADO” realizará el pago del Crédito objeto del presente contrato mediante depósito bancario o transferencia electrónica al número de cuenta CIE 1356976 y número de referencia CAGF88070506KJP08 asignado a “EL ACREDITADO”, o mediante transferencia electrónica efectuada al número de cuenta clave bancaria estandarizada (CLABE): 012914002013569762 del Banco: BBVA-BANCOMER a nombre de \"FERNANDO CAMPOS GOMEZ\" a más tardar el día señalado como fecha de vencimiento en la cláusula DÉCIMA SEGUNDA, la cantidad indicada como Gran Total.");
    doc.text("Para los efectos señalados anteriormente, se acreditará el pago del Crédito conforme a los medios que se describen a continuación:");
    doc.moveDown();
    doc.text("    Efectivo. - El pago se acreditará el mismo día en que se realice.");
    doc.moveDown();
    doc.text("    Cheque. - Si el pago se realiza en cheque, se acreditará a más tardar el día hábil siguiente si el pago se hace antes de las 16:00 horas, o a más tardar el segundo día hábil siguiente si el pago se hace después de las 16:00 horas. No se cobrarán comisiones en caso de que el depósito del cheque para abonar a “BURS”, sea devuelto o rechazado el pago por parte del banco librador.");
    doc.moveDown();
    doc.text("    Sistema de Pagos Electrónicos Interbancarios (SPEI). - Si el pago se realiza a través del SPEI, se acreditará el mismo día hábil en que se ordene la transferencia.");
    doc.moveDown();
    doc.text("    Sistema de Transferencias Electrónicas. - Si el pago se realiza a través del Sistema de Transferencias Electrónicas, se acreditará a más tardar el día hábil siguiente a aquél en que se ordene la transferencia.");
    doc.text("Para efectos del presente contrato, por días y horas hábiles se entenderán los días dispuestos por la Comisión Nacional Bancaria y de Valores (CNBV) para cerrar operaciones en términos del artículo 70 de la Ley General de Organizaciones y Actividades Auxiliares del Crédito. Cuando la fecha límite de pago sea en un día inhábil debe aclararse que se recorrerá al siguiente día hábil, sin que proceda el cobro de comisiones o intereses moratorios.");
    doc.text("En caso de que “EL ACREDITADO” realice un pago en exceso, acepta que el mismo le será devuelto mediante depósito a la cuenta o tarjeta que se indica en la cláusula SEGUNDA del presente contrato, previa solicitud que dirija a atención a clientes de “BURS”.");
    doc.text("En el mismo tenor, “EL ACREDITADO” autoriza expresamente a “BURS”, mediante la suscripción del formato de domiciliación correspondiente, para que cargue en la cuenta bancaria que “EL ACREDITADO” proporcione durante la adquisición de cualquier producto, la cantidad indicada como Gran Total a la fecha de su vencimiento y en su caso, los intereses moratorios que con motivo de la falta de pago oportuno de la referida cantidad, se causen en términos de lo previsto en la Cláusula SÉPTIMA del presente contrato, para lo cual “EL ACREDITADO” también autoriza que en caso de incurrir en mora, “BURS” realice el cargo por el adeudo total en la cuenta previamente obtenida.");
    doc.moveDown();

    doc.font('Times-Roman').text("QUINTA.- PRELACIÓN DEL PAGO.");
    doc.text("“BURS” aplicará las cantidades que reciba en pago conforme al siguiente orden: (i) Intereses moratorios en caso de aplicar; (ii) intereses ordinarios; (iii) impuestos; y (iv) capital. En caso de que “BURS” tuviera que demandar a “EL ACREDITADO” por incumplimiento a las obligaciones de pago previstas en el presente contrato, los pagos que realice se aplicarán en primer lugar a los gastos y costas del juicio determinados por una autoridad judicial y después se seguirá el orden estipulado en la presente cláusula.");
    doc.moveDown();

    doc.font('Times-Roman').text("SEXTA.- INTERESES ORDINARIOS.");
    doc.text("“EL ACREDITADO”, se obliga a pagar a “BURS”, por el otorgamiento del presente crédito y sin necesidad de previo requerimiento o cobro, intereses ordinarios que se generarán a partir de la disposición del crédito y hasta la fecha de su liquidación total a una tasa de interés ordinario anual fija del 435.60% (cuatrocientos treinta y cinco puntos sesenta por ciento) más el respectivo impuesto al valor agregado; los intereses se calcularán sobre el saldo insoluto del crédito.");
    doc.text("La fecha para el cálculo de intereses corresponderá a la fecha límite de pago y podrá consultarse en la Carátula del presente Contrato. El pago de los intereses no podrá ser exigido por adelantado, sino únicamente por el periodo vencido.");
    doc.text("Para calcular los intereses ordinarios a pagar por el otorgamiento del presente Crédito a liquidar en una sola exhibición o amortización, se deberá seguir la siguiente metodología: 1) la tasa anual prevista en la presente cláusula se dividirá entre 360 (trescientos sesenta) días naturales, obteniéndose una tasa diaria; 2) La tasa diaria, se multiplicará por el número de días naturales que correspondan desde el otorgamiento del crédito y hasta la fecha de vencimiento del pago del mismo en una sola exhibición o amortización; 3) La tasa resultante, se multiplicará por el monto del crédito, y el resultado final obtenido, será la cantidad que por concepto de intereses ordinarios deberá pagar “EL ACREDITADO” a “BURS” en la fecha límite de pago del Crédito.");
    doc.text("No podrán establecerse nuevas comisiones, incrementar su monto, ni modificar las tasas de interés pactadas en este contrato, salvo en el caso de reestructuración previo consentimiento expreso de “EL ACREDITADO”.");
    doc.moveDown();

    doc.font('Times-Roman').text("SÉPTIMA. - INTERESES MORATORIOS.");
    doc.text("En caso de incumplimiento en el pago del Crédito a la fecha de su vencimiento, “EL ACREDITADO” deberá pagar intereses moratorios sobre el saldo vencido y no pagado; dichos intereses serán computables desde la fecha en que se constituya en mora y hasta la de su total liquidación, a razón de aplicarle una tasa de interés moratoria anual fija del 756.00% (setecientos cincuenta y seis punto cero por ciento) pagaderos conjuntamente con el principal y el correspondiente Impuesto al Valor Agregado que sobre esos intereses moratorios genere.");
    doc.text("“BURS” establece como monto máximo para el cálculo de Intereses Moratorios el equivalente a 11 (once) días naturales de atraso, los cuales se contarán a partir del primer día en que “EL ACREDITADO” haya incumplido con el plazo de pago establecido en el contrato. Dichos intereses serán exigidos únicamente por el tiempo en el que el crédito haya permanecido en mora.");
    doc.text("“EL ACREDITADO\" podrá revisar los intereses moratorios adeudados ingresando a su perfil en www.burs.com.mx la fecha de cálculo siempre será al día de la consulta en virtud de que los intereses moratorios se empiezan a cargar a partir del primer día en mora y durante 11 (once) días.");
    doc.text("El cálculo de los intereses moratorios se efectuará de la siguiente forma: 1) Se deberá dividir la tasa de interés moratoria anual prevista en el primer párrafo de la presente cláusula entre 360 (trescientos sesenta) días naturales, 2) El resultado obtenido se multiplica por los días de incumplimiento hasta la fecha del pago total, 3) La tasa resultante se multiplicará por el monto de capital vencido del Crédito en el periodo correspondiente y 4) el producto obtenido será la cantidad que por concepto de Intereses Moratorios deberá pagar “EL ACREDITADO” a “BURS” en la fecha del pago total del incumplimiento.");
    doc.text("No podrán establecerse nuevas comisiones, incrementar su monto, ni modificar las tasas de interés pactadas en este contrato, salvo en el caso de reestructuración previo consentimiento expreso de “EL ACREDITADO”.");
    doc.moveDown();

    doc.font('Times-Roman').text("OCTAVA. - COMISIONES.");
    doc.text("Este contrato no prevé el cobro de ninguna comisión.");
    doc.moveDown();

    doc.font('Times-Roman').text("NOVENA. - CARTERA VENCIDA.");
    doc.text("En caso de que “EL ACREDITADO” omita realizar el pago del crédito objeto del presente contrato en la fecha pactada como vencimiento, se considerará cartera vencida al haber transcurrido el primer día hábil contado a partir de la fecha límite de pago antes prevista.");
    doc.moveDown();

    doc.font('Times-Roman').text("DÉCIMA. - PAGOS ANTICIPADOS.");
    doc.text("“BURS” está obligado a aceptar pagos anticipados parciales o totales de los créditos menores al equivalente a 900,000 UDIS (Unidades de Inversión), siempre que “EL ACREDITADO” lo solicite y a la fecha de la solicitud se encuentre al corriente el pago exigible establecido en este contrato y que el importe del pago anticipado sea por una cantidad igual al pago total del presente Crédito.");
    doc.moveDown();

    doc.text("Cuando “EL ACREDITADO” solicite efectuar pagos anticipados, “BURS” le informará el saldo insoluto; dicha información le será proporcionada por escrito si el pago anticipado se efectúa en alguna de las oficinas de “BURS” y cuando el pago se realice fuera de sucursal, “BURS” y “EL ACREDITADO” pactan de común acuerdo que el saldo insoluto será informado a “EL ACREDITADO” por escrito al correo electrónico que éste último haya proporcionado para tales efectos. Los pagos que realice “EL ACREDITADO” antes de la fecha en que sea exigible el pago del crédito, se considerarán como pagos anticipados y no pagos adelantados. Los pagos anticipados se aplicarán en forma exclusiva al Saldo Insoluto de Capital.");
    doc.text("Cuando el importe de los pagos anticipados no fuera suficiente para amortizar el saldo insoluto en su totalidad, “BURS” los aplicará al saldo insoluto del capital por lo que se reducirá el monto del pago total pendiente y “BURS” actualizará el nuevo saldo insoluto, en el entendido que, en esos casos, los intereses por devengar se calcularán con base en el referido nuevo saldo insoluto y la referida nueva cantidad a pagar en la fecha límite de pago del crédito se pondrá a disposición de “EL ACREDITADO” a través del correo electrónico que “EL ACREDITADO” señaló en su solicitud de crédito.");
    doc.text("En caso de que el pago anticipado sea por un importe igual al saldo insoluto, “BURS” deberá entregar una constancia en la que informe el fin de la relación contractual y la inexistencia de adeudos derivados exclusivamente de dicha relación, dentro de diez días hábiles a partir de que se hubiera realizado el pago del adeudo.");
    doc.text("Igualmente, “BURS” deberá entregar el saldo a favor, en su caso, en la fecha en que se dé por terminada la operación o al no haber acudido “EL ACREDITADO” a la sucursal u oficina de “BURS”, informarle que se encuentra a su disposición y determinar la forma cómo le puede ser devuelto.");
    doc.moveDown();

    doc.font('Times-Roman').text("DÉCIMA PRIMERA. - PAGOS ADELANTADOS.");
    doc.text("Cuando “EL ACREDITADO” lo solicite, “BURS” podrá recibir pagos adelantados, es decir, pagos que aún y cuando el pago del crédito no sea exigible, se efectúen con el fin de aplicarlo(s) al pago del crédito.");
    doc.moveDown();

    // CAPÍTULO III – VIGENCIA Y TERMINACIÓN DEL CONTRATO
    doc.font('Times-Bold').text("CAPÍTULO III");
    doc.font('Times-Roman').text("DE LA VIGENCIA Y TERMINACIÓN DEL CONTRATO");
    doc.moveDown();

    doc.font('Times-Roman').text("DÉCIMA SEGUNDA. - VIGENCIA DEL CONTRATO O PLAZO.");
    doc.text("El presente contrato es improrrogable y tendrá una vigencia de 12 (doce) días contados a partir de la fecha en la cual se efectuó la disposición del mismo, es decir, aquella en la que “EL ACREDITADO” recibió en su cuenta el monto del crédito por parte de “BURS”. A la fecha de vencimiento, “EL ACREDITADO” deberá realizar el pago del Gran Total, mismo que corresponde a la restitución del crédito otorgado, los intereses ordinarios e impuestos correspondientes, misma que asciende al monto de $2,921.08 (dos mil novecientos veintiún pesos 08/100 M.N.), salvo en el caso de que “EL ACREDITADO” incurra en alguna de las causales de rescisión establecidas en la cláusula DÉCIMA QUINTA del presente contrato.");
    doc.text("No obstante, su terminación, este contrato producirá todos sus efectos legales, hasta que “EL ACREDITADO” haya liquidado en su totalidad todas las cantidades adeudadas a su cargo.");
    doc.text("La terminación del contrato se podrá dar de manera anticipada cuando “EL ACREDITADO” realice el pago del saldo por los intereses devengados al día en que se realice dicho pago.");
    doc.text("“EL ACREDITADO” podrá conocer la fecha límite de pago del crédito contratado en todo momento, ingresando con su usuario y contraseña a su perfil en www.burs.com.mx; o en la Carátula del presente contrato.");
    doc.moveDown();

    doc.font('Times-Roman').text("DÉCIMA TERCERA. - CANCELACIÓN DEL CRÉDITO.");
    doc.text("“EL ACREDITADO”, de conformidad con lo dispuesto en el artículo 11 Bis 1 de la Ley para la Transparencia y Ordenamiento de los Servicios Financieros, contará con un periodo de gracia de diez (10) días hábiles posteriores a la firma del presente contrato para cancelarlo, sin que por ello “BURS” pueda cobrar comisión alguna, así como tampoco cobrará intereses o penalizaciones, regresando las cosas al estado que guardaban antes de su firma, sin responsabilidad alguna para “EL ACREDITADO” siempre que éste último no haya dispuesto, ya sea de manera parcial o total, del crédito objeto del presente contrato.");
    doc.moveDown();

    doc.font('Times-Roman').text("DÉCIMA CUARTA. - TERMINACIÓN ANTICIPADA.");
    doc.text("“EL ACREDITADO” podrá solicitar, en todo momento, la terminación anticipada del presente contrato, debiendo cubrir para ello, el monto total del adeudo de manera inmediata, incluyendo los intereses ordinarios y/o moratorios que éste hubiera generado hasta la fecha en que realice el pago, previa solicitud de terminación. Dicha solicitud deberá ser presentada por escrito en las oficinas de “BURS” o enviando un correo electrónico a la cuenta: usuarios@burs.com.mx desde su correo electrónico registrado a efecto de que “BURS” verifique su identidad, o bien, comunicándose a las oficinas de “BURS”. Una vez presentada dicha solicitud, “BURS” le proporcionará un acuse de recibo y clave de confirmación o número de folio, y verificará la autenticidad y veracidad de la identidad de “EL ACREDITADO” para la cual requerirá que se acredite su personalidad mediante la confirmación de su número de crédito y la exhibición de su identificación oficial.");
    doc.text("“BURS” dará por terminado el contrato el día hábil siguiente a aquel en que se reciba la solicitud si no existiesen adeudos. De lo contrario, “BURS” a más tardar el día hábil siguiente a la recepción de la solicitud, comunicará a “EL ACREDITADO” el monto del adeudo y dentro de los cinco días hábiles siguientes a su solicitud pondrá a su disposición dicho dato a determinada fecha, en una carta de liquidación, en las oficinas de “BURS” y en estricto beneficio del “EL ACREDITADO” la enviará al correo electrónico que éste proporcione para tales efectos, y una vez liquidados los adeudos se dará por terminado el contrato. Una vez realizado el pago de los adeudos, “BURS” dará por terminado el contrato y dentro de los 10 (diez) días hábiles siguientes al día de la liquidación, pondrá a disposición de “EL ACREDITADO” un documento donde se dé la constancia del fin de la relación contractual y la inexistencia de adeudos.");
    doc.text("En caso de que “EL ACREDITADO” tenga un saldo a favor, “BURS” le notificará a más tardar el día hábil siguiente que este se encuentra a su disposición para su devolución. “EL ACREDITADO” podrá aceptar que el saldo a favor le sea devuelto mediante depósito o transferencia electrónica a la cuenta bancaria que se encuentre a su nombre, misma que proporcionó a través de la solicitud del crédito y/o podrá informar a la Unidad Especializada de Atención a Usuarios (UNE) de “BURS” de alguna otra cuenta bancaria a su nombre, previa identificación de la titularidad, en la cual quisiere recibir el saldo a favor o mediante correo electrónico a la cuenta: usuarios@burs.com.mx");
    doc.moveDown();

    doc.font('Times-Roman').text("DÉCIMA QUINTA. - TERMINACIÓN POR CONDUCTO DE OTRA ENTIDAD FINANCIERA.");
    doc.text("“EL ACREDITADO” podrá convenir por escrito la terminación del presente contrato, por conducto de otra Entidad Financiera que se denominará receptora, y la cual, en caso de ser procedente debe abrir una cuenta a nombre de “EL ACREDITADO” y comunicará a “BURS” su compromiso sobre la veracidad y legitimidad de la instrucción de terminación por parte de “EL ACREDITADO”. La Entidad Financiera receptora liquidará a “BURS” el adeudo de “EL ACREDITADO”, convirtiéndose en acreedora de la misma por el importe correspondiente, y llevará a cabo los trámites respectivos, bajo su responsabilidad y sin cobro de comisión alguna por tales gestiones. Una vez abierta la nueva cuenta, la Entidad Financiera receptora debe entregar a “EL ACREDITADO” el Contrato de crédito simple, carátula que corresponda y confirmarle el pago y cancelación de las operaciones con “BURS”.");
    doc.text("La Entidad Financiera receptora, cuando ofrezca estos servicios, deberá recibir por escrito en sus sucursales, la solicitud de terminación del presente crédito que “EL ACREDITADO” desee realizar con “BURS”. Los documentos originales donde consta la manifestación de la voluntad de “EL ACREDITADO” para dar por terminada la relación contractual con “BURS”, deben ser conservados por la Entidad Financiera receptora como evidencia en su expediente, en el que conste el mecanismo de verificación de identidad utilizado. Lo anterior, sin perjuicio de hacer del conocimiento de “EL ACREDITADO” que, en todo caso, la Entidad Financiera receptora estará obligada a dar cumplimiento.");
    doc.text("En caso de la terminación del presente contrato que “EL ACREDITADO” solicite por conducto de la Entidad Financiera receptora, se hace de su conocimiento que “BURS” deberá: (I) Requerir a “EL ACREDITADO” confirmación de haber solicitado a la Entidad Financiera receptora el servicio de cancelación y transferencia de recursos a través de los datos de localización convenidos en el presente contrato; (II) Dar a conocer a la Entidad Financiera receptora, la información respecto al saldo y aquella que resulte necesaria para la terminación de la operación solicitada por “EL ACREDITADO”; y (III) En el movimiento de recursos entre “BURS” y la Entidad Financiera receptora, la operación de cargo en una Entidad y abono en la otra deberá realizarse con la misma fecha valor, considerando que para tales efectos “BURS” deberá renunciar a sus derechos de cobro remanente, que pudieran subsistir después del momento de la cancelación.");
    doc.moveDown();

    doc.font('Times-Roman').text("DÉCIMA SEXTA. - CAUSAS DE RESCISIÓN.");
    doc.text("Las partes convienen expresamente que, para el caso de que “EL ACREDITADO” dejará de cumplir con cualquiera de las obligaciones a su cargo derivadas de este contrato y, sin necesidad de declaración judicial previa, “BURS” podrá dar por terminado anticipadamente el contrato.");
    doc.text("En tal caso, será exigible el pago anticipado del total del adeudo que se encuentre pendiente de vencimiento, el cual procederá en los términos señalados en la cláusula DÉCIMA de este contrato. Específicamente, serán causas de rescisión de este contrato, los siguientes motivos:");
    doc.text("    a) En caso de que cualquiera de las declaraciones de “EL ACREDITADO” contenidas en este instrumento y la solicitud de crédito sea o resulte ser falsa o incorrecta.");
    doc.text("    b) En caso de que cualquier dato o información de “EL ACREDITADO” que sea entregada o hecha del conocimiento de “BURS” de forma dolosa sea o resulte ser falsa o incorrecta;");
    doc.text("    c) El incumplimiento de “EL ACREDITADO” a cualquiera de las obligaciones de hacer o de no hacer consignadas a su cargo en este contrato.");
    doc.text("    Si el Crédito otorgado fuera destinado a la consecución de cualquier acto ilícito.");
    doc.text("Ante la actualización de cualquiera de las causas de incumplimiento antes señalada, “EL ACREDITADO” estará obligado a pagar a “BURS” de manera inmediata el importe total del saldo insoluto del Crédito, que incluye los intereses ordinarios devengados, intereses moratorios en su caso, así como los gastos y cualquier otro concepto devengado contractual o legalmente, pago que deberá verificarse sin necesidad de presentación, requerimiento, protesto u otra notificación de cualquier clase a “EL ACREDITADO”, a todas las cuales renuncia expresamente por el presente instrumento. Sin perjuicio de lo anterior, “BURS” podrá también ejercitar aquellas acciones que conforme a la ley sean aplicables en contra de “EL ACREDITADO”.");
    doc.moveDown();

    doc.font('Times-Roman').text("DÉCIMA SÉPTIMA. - CIRCUNSTANCIAS ESPECIALES.");
    doc.text("Siempre y cuando opere en beneficio de “EL ACREDITADO”, “BURS” podrá ofrecerle una extensión o prórroga respecto a la forma de pago o vigencia del presente contrato, misma que operará únicamente en caso de que se cuente con el consentimiento expreso de “EL ACREDITADO” y en cualesquiera de los siguientes casos:");
    doc.text("    - Por causas de fuerza mayor, incluyendo sin limitar, desastres naturales, pandemias y/o crisis económicas; y/o");
    doc.text("    - Por decisiones gubernamentales o mandatos de autoridades competentes.");
    doc.text("El plazo de la extensión o prórroga y las condiciones de la misma, en su caso de que sea ofrecida a \"EL ACREDITADO\", se ofrecerá en su estricto beneficio y en función de la situación específica que acontezca; se hará del conocimiento de “EL ACREDITADO” mediante correo electrónico a la cuenta que éste haya determinado para tales efectos, de manera oportuna y previo a que dicha extensión o prórroga surta efectos.");
    doc.text("La extensión o prórroga establecida en la presente cláusula, bajo ninguna circunstancia, afectará el historial crediticio de \"EL ACREDITADO\" ni modificará las condiciones del presente contrato en su perjuicio.");
    doc.text("En caso de que \"EL ACREDITADO\", no deseara ejercer la extensión o prórroga otorgada en su beneficio y optara por pagar el crédito en la fecha de vencimiento originalmente en el presente contrato y la Tabla de Amortización.");
    doc.moveDown();

    // CAPÍTULO IV – MISCELÁNEOS
    doc.font('Times-Bold').text("CAPÍTULO IV");
    doc.font('Times-Roman').text("MISCELÁNEOS");
    doc.moveDown();

    doc.font('Times-Roman').text("DÉCIMA OCTAVA. - ESTADO DE CUENTA.");
    doc.text("En términos del último párrafo del Artículo 33 de las Disposiciones de Carácter General en materia de Transparencia aplicables a las Sociedades Financieras de Objeto Múltiple, Entidades No Reguladas, que al efecto señala que:");
    doc.text("“Tratándose de operaciones de crédito, préstamo o financiamiento, cuyo pago deba efectuarse en una sola exhibición bastará que las Entidades Financieras pongan a disposición de los Usuarios la consulta de saldos y movimientos, de conformidad con los contratos respectivos.”");
    doc.text("Toda vez que el presente crédito se liquida en una sola exhibición, “BURS” hace del conocimiento de “EL ACREDITADO” que para consulta de saldos y movimientos de manera gratuita podrá ingresar a su perfil en la página de www.burs.com.mx.");
    doc.text("Para facilitar la consulta, “EL ACREDITADO” acepta y reconoce que podrá conocer el detalle del crédito contratado en todo momento, ingresando con su usuario y contraseña a su perfil en la página de www.burs.com.mx");
    doc.text("En caso de que lo requiera, “EL ACREDITADO” podrá solicitar a “BURS” el desglose de los movimientos referentes a su crédito en todo momento y de manera gratuita a través del correo electrónico: usuarios@burs.com.mx y/o a través de la Unidad Especializada de Atención a Usuarios (UNE) que “BURS” tiene señaladas en la cláusula VIGÉSIMA SEXTA del presente ordenamiento jurídico, estando este último obligado a hacerlo.");
    doc.moveDown();

    doc.font('Times-Roman').text("DÉCIMA NOVENA. - ORIGEN DE LOS RECURSOS.");
    doc.text("“BURS” financiará el crédito concedido a “EL ACREDITADO” con recursos provenientes de su capital. Asimismo, podrá otorgarle crédito total o parcialmente con recursos provenientes de financiamiento privado o de los programas de promoción que ofrece la banca de desarrollo mexicana.");
    doc.text("“EL ACREDITADO” declara que los recursos con los cuales pagará el crédito han sido obtenidos o generados a través de una fuente de origen permitido por la ley y con recursos propios.");
    doc.text("Asimismo, “EL ACREDITADO” señala que el destino de los recursos obtenidos de la contratación del crédito simple materia de este contrato, será destinado únicamente a fines permitidos por la ley y que no se encuentren dentro de los supuestos establecidos por los artículos 139 Quáter y 400 Bis del Código Penal Federal, mismos en los que se encuentra tipificado el lavado de dinero y el financiamiento al terrorismo.");
    doc.moveDown();

    doc.font('Times-Roman').text("VIGÉSIMA. - OBLIGACIONES DE HACER.");
    doc.text("En adición a cualquier otra obligación a su cargo derivada de este instrumento, “EL ACREDITADO” se obliga a cumplir con las siguientes obligaciones:");
    doc.text("    i) Cumplir con todas las cantidades que deban ser pagadas y con cada una de las obligaciones a su cargo, derivadas de este contrato y hasta que el Crédito y sus accesorios sean totalmente pagados.");
    doc.text("    ii) Notificar a “BURS” cualquier cambio de domicilio y/o medio de contacto, dentro de los 3 (tres) días hábiles siguientes a la fecha que se verifique dicho cambio.");
    doc.text("    iii) Notificar a “BURS”, dentro de los 3 (tres) días hábiles siguientes a la fecha que se verifique cualquier variación a la baja en el monto de sus ingresos o cualquier hecho y/o acto que pudiere traer como consecuencia el incumplimiento de las obligaciones de pago a cargo de “EL ACREDITADO” derivadas de este instrumento.");
    doc.moveDown();

    doc.font('Times-Roman').text("VIGÉSIMA PRIMERA. - OBLIGACIONES DE NO HACER.");
    doc.text("“EL ACREDITADO” no podrá, sin previa autorización por escrito de “BURS”, ceder de forma alguna, parcial o totalmente, los derechos y/o las obligaciones a su cargo derivadas del presente contrato.");
    doc.text("“BURS” no puede establecer nuevas comisiones, incrementar su monto, ni modificar las tasas de interés pactadas en este contrato, salvo en el caso de reestructuración previo consentimiento expreso del “EL ACREDITADO”.");
    doc.moveDown();

    doc.font('Times-Roman').text("VIGÉSIMA SEGUNDA. - INFORMACIÓN DE POSIBLES FRAUDES.");
    doc.text("“BURS” pondrá a disposición de “EL ACREDITADO” información para evitar posibles fraudes respecto del Crédito contratado a través del apartado Prevención de fraudes de “BURS” ubicado en la siguiente dirección: www.burs.com.mx.");
    doc.moveDown();

    doc.font('Times-Roman').text("VIGÉSIMA TERCERA. - AVISOS Y AUTORIZACIONES.");
    doc.text("“EL ACREDITADO” autorizó a “BURS” al momento de registrarse y crear su perfil en la página de internet www.burs.com.mx, a:");
    doc.text("    a) Proporcionar y recabar información sobre operaciones crediticias y otras de naturaleza análoga que haya celebrado con “BURS” a las Sociedades de Información Crediticia, en términos de la autorización previamente otorgada.");
    doc.text("    b) Consultar su información en las Sociedades de Información Crediticia de forma previa al otorgamiento del crédito únicamente cuando Burs recabe la autorización correspondiente mediante la solicitud que expuso a través de medios electrónicos y/o en tiendas físicas de sus afiliados comerciales.");
    doc.text("    c) Utilizar la información proporcionada en base a las finalidades descritas en el Aviso de Privacidad, mismo que fue autorizado por \"EL ACREDITADO\", previo a la entrega de su información para la celebración del presente contrato y el cual puede ser consultado y modificado en todo momento ingresando a su perfil en www.burs.com.mx.");
    doc.text("“EL ACREDITADO” conoce que “BURS”:");
    doc.text("    a) Deberá informar a las autoridades correspondientes sobre aquellas operaciones que pudieran considerarse que favorecen el lavado de dinero y financiamiento al terrorismo, en términos de las Disposiciones de carácter general a que se refieren los artículos 115 de la Ley de Instituciones de Crédito en relación con el 87-K de la Ley General de Organizaciones y Actividades Auxiliares del Crédito y 95-Bis de este último ordenamiento, aplicables a las sociedades financieras de objeto múltiple no reguladas.");
    doc.moveDown();

    doc.font('Times-Roman').text("VIGÉSIMA CUARTA. - MODIFICACIONES.");
    doc.text("En caso de que “BURS” desee modificar el presente contrato, deberá dar aviso a “EL ACREDITADO” con 30 (treinta) días naturales de anticipación, informando claramente los términos y condiciones que serán modificados y las consecuencias de dicha(s) modificación(es).");
    doc.text("En caso de que “EL ACREDITADO” no esté de acuerdo con las modificaciones planteadas, podrá solicitar la terminación anticipada del contrato, dentro de los treinta días posteriores al aviso, sin responsabilidad alguna a su cargo y bajo las condiciones pactadas originalmente, debiendo cubrir en su caso los adeudos que se generan hasta el término del plazo otorgado para el pago del crédito, sin que “BURS” pueda cobrarle penalización alguna por dicha causa, como lo establece el Artículo 17, último párrafo de las Disposiciones de Carácter General en materia de Transparencia aplicables a las Sociedades Financieras de Objeto Múltiple, Entidades No Reguladas.");
    doc.text("Asimismo, con la finalidad de dar certeza jurídica y favorecer la transparencia en beneficio de “EL ACREDITADO”, se hace de su conocimiento que cualquier aviso de modificación del presente contrato contendrá la denominación social y logotipo de “BURS”; nombre del producto o servicio financiero objeto del presente contrato; datos de contacto completos de su Unidad Especializada de Atención a Usuarios (UNE); un resumen de todas las modificaciones; fecha a partir de la cual entrarán en vigor las modificaciones del contrato; así como le recordará el derecho que le corresponde para dar por terminado el contrato de manera anticipada en caso de no estar de acuerdo con las modificaciones de mérito.");
    doc.text("Lo anterior, reiterando que no podrán establecerse nuevas comisiones, incrementar el monto de las comisiones ni modificarse las tasas de interés previstas en el presente contrato, salvo en casos de reestructura y previo consentimiento expreso de “EL ACREDITADO”.");
    doc.moveDown();

    doc.font('Times-Roman').text("VIGÉSIMA QUINTA. - CESIÓN DE DERECHOS DE COBRO.");
    doc.text("“EL ACREDITADO” autoriza expresamente a “BURS”, para endosar, ceder, negociar o transmitir en cualquier forma aun antes del vencimiento del contrato, la propiedad o los derechos para el cobro de este contrato y del pagaré que con motivo del crédito se llegue a suscribir.");
    doc.text("“EL ACREDITADO” autoriza irrevocablemente a “BURS” para que en cualquier caso previsto en esta cláusula, aún previo a la transmisión correspondiente, pueda dar toda la información que el nuevo acreedor o cesionario requiera respecto de “EL ACREDITADO”.");
    doc.text("“EL ACREDITADO” renuncia a que en caso de que “BURS” transmita, negocie de cualquier forma o grave los derechos y/o obligaciones del presente contrato le sean abonados los intereses a que se refiere el segundo párrafo del artículo 299 de la Ley General de Títulos y Operaciones de Crédito.");
    doc.moveDown();

    doc.font('Times-Roman').text("VIGÉSIMA SEXTA. - RETROACTIVIDAD.");
    doc.text("Las partes convienen en que los derechos y obligaciones derivados del presente contrato, surtirán sus efectos a partir de la fecha de su firma.");
    doc.moveDown();

    doc.font('Times-Roman').text("VIGÉSIMA SÉPTIMA. - DOMICILIOS.");
    doc.text("Todas las notificaciones, avisos y en general cualquier comunicación que las partes deban hacerse con motivo del presente contrato, sean éstos de carácter judicial o extrajudicial, surtirán sus efectos legales en los siguientes domicilios:");
    doc.text("“BURS”");
    doc.text("Av. Real Acueducto 300, interior 902, Col. Puerta de Hierro, Zapopan, Jalisco, México. C.P. 45116. Página de Internet: www.burs.com.mx.");
    doc.text("“EL ACREDITADO”");
    doc.text("Palo alto 580 Jardines de santa Isabel, Guadalajara, Jalisco, México CP. 44300");
    doc.text("Asimismo, las partes convienen en que cualquier cambio de sus domicilios, deberán notificarlo a la otra parte dentro de los 3 (tres) días naturales siguientes a la fecha en que ello ocurra, en el entendido de que, de no ser así, se considerarán válidas cualquier clase de notificaciones, judiciales o extrajudiciales, realizadas en los domicilios mencionados.");
    doc.moveDown();

    doc.font('Times-Roman').text("VIGÉSIMA OCTAVA. - CONSULTAS, ACLARACIONES, MOVIMIENTOS, RECLAMACIONES Y OTROS.");
    doc.text("Para realizar consultas de saldos, transacciones y movimientos “EL ACREDITADO” podrá optar por dirigirlas a la Unidad Especializada de Atención a Usuarios (UNE) de “BURS” mediante escrito, correo electrónico o cualquier otro medio por el que se pueda comprobar fehacientemente su recepción y que contenga los siguientes datos: (i) Nombre completo de “EL ACREDITADO” (ii) Número de crédito y (iii) Acreditando su personalidad exhibiendo copia de su identificación oficial vigente. Lo anterior, sin perjuicio de que en beneficio de “EL ACREDITADO”, “BURS” también pone a su disposición la posibilidad de consultar saldos, transacciones y movimientos mediante el ingreso a la página de internet www.burs.com.mx. con los datos de identificación correspondientes (usuario y contraseña).");
    doc.text("En caso de aclaraciones y reclamaciones que deriven del Crédito, las Partes reconocen y acuerdan que el procedimiento y los medios para darle seguimiento a las mismas será el siguiente:");
    doc.text("    (i) Cuando “EL ACREDITADO” no esté de acuerdo con alguno de los movimientos señalados en su perfil, respectivo o en los medios electrónicos, ópticos o de cualquier otra tecnología pactados en el presente contrato, podrá presentar una solicitud de aclaración dentro del plazo de 90 (noventa) días naturales contados a partir de la fecha de corte o, en su caso, de la realización de la operación o del servicio. La solicitud respectiva podrá presentarse ante la Unidad Especializada de Atención a Usuarios (UNE) de “BURS”, mediante escrito, correo electrónico o cualquier otro medio por el que se pueda comprobar fehacientemente su recepción, estando “BURS” obligada a acusar recibo de dicha solicitud.");
    doc.text("    (ii) Una vez recibida la solicitud de aclaración, “BURS” tendrá un plazo máximo de 45 (cuarenta y cinco) días para entregar a “EL ACREDITADO” el dictamen correspondiente, anexando copia simple del documento o evidencia considerada para la emisión de dicho dictamen, con base en la información que, conforme a las disposiciones aplicables, deba obrar en su poder, así como un informe detallado en el que se respondan todos los hechos contenidos en la solicitud presentada por “EL ACREDITADO”. El dictamen e informe antes referidos se formularán por escrito y serán suscritos por personal de “BURS” facultado para ello. En el evento de que, conforme al dictamen que emita “BURS”, resulte procedente el cobro del monto respectivo, “EL ACREDITADO” deberá hacer el pago de la cantidad a su cargo, incluyendo los intereses ordinarios conforme a lo pactado, sin que proceda el cobro de intereses moratorios y otros accesorios generados por la suspensión del pago realizada en términos de esta cláusula;");
    doc.text("    (iii) Dentro del plazo de 45 (cuarenta y cinco) días naturales contado a partir de la entrega del dictamen a que se refiere la fracción anterior, “BURS” pondrá a disposición de “EL ACREDITADO” en la sucursal en la que radica la cuenta, o bien, en la Unidad Especializada de Atención a Usuarios (UNE), el expediente generado con motivo de la solicitud, así como a integrar en éste, bajo su más estricta responsabilidad, toda la documentación e información que, conforme a las disposiciones aplicables, deba obrar en su poder y que se relacione directamente con la solicitud de aclaración que corresponda y sin incluir datos correspondientes a operaciones relacionadas con terceras personas;");
    doc.text("    (iv) Hasta en tanto la solicitud de aclaración de que se trate no quede resuelta de conformidad con el procedimiento señalado en esta cláusula, “BURS” no reportará como vencidas las cantidades sujetas a dicha aclaración a las sociedades de información crediticia.");
    doc.text("Lo antes dispuesto es sin perjuicio del derecho de “EL ACREDITADO” de acudir ante la Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF) o ante la autoridad jurisdiccional correspondiente conforme a las disposiciones legales aplicables. Sin embargo, el procedimiento previsto en esta cláusula quedará sin efectos a partir de que “EL ACREDITADO” llegase a presentar su demanda ante autoridad jurisdiccional o conduzca su reclamación en términos y plazos de la Ley de Protección y Defensa al Usuario de Servicios Financieros.");
    doc.text("Para los efectos previstos en la presente Cláusula, se hace del conocimiento de “EL ACREDITADO” la información de contacto de su Unidad Especializada (UNE) y de la Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF):");
    doc.text("“EL ACREDITADO” podrá contactar a la Unidad Especializada de Atención a Usuarios (UNE) de “BURS” de la siguiente forma: a) En su domicilio ubicado en Av. Real Acueducto 300 int 902a, Col. Puerta de Hierro, Zapopan, Jalisco, México. C.P. 45116, b) a través de correo electrónico a la dirección: usuarios@burs.com.mx y c) al teléfono 800 030 0015.");
    doc.text("“EL ACREDITADO” podrá presentar su reclamación por medio de la Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF): 1. Teléfonos: en la Ciudad de México al 55 5340 0999, del interior de la república al 800 999 8080 2. Página de Internet www.condusef.gob.mx 3. Correo electrónico: asesoria@condusef.gob.mx");
    doc.moveDown();

    doc.font('Times-Roman').text("VIGÉSIMA NOVENA. - TÍTULO EJECUTIVO.");
    doc.text("El presente contrato junto con la certificación que realice el Contador de “BURS” respecto del estado que guarde el crédito, será título ejecutivo, de conformidad con el artículo 87-F de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, por lo que “BURS” estará facultado en caso de incumplimiento o vencimiento anticipado a demandar en la vía ejecutiva mercantil o por la vía judicial que más le convenga.");
    doc.moveDown();

    doc.font('Times-Roman').text("TRIGÉSIMA. - CONFIDENCIALIDAD.");
    doc.text("Toda la información y documentación relativa a las operaciones y servicios que realice “BURS” serán consideradas como confidenciales para la protección del derecho de privacidad de sus clientes, la cual solo podrá ser otorgada a “EL ACREDITADO”.");
    doc.moveDown();

    doc.font('Times-Roman').text("TRIGÉSIMA PRIMERA. - JURISDICCIÓN Y COMPETENCIA.");
    doc.text("Para todo lo relacionado con la interpretación y cumplimiento del presente contrato, las partes se someten a la jurisdicción y competencia de los Tribunales Judiciales competentes del Primer Partido Judicial del Estado de Jalisco con sede en la zona metropolitana de la ciudad de Zapopan, renunciando expresamente a cualquier otro fuero que pudiere corresponderles en virtud de sus domicilios presentes o futuros o por cualquier otra causa les pudiera corresponder.");
    doc.moveDown();

    doc.font('Times-Roman').text("TRIGÉSIMA SEGUNDA. - TÍTULOS DE LAS CLÁUSULAS.");
    doc.text("Las partes convienen en que los títulos de las cláusulas que aparecen en el presente contrato se han puesto con el exclusivo propósito de facilitar su lectura y por tanto no definen ni limitan el contenido de las mismas. Para efectos de interpretación del presente contrato, deberá atenderse exclusivamente al contenido de sus declaraciones y cláusulas y de ninguna manera a los títulos de estas últimas.");
    doc.moveDown();

    doc.text("Enterados del contenido y alcance jurídico de las obligaciones y derechos que contraen las partes contratantes con la celebración de este contrato de adhesión, “EL ACREDITADO” lo suscribe, manifestando que tiene conocimiento y comprende plenamente la obligación que adquiere, aceptando el monto del crédito que se le otorga, así como los cargos y gastos que se generen, o en su caso, se llegaran a generar por motivo de su suscripción, entendiendo también que no se efectuarán cargos o gastos distintos a los especificados, por lo que lo firman de conformidad en la ciudad de Zapopan, Jalisco el 6 de Octubre del 2023.");
    doc.moveDown();

    doc.text("De conformidad con lo establecido en el Artículo 5, fracción VIII, inciso a) de las Disposiciones de carácter general en materia de transparencia aplicables a las Sociedades Financieras de Objeto Múltiple, Entidades No Reguladas, al momento de la celebración del presente contrato “BURS” entrega, vía correo electrónico al registrado por “EL ACREDITADO” en su solicitud, copia fiel del presente contrato mismo con todos sus anexos, incluidas la carátula, autorización de cargo a cuenta bancaria y anexo de disposiciones legales, documentos que forman parte integrante del mismo.");
    doc.moveDown(2);

    // =========================================================================
    // FIRMA – SECCIÓN FINAL CON NOMBRE DINÁMICO
    // =========================================================================
    doc.text("Acepto de conformidad “EL ACREDITADO”", { underline: false });
    doc.moveDown(4);
    doc.text("________________________________________", { align: "center" });
    doc.text(nombre, { align: "center" });

    // =========================================================================
    // FINALIZACIÓN DEL PDF
    // =========================================================================
    doc.end();

    // Calcular hash del PDF a medida que se escribe
    doc.on('data', (chunk) => hash.update(chunk));

    pdfStream.on('finish', () => {
      const fileBuffer = fs.readFileSync(tempPdfPath);
      const fileHash = hash.digest('hex');
      fs.unlinkSync(tempPdfPath);
      resolve({ fileBuffer, fileHash });
    });

    pdfStream.on('error', (error) => reject(error));
  });
}

module.exports = {
  generatePDF
};
