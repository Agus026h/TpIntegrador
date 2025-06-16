# TpIntegrador
  ------Descripcion del proyecto
  Este proyecto se trata sobre la administracion y gestion de un sistema hospitalario para el manejo de pacientes, de momento dispone de la parte de administracion y recepcion de pacientes, a futuro se le iran agregando funcionalidades.



  -------Tecnologias utlizadas------
  en este proyecto se utilizo:
  node.js,
  sequalize,
  pug,
  express.js,
  dotenv,

  para base de datos se uso MySQL y PostgreSQL en Railway

  

  ------------base de datos----------
  Para la ejecucion local se le proporciona el scrip de la base de datos con las tablas y con algunos datos cargados para poder probar el proyecto, las tablas utilizadas son para la primera entrega, se añadiran mas a futuro

  descarge xamp y cree la base de datos del hospital, utilize la base que esta en base.sql(ya tiene la sentencia create database).

  cree y modifique el .env con los valores de entorno de su computadora el .env usado en esta computadora fue este:

  DB_DATABASE=hospital2
  DB_USER=root
  DB_PASSWORD=
  DB_HOST=localhost
  DB_PORT=3306

  
-------------como ejecutar el proyecto---------------
1- clonar el repositorio de github, https://github.com/Agus026h/TpIntegrador


2- instalar las dependencias con npm install

3-  crear y/o modificar la base de datos(este proyecto esta pensado para ejecutarse con Postgres o con xampp)


4- iniciar escribiendo en la terminal node app.js


5- el endpoint de inicio es http://localhost:3000/ si estamos en local y en despliege es https://tpintegrador-production.up.railway.app/

