// Shared data for refugios used across listing and detail pages
export const refugios = [
  {
    id: 1,
    nombre: 'Refugio de Lizara',
    ubicacion: 'Valle de Aragüés del Puerto, Huesca',
    altitud: '1540m',
    capacidad: '8 personas',
    descripcion: 'Antigua cuadra de pastores transformada en un acogedor refugio. Rehabilitado con materiales reciclados, cuenta con chimenea, biblioteca y vistas espectaculares al valle. Brindado a colectivos de montañismo juvenil.',
    descripcionLarga: `Este refugio representa uno de nuestros proyectos más emblemáticos en el Valle de Aragüés del Puerto. Lo que antes era una antigua cuadra de pastores abandonada, hoy es un espacio acogedor que ha vuelto a la vida gracias al trabajo de nuestros voluntarios.

La rehabilitación se realizó durante el verano de 2023, con una inversión de aproximadamente 800€ en materiales reciclados y donados. El trabajo de albañilería, carpintería y decoración fue completamente voluntario, sumando más de 200 horas de esfuerzo colectivo.

El refugio destaca por su chimenea funcional construida con piedras del entorno, una biblioteca especializada en montañismo y literatura pirenaica, y una gran mesa comunitaria donde los excursionistas pueden compartir historias. También cuenta con un pequeño sistema de iluminación solar que permite su uso nocturno de forma sostenible.

Brindado especialmente a los colectivos de montañismo juvenil, este refugio se ha convertido en un punto de encuentro para nuevas generaciones de montañeros que aprenden el valor del respeto y el cuidado de estos espacios compartidos.`,
    brindadoA: 'Colectivos de montañismo juvenil y grupos de iniciación a la montaña. Este refugio está dedicado especialmente a quienes dan sus primeros pasos en el Pirineo y aprenden el valor del respeto por los espacios libres.',
    fecha: 'Abril 2023',
    imagenes: [
      { alt: 'Vista exterior del Refugio de Lizara', caption: 'Fachada principal del refugio' },
      { alt: 'Interior con chimenea', caption: 'Chimenea de piedra construida por voluntarios' },
      { alt: 'Biblioteca del refugio', caption: 'Biblioteca especializada en montaña' },
      { alt: 'Mesa comunitaria', caption: 'Espacio de encuentro para montañeros' },
    ],
  },
  {
    id: 2,
    nombre: 'Refugio de Estós',
    ubicacion: 'Valle de Benasque, Huesca',
    altitud: '1890m',
    capacidad: '10 personas',
    descripcion: 'Refugio histórico de piedra completamente renovado. Incluye zona de descanso amplia, cocina equipada con menaje básico y un panel de experiencias donde los visitantes dejan sus historias. Dedicado a la comunidad de senderistas.',
    descripcionLarga: `El Refugio de Estós es una construcción histórica de piedra que ha sido testigo del paso de generaciones de pastores y montañeros. Nuestra intervención buscó respetar al máximo su arquitectura original mientras lo dotábamos de las comodidades básicas necesarias.

La rehabilitación se completó en septiembre de 2023 con una inversión de 1.100€ y más de 300 horas de trabajo voluntario. Uno de los elementos más especiales es el "Panel de Experiencias", un gran tablón donde los visitantes pueden escribir y dejar mensajes, creando una memoria colectiva del refugio.

La cocina está equipada con menaje básico donado por familias locales, y cuenta con una pequeña despensa comunitaria donde los excursionistas pueden dejar alimentos no perecederos para otros. El botiquín completo fue donado por una farmacia de Benasque.

Las paredes del refugio muestran obras de arte local, pequeñas pinturas y grabados realizados por artistas pirenaicos que han querido contribuir al proyecto. Es un refugio que respira historia y comunidad en cada rincón.`,
    brindadoA: 'Comunidad de senderistas y amantes del valle de Benasque. Un espacio donde cada persona que pasa deja su huella en forma de experiencia compartida.',
    fecha: 'Septiembre 2023',
    imagenes: [
      { alt: 'Refugio de Estós desde el sendero', caption: 'Vista desde el valle de Benasque' },
      { alt: 'Panel de experiencias', caption: 'Mensajes de visitantes' },
      { alt: 'Cocina equipada', caption: 'Cocina con menaje comunitario' },
      { alt: 'Interior del refugio', caption: 'Zona de descanso' },
    ],
  },
  {
    id: 3,
    nombre: 'Refugio de Viados',
    ubicacion: 'Valle de Chistau, Huesca',
    altitud: '1650m',
    capacidad: '6 personas',
    descripcion: 'En proceso de rehabilitación. Esta antigua cabaña de pastores está siendo transformada con especial cuidado en mantener su arquitectura tradicional. Contará con la primera guitarra del proyecto grabada con la frase: "Que las vacas y la música no dejen de sonar en estos valles".',
    descripcionLarga: `El Refugio de Viados es nuestro proyecto en curso más emocionante. Esta antigua cabaña de pastores en el Valle de Chistau está siendo rehabilitada con un cuidado especial en preservar su arquitectura tradicional de piedra y madera.

El trabajo comenzó en octubre de 2024 y esperamos finalizarlo en primavera de 2025. La peculiaridad de este refugio es que será el primero en contar con una guitarra española grabada con la frase "Que las vacas y la música no dejen de sonar en estos valles", un homenaje a la cultura pastoril del Pirineo.

La chimenea de piedra original está siendo restaurada por un maestro albañil jubilado que trabaja como voluntario. Las vigas del techo, algunas centenarias, se están tratando y reforzando para garantizar décadas más de vida.

Este refugio será especial por su conexión con la tradición: queremos que sea un lugar donde se mantenga viva la memoria de los pastores que habitaron estos valles, combinando funcionalidad moderna con respeto absoluto por el patrimonio arquitectónico.`,
    brindadoA: 'En proceso de decisión. Estamos en conversaciones con asociaciones culturales del valle de Chistau para dedicar este refugio a la preservación de la cultura pastoril pirenaica.',
    fecha: 'En proceso',
    imagenes: [
      { alt: 'Refugio de Viados en obras', caption: 'Estado actual de la rehabilitación' },
      { alt: 'Chimenea en restauración', caption: 'Chimenea histórica siendo restaurada' },
      { alt: 'Vigas originales', caption: 'Estructura de madera centenaria' },
    ],
  },
  {
    id: 4,
    nombre: 'Refugio de Góriz Bajo',
    ubicacion: 'Parque Nacional de Ordesa, Huesca',
    altitud: '2100m',
    capacidad: '12 personas',
    descripcion: 'Uno de nuestros proyectos más emblemáticos. Este refugio de alta montaña ahora ofrece un espacio digno con literas restauradas, zona de cocina completa y un sistema de iluminación solar. La inversión fue de 1200€ en materiales donados y reciclados.',
    descripcionLarga: `El Refugio de Góriz Bajo, situado en el corazón del Parque Nacional de Ordesa y Monte Perdido, representa uno de nuestros mayores logros como proyecto. A 2100 metros de altitud, la logística de esta rehabilitación fue todo un desafío.

Finalizamos el proyecto en junio de 2024 tras un intenso mes de trabajo en condiciones de alta montaña. La inversión total fue de 1.200€, siendo uno de nuestros proyectos más costosos debido a la necesidad de transportar materiales a lomos de mula y la complejidad de trabajar a esa altitud.

El refugio cuenta con 12 literas completamente restauradas, muchas de ellas reconstruidas con madera reciclada de antiguos refugios guardados. El sistema de iluminación solar permite autonomía energética, y el extintor de seguridad garantiza la protección contra incendios.

La cocina está equipada con fogones de gas, menaje completo y una despensa donde los grupos pueden almacenar víveres. Las vistas desde el refugio al macizo del Monte Perdido son simplemente espectaculares.

Este refugio ha albergado ya a cientos de montañeros y se ha convertido en un punto de referencia para las rutas de alta montaña en Ordesa.`,
    brindadoA: 'Montañeros de alta montaña y grupos de alpinismo. Especialmente dedicado a quienes buscan alcanzar las cimas del Pirineo con respeto y humildad.',
    fecha: 'Junio 2024',
    imagenes: [
      { alt: 'Refugio de Góriz Bajo', caption: 'Vista exterior con Monte Perdido al fondo' },
      { alt: 'Literas restauradas', caption: 'Interior con capacidad para 12 personas' },
      { alt: 'Sistema solar', caption: 'Paneles solares para iluminación' },
      { alt: 'Zona de cocina', caption: 'Cocina equipada de alta montaña' },
    ],
  },
  {
    id: 5,
    nombre: 'Refugio de Bujaruelo',
    ubicacion: 'Valle de Bujaruelo, Huesca',
    altitud: '1340m',
    capacidad: '8 personas',
    descripcion: 'Refugio rehabilitado junto al río Ara. Destaca por su pequeña biblioteca especializada en flora y fauna del Pirineo, y por las pinturas murales que decoran sus paredes. Un lugar perfecto para familias y grupos educativos.',
    descripcionLarga: `El Refugio de Bujaruelo es sin duda uno de los más especiales por su ubicación privilegiada junto al río Ara, en uno de los valles más hermosos del Pirineo. Completado en octubre de 2023, este refugio se ha convertido en un espacio ideal para familias y grupos educativos.

La inversión total fue de 650€ y unas 180 horas de trabajo voluntario. Lo que más destaca de este refugio son las pinturas murales que decoran sus paredes interiores, realizadas por una artista local que quiso contribuir al proyecto. Los murales representan la flora y fauna característica del valle: quebrantahuesos, rebecos, marmotas, y flores endémicas del Pirineo.

La biblioteca temática es otro de los grandes atractivos. Contiene guías de naturaleza, libros sobre flora y fauna, cuadernos de identificación de aves y mamíferos, todo donado por naturalistas y biólogos que han trabajado en la zona.

La gran mesa para 10 personas facilita las actividades educativas, y varios colegios de la comarca ya han utilizado el refugio como base para sus salidas de educación ambiental.`,
    brindadoA: 'Familias, grupos educativos y amantes de la naturaleza. Un espacio para aprender y conectar con el entorno natural del Pirineo.',
    fecha: 'Octubre 2023',
    imagenes: [
      { alt: 'Refugio de Bujaruelo junto al río Ara', caption: 'Ubicación privilegiada junto al agua' },
      { alt: 'Murales de flora y fauna', caption: 'Arte dedicado a la naturaleza pirenaica' },
      { alt: 'Biblioteca temática', caption: 'Guías y libros sobre naturaleza' },
      { alt: 'Interior del refugio', caption: 'Espacio acogedor para familias' },
    ],
  },
  {
    id: 6,
    nombre: 'Refugio de Bachimaña',
    ubicacion: 'Valle de Tena, Huesca',
    altitud: '2200m',
    capacidad: '10 personas',
    descripcion: 'Próximo proyecto para 2025. Esta antigua construcción de piedra requerirá trabajo intensivo en el techo y la estructura. Será nuestro refugio más alto y servirá como punto de apoyo para rutas de alta montaña.',
    descripcionLarga: `El Refugio de Bachimaña será nuestro proyecto más ambicioso hasta la fecha. Situado a 2200 metros de altitud en el Valle de Tena, será el refugio más alto que hemos rehabilitado.

El proyecto está planificado para el verano de 2025. La estructura actual requiere trabajo intensivo, especialmente en el techo que ha sufrido daños por la nieve y las condiciones extremas de alta montaña. Estimamos una inversión de aproximadamente 2.000€ y al menos 400 horas de trabajo.

La logística será compleja: todo el material deberá subirse a pie o con ayuda de mulas, y trabajaremos en turnos de una semana con grupos de voluntarios especializados en construcción de montaña.

La ubicación es estratégica: el refugio servirá como punto de apoyo para múltiples rutas de alta montaña, incluidas ascensiones técnicas a varios tresmiles del Valle de Tena. Las vistas panorámicas desde el refugio serán probablemente las más espectaculares de todos nuestros proyectos.

Estamos buscando activamente patrocinadores y materiales donados para este proyecto. Si quieres colaborar, contacta con nosotros.`,
    brindadoA: 'Pendiente de decisión. Será dedicado a la comunidad de alpinistas y montañeros experimentados que frecuentan las rutas de alta montaña del Valle de Tena.',
    fecha: 'Planificado 2025',
    imagenes: [
      { alt: 'Refugio de Bachimaña estado actual', caption: 'Construcción original a restaurar' },
      { alt: 'Vista del Valle de Tena', caption: 'Ubicación privilegiada en alta montaña' },
    ],
  },
  {
    id: 7,
    nombre: 'Refugio de Pineta',
    ubicacion: 'Valle de Pineta, Huesca',
    altitud: '1280m',
    capacidad: '15 personas',
    descripcion: 'El refugio donde empezó todo. Nuestro primer proyecto en 2022. Completamente transformado de una cuadra abandonada a un espacio acogedor que ha inspirado a cientos de montañeros. Incluye todas nuestras señas de identidad: mesa, biblioteca, guitarra y panel de experiencias.',
    descripcionLarga: `El Refugio de Pineta tiene un significado muy especial para nosotros: fue nuestro primer proyecto, el que inició todo este movimiento de recuperación de refugios libres en el Pirineo.

En mayo de 2022, un grupo de amigos montañeros decidimos transformar una antigua cuadra abandonada en un espacio digno y acogedor. Con apenas 400€ en materiales reciclados y mucha ilusión, dedicamos tres semanas intensas de trabajo.

Este refugio estableció el ADN de todos nuestros proyectos posteriores: una gran mesa comunitaria donde compartir comidas y conversaciones, una biblioteca con libros donados, una guitarra para las noches de montaña, y un panel de experiencias donde los visitantes dejan sus mensajes.

Con capacidad para 15 personas, es nuestro refugio más grande. Se ha convertido en un lugar de peregrinación para montañeros que quieren conocer el origen del proyecto. En sus paredes hay fotos de los primeros trabajos de rehabilitación, y cada rincón cuenta una historia.

Más de 500 personas han pasado por aquí desde su inauguración, y muchas de ellas se han convertido en voluntarias activas del proyecto, participando en la rehabilitación de otros refugios.`,
    brindadoA: 'Todos los montañeros y amantes del Pirineo. Este refugio está dedicado a la comunidad que hizo posible el nacimiento de RefugiosLibresDignos.',
    fecha: 'Mayo 2022',
    imagenes: [
      { alt: 'Refugio de Pineta rehabilitado', caption: 'Donde todo comenzó en 2022' },
      { alt: 'Mesa comunitaria con guitarra', caption: 'El alma del refugio' },
      { alt: 'Panel de experiencias', caption: 'Historias de cientos de montañeros' },
      { alt: 'Biblioteca del refugio', caption: 'Primera biblioteca del proyecto' },
      { alt: 'Fotos históricas', caption: 'Imágenes de la primera rehabilitación' },
    ],
  },
  {
    id: 8,
    nombre: 'Refugio de Biadós',
    ubicacion: 'Valle de Bielsa, Huesca',
    altitud: '1580m',
    capacidad: '8 personas',
    descripcion: 'Actualmente en fase de acabados. Este refugio será especial por su chimenea de diseño único construida con piedras del entorno. Esperamos finalizarlo antes del verano 2025. Brindado a grupos de montañismo senior.',
    descripcionLarga: `El Refugio de Biadós está actualmente en su fase final de rehabilitación. Iniciamos los trabajos en septiembre de 2024 y esperamos inaugurarlo en junio de 2025, antes de la temporada alta de verano.

Este refugio será especialmente recordado por su chimenea de diseño único, construida enteramente con piedras del entorno por un maestro cantero jubilado que se unió como voluntario al proyecto. Cada piedra ha sido seleccionada y colocada a mano, creando una estructura que es tanto funcional como una obra de arte.

La ubicación en el Valle de Bielsa ofrece un acceso moderado, ideal para grupos senior que mantienen activa su pasión por la montaña pero prefieren rutas menos exigentes. La inversión estimada es de 900€ y llevamos acumuladas más de 250 horas de trabajo.

El refugio contará con 8 literas cómodas, iluminación solar, una cocina bien equipada y, por supuesto, la impresionante chimenea que será el corazón del espacio. Estamos trabajando también en un pequeño huerto de plantas aromáticas en el exterior.

Será dedicado especialmente a grupos de montañismo senior, esos montañeros experimentados que llevan décadas recorriendo el Pirineo y que tanto nos enseñan sobre el respeto y el conocimiento de la montaña.`,
    brindadoA: 'Grupos de montañismo senior y montañeros experimentados. Un homenaje a quienes llevan décadas cuidando y disfrutando de estos valles.',
    fecha: 'En proceso',
    imagenes: [
      { alt: 'Refugio de Biadós en obras', caption: 'Últimos trabajos de rehabilitación' },
      { alt: 'Chimenea en construcción', caption: 'Obra de arte en piedra del entorno' },
      { alt: 'Interior en acabados', caption: 'Zona de literas casi terminada' },
    ],
  },
  {
    id: 9,
    nombre: 'Refugio de Respomuso',
    ubicacion: 'Valle de Tena, Huesca',
    altitud: '2020m',
    capacidad: '12 personas',
    descripcion: 'Planificado para verano 2025. Será nuestro proyecto número 20. Esta estructura necesita rehabilitación completa pero tiene un potencial increíble por su ubicación cerca del embalse y las vistas al Balaitus.',
    descripcionLarga: `El Refugio de Respomuso representa un hito muy especial: será nuestro proyecto número 20. Planificado para el verano de 2025, esta rehabilitación completa requerirá el mayor esfuerzo colectivo que hayamos organizado hasta ahora.

La estructura actual necesita rehabilitación integral: techo, muros, suelo, todo debe ser reconstruido. Pero el potencial es extraordinario. La ubicación cerca del embalse de Respomuso y con vistas directas al imponente Balaitus lo convierten en un lugar excepcional.

Estimamos una inversión aproximada de 2.500€ y más de 500 horas de trabajo voluntario repartidas en varias fases durante el verano. Será necesario organizar múltiples turnos de voluntarios con diferentes especialidades: albañiles, carpinteros, fontaneros, electricistas...

El refugio tendrá capacidad para 12 personas y estamos planificando dotarlo de todas nuestras señas de identidad: mesa grande, biblioteca, guitarra, panel de experiencias, además de un sistema de recogida de agua de lluvia y paneles solares para autonomía energética.

Por ser el proyecto número 20, queremos hacer algo especial: crear un mural fotográfico con imágenes de todos los refugios rehabilitados hasta la fecha, una celebración visual de este movimiento que comenzó con un sueño y se ha convertido en realidad.`,
    brindadoA: 'En proceso de decisión. Estamos barajando dedicarlo a todos los voluntarios que han participado en los 20 proyectos, como homenaje al esfuerzo colectivo.',
    fecha: 'Planificado 2025',
    imagenes: [
      { alt: 'Refugio de Respomuso estado actual', caption: 'Estructura a rehabilitar completamente' },
      { alt: 'Embalse de Respomuso', caption: 'Ubicación excepcional junto al agua' },
      { alt: 'Vista del Balaitus', caption: 'Vistas impresionantes desde el refugio' },
    ],
  },
];
