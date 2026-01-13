# Ejemplo de Credenciales OCI

Este archivo muestra el formato exacto de las credenciales que necesitas para configurar el OCI Bucket Manager.

## Formato de Credenciales

### 1. Tenancy OCID
**Formato:** `ocid1.tenancy.oc1..aaaaaaaa...` (aproximadamente 90 caracteres)

**Ejemplo:**
```
ocid1.tenancy.oc1..aaaaaaaabbbbbbbccccccddddddeeeeeefffffff1111112222223333334444445555556
```

**Dónde encontrarlo:**
- Oracle Cloud Console → Administration → Tenancy Details
- O en la configuración de tu API key

---

### 2. User OCID
**Formato:** `ocid1.user.oc1..aaaaaaaa...` (aproximadamente 90 caracteres)

**Ejemplo:**
```
ocid1.user.oc1..aaaaaaaabbbbbbccccccddddddeeeeeefffff1111222233334444555566667777888899
```

**Dónde encontrarlo:**
- Oracle Cloud Console → User Settings → User Information
- O haz clic en tu perfil → User Settings

---

### 3. API Key Fingerprint
**Formato:** `xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx` (16 pares hexadecimales)

**Ejemplo:**
```
a1:b2:c3:d4:e5:f6:07:08:09:0a:1b:2c:3d:4e:5f:60
```

**Dónde encontrarlo:**
- Oracle Cloud Console → User Settings → API Keys
- Se muestra cuando generas una nueva API Key

---

### 4. Region
**Formato:** Identificador de región de Oracle Cloud

**Ejemplos comunes:**
```
us-ashburn-1
us-phoenix-1
eu-frankfurt-1
eu-amsterdam-1
uk-london-1
ap-tokyo-1
ap-mumbai-1
sa-saopaulo-1
```

**Dónde encontrarlo:**
- En la esquina superior derecha de Oracle Cloud Console
- O en la URL de la consola (ejemplo: console.us-ashburn-1.oraclecloud.com)

---

### 5. Compartment ID (Compartment OCID)
**Formato:** `ocid1.compartment.oc1..aaaaaaaa...` (aproximadamente 90 caracteres)

**Ejemplo:**
```
ocid1.compartment.oc1..aaaaaaaaxyzxyzxyzxyzxyzxyzxyzxyz123123123123123456456456456789789
```

**Dónde encontrarlo:**
- Oracle Cloud Console → Identity & Security → Compartments
- Haz clic en el compartment que deseas usar
- Copia el OCID

**Nota:** Puedes usar el compartment root (el mismo que tu Tenancy OCID) o crear uno específico.

---

### 6. Private Key (Clave Privada RSA)
**Formato:** Archivo PEM con clave privada RSA

**Ejemplo:**
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAyZKXJBmNzHKCMJq3jy9UZTQ1MjE4MTExNTM2WhcNMjgxMTE
wMTExNTM2WjAUMRIwEAYDVQQDDAlsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEBAQ
UAA4IBDwAwggEKAoIBAQDJkpckGY3McoIwmrePL1RlNDUyMTgxMTE1MzZaFw0yO
DEwMTExNTM2WjAUMRIwEAYDVQQDDAlsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEB
... (muchas más líneas) ...
9qZ3BhQU5CZ0txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF5WktY
SkJtTnpIS0NNSnEzank5VVpUUTFNakU0TVRFeE5UTTJXaGNOTWpneE1URXdNVEV
-----END RSA PRIVATE KEY-----
```

**Dónde encontrarlo:**
- Descárgalo cuando generas una API Key en Oracle Cloud Console
- Es el archivo `.pem` que descargas
- **IMPORTANTE:** Guarda este archivo de forma segura, no lo compartas

**Cómo obtenerlo:**
1. Abre el archivo `.pem` con un editor de texto
2. Copia TODO el contenido, incluyendo las líneas BEGIN y END
3. Pégalo en el campo de la aplicación

---

## Ejemplo Completo de Configuración

```json
{
  "tenancy": "ocid1.tenancy.oc1..aaaaaaaabbbbbbbccccccddddddeeeeeefffffff1111112222223333334444445555556",
  "user": "ocid1.user.oc1..aaaaaaaabbbbbbccccccddddddeeeeeefffff1111222233334444555566667777888899",
  "fingerprint": "a1:b2:c3:d4:e5:f6:07:08:09:0a:1b:2c:3d:4e:5f:60",
  "region": "us-ashburn-1",
  "compartmentId": "ocid1.compartment.oc1..aaaaaaaaxyzxyzxyzxyzxyzxyzxyzxyz123123123123123456456456456789789",
  "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----"
}
```

---

## Paso a Paso para Obtener Credenciales

### Opción 1: Generar Nueva API Key

1. Inicia sesión en Oracle Cloud Console
2. Haz clic en tu **icono de perfil** (esquina superior derecha)
3. Selecciona **"User Settings"**
4. En el menú izquierdo, selecciona **"API Keys"**
5. Haz clic en **"Add API Key"**
6. Selecciona **"Generate API Key Pair"**
7. Haz clic en **"Download Private Key"** y guárdalo
8. Haz clic en **"Add"**
9. Copia la configuración mostrada que incluye:
   - Tenancy
   - User
   - Fingerprint
   - Region

### Opción 2: Usar API Key Existente

Si ya tienes una API Key configurada:

1. Ve a User Settings → API Keys
2. Encuentra tu API Key (verás el fingerprint)
3. Copia el fingerprint
4. Usa la clave privada que descargaste anteriormente

---

## Verificación de Credenciales

Antes de usar las credenciales en la aplicación, verifica:

- [ ] Tenancy OCID empieza con `ocid1.tenancy.oc1..`
- [ ] User OCID empieza con `ocid1.user.oc1..`
- [ ] Fingerprint tiene 16 pares de caracteres separados por `:`
- [ ] Region es válida (ejemplo: `us-ashburn-1`)
- [ ] Compartment ID empieza con `ocid1.compartment.oc1..` o `ocid1.tenancy.oc1..`
- [ ] Private Key tiene las líneas BEGIN y END
- [ ] Private Key es el contenido completo del archivo .pem

---

## Problemas Comunes

### Fingerprint Inválido
- Asegúrate de que no haya espacios extras
- Debe tener exactamente 16 pares separados por dos puntos
- No debe tener saltos de línea

### Private Key Inválida
- Debe incluir `-----BEGIN RSA PRIVATE KEY-----`
- Debe incluir `-----END RSA PRIVATE KEY-----`
- No debe tener espacios al inicio de las líneas
- Los saltos de línea deben ser `\n` cuando se envía por API

### Unauthorized Error
- Verifica que el fingerprint corresponda a la private key
- Confirma que la API Key esté activa en la consola
- Asegúrate de que el User OCID sea correcto

---

## Seguridad

⚠️ **IMPORTANTE:**
- NUNCA compartas tu Private Key
- NUNCA subas la Private Key a GitHub u otros repositorios
- Guarda la Private Key en un lugar seguro
- Rota (regenera) tus API Keys periódicamente
- Si crees que tu clave fue comprometida, elimínala inmediatamente de OCI

---

## Recursos Útiles

- [Documentación Oficial OCI API Keys](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)
- [Console de Oracle Cloud](https://cloud.oracle.com)
- [Regiones de OCI](https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm)
