const generateXML = (full_name, personalData) => {
    const nombre = full_name;
    const correo = personalData.correo;
    const telefono = personalData.telefono;

    const xmlContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<requisition>
    <contractName>Contrato BURS Prueba</contractName>
    <acceptanceLegend>Yo ${nombre} acepto la firma del documento Contrato BURS Prueba, hoy ${new Date().toLocaleDateString()}.</acceptanceLegend>
    <acceptanceVideoNotRequired>true</acceptanceVideoNotRequired>
    <validity>10</validity>
    <idDocument>5501-0001</idDocument>
    <contractType>Contrato</contractType>
    <signOnWeb>true</signOnWeb>
    <certificate>
        <page>1</page>
        <positionX1>8.48066</positionX1>
        <positionX2>88.48066</positionX2>
        <positionY1>78.4089</positionY1>
        <positionY2>90.53880000000001</positionY2>
    </certificate>
    <signers>
        <signerName>${nombre}</signerName>
        <mail>${correo}</mail>
        <phone>${telefono}</phone>
        <authenticationType>Código de Seguridad</authenticationType>
        <authenticationData>1234</authenticationData>
        <order>1</order>
        <signatures>
            <centerX>50</centerX>
            <centerY>65</centerY>
            <page>1</page>
            <positionX1>38</positionX1>
            <positionX2>63</positionX2>
            <positionY1>32</positionY1>
            <positionY2>42</positionY2>
            <signerType>Firmante</signerType>
            <optional>false</optional>
        </signatures>
    </signers>
</requisition>`;

    return Buffer.from(xmlContent);
};

module.exports = {
    generateXML
};
