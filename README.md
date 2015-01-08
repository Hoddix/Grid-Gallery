CONFIGURACION
==========
GP Grid Gallery
==========
Es una galería de imágenes inspirada en los álbumes de Google+.

Esta basada en JavaScript y desarrollada bajo el Framework jQuery en su versión 1.11.0. La galería es configurable y con posibilidad de cargar mas de una en el mismo documento o contenedor.

Propiedades
==========
La galería esta compuesta de:

Un contenedor, donde se colocaran las fotos.
Un panel, donde se imprimirá la foto seleccionada.
La posibilidad de asignar un margen de separación entre fotos.
La posibilidad de asignar margenes de separación entre la galería y el documento o contenedor.
Como se usa
Lo primero que hay que hacer es importar la librería jQuery:

<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>

Para cargar la galería, tenemos que indicar el contenedor donde queremos que esta se muestre y seguido hacemos referencia al plugin "galería", todo esto lo haremos de esta forma:

$('.album').galería();

Opciones configurables
==========
Podemos configurar algunos parámetros de la galería.

directory Directorio donde se alojan las fotos. Por defecto album
maxheight Alto máximo al que se mostraran las imágenes. Por defecto 240px
imgmargin Margen de separación entre fotos. Por defecto 1px
fade Animación fade en la primera carga de las imagenes. Por defecto true
margintop Margin top del contenedor que porta la galería. Por defecto 0px
marginright Margin right del contenedor que porta la galería. Por defecto 0px
marginbottom Margin bottom del contenedor que porta la galería. Por defecto 0px
marginleft Margin left del contenedor que porta la galería. Por defecto 0px
Los parámetros margintop, marginright, marginbottom y marginleft pueden ir en px o en %. El contra el parámetro imgmargin solo ha de ser un numero entero.

EJEMPLOS
==========
Uso simple de la galería
==========
La forma simple no lleva ningún parámetro.

<div class="album"></div>

$('.album').galeria();

Esta es la configuración básica, por lo que la galería se adapta al 100% del contenedor donde se carga. La altura de la galería dependerá del numero de fotos que esta contenga.

Uso de la galería con parámetros
==========
Directorio donde están las imágenes:

Indicamos el directorio donde están las imágenes mediante la variable directory y lo hacemos mediante un string. También puede ser una ruta determinada.

<div class="album"></div>

$('.album').galeria( { directory : 'mis_fotos' } );

Margen entre imágenes:
==========
Podemos determinar el margen de separación entre las fotos de la galería, indicaremos en la variable imgmargen el margen de separación con un numero entero (por razones estéticas se aconseja de 0 a 10).

<div class="album"></div>

$('.album').galeria( { imgmargin : 5 } );

Márgenes de la galería:
==========
Determinaremos los márgenes de la galería frente al contenedor donde esta colocada.

Esto se hace mediante las variables:
margintop
marginright
marginbottom
marginleft
Los valores han de ser en formato string e irán con la nomenclatura px o %, según como queramos determinar los márgenes.

<div class="album"></div>

$( '.album' ).galeria({ marginright:'75px', marginleft:'75px', margintop:'75px', marginbottom:'75px' });

Tamaño de las imagenes:
==========
En caso de tener un diseño repondivo, podemos hacer que el grid sea mas pequeño, basta con darle a las imagenes un tamaño maximo, lo cual genereara un grid mas pequeño, acorde con el dispositivo donde queramos mostralo.

El valor ha de ser en formato Integer.

<div class="album"></div>

$( '.album' ).galeria({ maxheight : 100 });

Configuraciones opcionales:
==========
Parámetros opcionales hacer mas atractiva nuestra galería:

fade
maxheight
Estos 2 parámetros son opcionales y no alteran de forma significativa el uso o funcionalidad de la galería.
