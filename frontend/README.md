# Frontend Spring JWT

Cliente Angular 22 para el backend Spring Boot ubicado en `../backend`.

## Ejecución

1. Levantar el backend en `http://localhost:8080`:

```bash
cd ../backend
mvnw spring-boot:run
```

2. Instalar dependencias y levantar el frontend:

```bash
npm install
npm start
```

3. Abrir `http://localhost:4200/`.

Las peticiones a `/auth` y `/user` se redirigen al backend mediante `proxy.conf.json`, por lo que no es necesario configurar CORS en Spring.

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | 1234567890 | ADMIN |
| normaluser | 1234567890 | USER |

## Estructura

```
src/app
├── component      componentes (html, css, ts, spec.ts)
├── models         interfaces y tipos
├── services       comunicación con el backend
└── utils          utilidades
```

## Pruebas

```bash
npm test
```
