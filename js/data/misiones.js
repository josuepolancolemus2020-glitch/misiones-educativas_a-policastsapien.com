/* Rutas de aprendizaje: el alumno navega por rutas secuenciales (etapas),
   nunca por ciclos/grados. El ciclo (campo grade/cycle) se conserva SOLO
   como metadato docente (Registro Docente, manuales, mapeo DCNB). */
const RUTAS = {
  numero:  { nombre: 'Ruta del Número',   emoji: '🧭', color: 'mat'  },
  forma:   { nombre: 'Ruta de la Forma',  emoji: '📐', color: 'mat'  },
  palabra: { nombre: 'Ruta de la Palabra', emoji: '✍️', color: 'esp'  },
  planeta: { nombre: 'Ruta del Planeta',  emoji: '🌎', color: 'csoc' },
  cuerpo:  { nombre: 'Ruta del Cuerpo',   emoji: '🧠', color: 'cnat' },
  vida:    { nombre: 'Ruta de la Vida',   emoji: '🌱', color: 'cnat' },
  materia: { nombre: 'Ruta de la Materia', emoji: '⚡', color: 'cnat' },
  tiempo:  { nombre: 'Ruta del Tiempo',   emoji: '🏛️', color: 'csoc' },
  codigo:  { nombre: 'Ruta del Código',   emoji: '💻', color: 'tec'  },
  robots:  { nombre: 'Ruta de los Robots', emoji: '🤖', color: 'tec'  },
};

const MISSIONS = [
  { id:  1, title: 'Los Adjetivos',                             subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'palabra', etapa: 2, xp: 25, icon: '📝', pais: 'HN', url: 'misiones/2y3ciclo-adjetivos/adjetivos-II-IIICiclo.html' },
  { id:  2, title: 'Los Verbos',                                subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'palabra', etapa: 3, xp: 25, icon: '✍️', pais: 'HN', url: 'misiones/2y3ciclo-verbos/verbos-II-III-ciclo-basica.html' },
  { id:  3, title: 'Los Sustantivos',                           subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'palabra', etapa: 1, xp: 25, icon: '📖', pais: 'HN', url: 'misiones/2y3ciclo-sustantivos/sustantivos-II-III-ciclo-basica.html' },
  { id:  4, title: 'Los Pronombres',                            subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'palabra', etapa: 5, xp: 25, icon: '💬', pais: 'HN', url: 'misiones/2y3ciclo-pronombres/pronombres-II-III-ciclo-basica.html' },
  { id:  5, title: 'El Adjetivo Avanzado',                      subject: 'español',     color: 'bach', grade: 'Bachillerato',   cycle: 'bach',     ruta: 'palabra', etapa: 9, xp: 40, icon: '🎓', pais: 'HN', url: 'misiones/bach-uni-adjetivos/adjetivos-avanzado.html' },
  { id:  6, title: 'Números Grandes: del Cien al Millón',       subject: 'matemáticas', color: 'mat',  grade: 'I y II Ciclo',   cycle: '1ciclo',   ruta: 'numero',  etapa: 0, xp: 30, icon: '🔢', pais: 'HN', url: 'misiones/1ciclo-segundo-grado/numeros-hasta-999.html' },
  { id:  7, title: 'Ángulos y Bisectriz',                       subject: 'matemáticas', color: 'mat',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'forma',   etapa: 1, xp: 30, icon: '📐', pais: 'HN', url: 'misiones/2y3ciclo-angulo-bisectriz/angulos-bisectriz_II y III-Ciclo_Básica.html' },
  { id:  8, title: 'Números Decimales',                         subject: 'matemáticas', color: 'mat',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'numero',  etapa: 7, xp: 25, icon: '🔢', pais: 'HN', url: 'misiones/2y3ciclo-numeros-decimales/2y3ciclo-numeros-decimales.html' },
  { id: 15, title: 'División de Decimales',                     subject: 'matemáticas', color: 'mat',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'numero',  etapa: 8, xp: 30, icon: '➗', pais: 'HN', url: 'misiones/2y3ciclo-division-decimales/division-decimales.html' },
  { id: 16, title: 'Área de Círculos y Polígonos',             subject: 'matemáticas', color: 'mat',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'forma',   etapa: 2, xp: 30, icon: '⭕', pais: 'HN', url: 'misiones/mat-2y3ciclo-area-circulo-y-poligonos-regulares/circulos-poligonos.html' },
  { id:  9, title: 'Las Eras Geológicas',                       subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'planeta', etapa: 5, xp: 35, icon: '🦕', pais: 'HN', url: 'misiones/2y3ciclo-eras-geologicas/eras_geologicas.html' },
  { id: 10, title: 'Áreas Protegidas de Honduras',              subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'planeta', etapa: 6, xp: 30, icon: '🌿', pais: 'HN', url: 'misiones/2y3ciclo-areas-protegidas-de-honduras/2y3ciclo-areas-protegidas-de-honduras.html' },
  { id: 14, title: 'El Sistema Nervioso',                        subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'cuerpo',  etapa: 1, xp: 35, icon: '🧠', pais: 'HN', url: 'misiones/2y3ciclo-sistema-nervioso/sistema-nervioso.html' },
  { id: 19, title: 'El Sistema Endocrino',                       subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'cuerpo',  etapa: 2, xp: 35, icon: '⚗️', pais: 'HN', url: 'misiones/2y3ciclo-sistema-endocrino/sistema-endocrino.html' },
  { id: 20, title: 'Desastres Naturales y el Huracán Mitch',     subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'planeta', etapa: 4, xp: 35, icon: '🌀', pais: 'HN', url: 'misiones/2y3ciclo-desastres-naturales/desastres-naturales.html' },
  { id: 11, title: 'Geografía y Coordenadas',                   subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'planeta', etapa: 1, xp: 25, icon: '🗺️', pais: 'HN', url: 'misiones/2y3ciclo-geografia-coordenadas/2y3ciclo_geografia-coordenadas.html' },
  { id: 12, title: 'Continentes: Europa, Asia y África',        subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'planeta', etapa: 3, xp: 30, icon: '🌍', pais: 'HN', url: 'misiones/2y3ciclo-los-Continentes-Europa-Asia-y-Africa/2y3ciclo_geografia-continentes-eas.html' },
  { id: 13, title: 'Continentes: América, Oceanía y Antártida', subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'planeta', etapa: 2, xp: 30, icon: '🌎', pais: 'HN', url: 'misiones/2y3ciclo-los-continentes-america-oceania-antartida/2y3ciclo-los-continentes-america-oceania-antartida.html' },
  { id: 17, title: 'Los Adverbios',                            subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'palabra', etapa: 4, xp: 25, icon: '🧭', pais: 'HN', url: 'misiones/2y3ciclo-adverbios/adverbios-II-III-ciclo-basica.html' },
  { id: 18, title: 'La Acentuación',                           subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'palabra', etapa: 6, xp: 35, icon: '🔤', pais: 'HN', url: 'misiones/2y3ciclo-acentuacion/acentuacion-II-III-ciclo-basica.html' },
  { id: 21, title: 'Los Tipos de Textos',                      subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'palabra', etapa: 8, xp: 30, icon: '📚', pais: 'HN', url: 'misiones/2y3ciclo-tipos-de-textos/tipos-de-textos.html' },
  { id: 22, title: 'Marcadores Textuales',                     subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'palabra', etapa: 7, xp: 30, icon: '🔗', pais: 'HN', url: 'misiones/2y3ciclo-marcadores-textuales/marcadores-textuales.html' },
  { id: 23, title: 'Las Fracciones',                           subject: 'matemáticas', color: 'mat',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'numero',  etapa: 6, xp: 30, icon: '🍕', pais: 'HN', url: 'misiones/2y3ciclo-fracciones/fracciones.html' },
  { id: 24, title: 'Valor Posicional hasta el Millón',         subject: 'matemáticas', color: 'mat',  grade: 'II Ciclo',       cycle: '2ciclo',   ruta: 'numero',  etapa: 1, xp: 30, icon: '🔢', pais: 'HN', url: 'misiones/2ciclo-valor-posicional/valor-posicional.html' },
  { id: 25, title: 'Potencias y Raíces Cuadradas',              subject: 'matemáticas', color: 'mat',  grade: 'II Ciclo',       cycle: '2ciclo',   ruta: 'numero',  etapa: 5, xp: 30, icon: '🔲', pais: 'HN', url: 'misiones/2ciclo-potencias-raices/potencias-raices.html' },
  { id: 26, title: 'Teoría de Números: Divisibilidad, m.c.m. y M.C.D.', subject: 'matemáticas', color: 'mat', grade: 'II Ciclo', cycle: '2ciclo', ruta: 'numero', etapa: 3, xp: 30, icon: '🕵️', pais: 'HN', url: 'misiones/2ciclo-teoria-numeros/teoria-numeros.html' },
  { id: 27, title: 'Recta Numérica, Suma y Resta',                       subject: 'matemáticas', color: 'mat',  grade: 'II Ciclo',       cycle: '2ciclo',   ruta: 'numero',  etapa: 2, xp: 30, icon: '📏', pais: 'HN', url: 'misiones/2ciclo-recta-numerica/recta-numerica.html' },
  { id: 28, title: 'Múltiplos, Divisores y Primos',                      subject: 'matemáticas', color: 'mat',  grade: 'II Ciclo',       cycle: '2ciclo',   ruta: 'numero',  etapa: 4, xp: 30, icon: '🧮', pais: 'HN', url: 'misiones/2ciclo-multiplos-divisores-primos/multiplos-divisores-primos.html' },
  { id: 29, title: 'Ángulos: Tipos y Transportador',                     subject: 'matemáticas', color: 'mat',  grade: 'II Ciclo',       cycle: '2ciclo',   ruta: 'forma',   etapa: 3, xp: 30, icon: '📐', pais: 'HN', url: 'misiones/2ciclo-angulos-basicos/angulos-basicos.html' },
  { id: 30, title: 'Multiplicación Vertical',                            subject: 'matemáticas', color: 'mat',  grade: 'II Ciclo',       cycle: '2ciclo',   ruta: 'numero',  etapa: 9, xp: 30, icon: '✖️', pais: 'HN', url: 'misiones/2ciclo-multiplicacion-vertical/multiplicacion-vertical.html' },
  { id: 31, title: 'Perímetro y Área de Cuadriláteros',                  subject: 'matemáticas', color: 'mat',  grade: 'II Ciclo',       cycle: '2ciclo',   ruta: 'forma',   etapa: 4, xp: 30, icon: '🔲', pais: 'HN', url: 'misiones/2ciclo-perimetro-cuadrilateros/perimetro-cuadrilateros.html' },
  { id: 32, title: 'Área de Polígonos Regulares',                        subject: 'matemáticas', color: 'mat',  grade: 'II Ciclo',       cycle: '2ciclo',   ruta: 'forma',   etapa: 5, xp: 30, icon: '🔷', pais: 'HN', url: 'misiones/2ciclo-area-poligonos-regulares/area-poligonos-regulares.html' },
  { id: 33, title: 'La Célula',                                          subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'vida',    etapa: 1, xp: 35, icon: '🔬', pais: 'HN', url: 'misiones/2y3ciclo-la-celula/la-celula.html' },
  { id: 34, title: 'Los Cinco Reinos',                                   subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'vida',    etapa: 2, xp: 35, icon: '🌳', pais: 'HN', url: 'misiones/2y3ciclo-cinco-reinos/cinco-reinos.html' },
  { id: 35, title: 'Los Ecosistemas',                                    subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'vida',    etapa: 3, xp: 35, icon: '🏞️', pais: 'HN', url: 'misiones/2y3ciclo-ecosistemas/ecosistemas.html' },
  { id: 36, title: 'El Sistema Digestivo',                               subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'cuerpo',  etapa: 3, xp: 35, icon: '🍎', pais: 'HN', url: 'misiones/2y3ciclo-sistema-digestivo/sistema-digestivo.html' },
  { id: 37, title: 'El Sistema Respiratorio y Circulatorio',             subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'cuerpo',  etapa: 4, xp: 35, icon: '🫁', pais: 'HN', url: 'misiones/2y3ciclo-respiratorio-circulatorio/respiratorio-circulatorio.html' },
  { id: 38, title: 'La Reproducción y el Desarrollo Humano',              subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'cuerpo',  etapa: 5, xp: 35, icon: '👶', pais: 'HN', url: 'misiones/2y3ciclo-reproduccion-desarrollo/reproduccion-desarrollo.html' },
  { id: 39, title: 'El Universo y el Sistema Solar',                      subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'planeta', etapa: 7, xp: 35, icon: '🪐', pais: 'HN', url: 'misiones/2y3ciclo-universo-sistema-solar/universo-sistema-solar.html' },
  { id: 40, title: 'La Materia',                                          subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'materia', etapa: 1, xp: 35, icon: '🧪', pais: 'HN', url: 'misiones/2y3ciclo-la-materia/la-materia.html' },
  { id: 41, title: 'La Energía',                                          subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'materia', etapa: 2, xp: 35, icon: '⚡', pais: 'HN', url: 'misiones/2y3ciclo-la-energia/la-energia.html' },
  { id: 42, title: 'Geografía de Honduras',                               subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'planeta', etapa: 8, xp: 35, icon: '🇭🇳', pais: 'HN', url: 'misiones/2y3ciclo-geografia-de-honduras/geografia-de-honduras.html' },
  { id: 43, title: 'Los Mayas y las Culturas Precolombinas',              subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'tiempo',  etapa: 1, xp: 35, icon: '🗿', pais: 'HN', url: 'misiones/2y3ciclo-mayas-precolombinas/mayas-precolombinas.html' },
  { id: 44, title: 'Secuencias: el Robot Mensajero',                      subject: 'programación', color: 'tec', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'codigo',  etapa: 2, xp: 35, icon: '💻', pais: 'HN', url: 'misiones/2y3ciclo-robot-mensajero/robot-mensajero.html' },
  { id: 46, title: 'El Pensamiento Computacional',                        subject: 'programación', color: 'tec', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'codigo',  etapa: 1, xp: 35, icon: '🧩', pais: 'HN', url: 'misiones/2y3ciclo-pensamiento-computacional/pensamiento-computacional.html' },
  { id: 48, title: 'Bucles: Repetir sin Cansarse',                        subject: 'programación', color: 'tec', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'codigo',  etapa: 4, xp: 35, icon: '🔁', pais: 'HN', url: 'misiones/2y3ciclo-bucles-repetir/bucles-repetir.html' },
  { id: 49, title: 'Variables: las Cajitas de Memoria',                   subject: 'programación', color: 'tec', grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'codigo',  etapa: 5, xp: 35, icon: '📦', pais: 'HN', url: 'misiones/2y3ciclo-variables-cajitas/variables-cajitas.html' },
  { id: 45, title: '¿Qué es un Robot?',                                   subject: 'robótica',    color: 'tec',  grade: 'II y III Ciclo', cycle: '2y3ciclo', ruta: 'robots',  etapa: 1, xp: 35, icon: '🤖', pais: 'HN', url: 'misiones/2y3ciclo-que-es-un-robot/que-es-un-robot.html' },
];

/* Helpers de rutas (globales: index los usa en app.js) */
function rutaEtapas(rutaKey) {
  return MISSIONS.filter(m => m.ruta === rutaKey).sort((a, b) => a.etapa - b.etapa);
}
function rutaMaxEtapa(rutaKey) {
  return rutaEtapas(rutaKey).reduce((mx, m) => Math.max(mx, m.etapa), 0);
}
/* Etiqueta visible del alumno: "🧭 Ruta del Número · Etapa 4 de 8".
   La etapa 0 se muestra como "Punto de partida" (nunca "nivel bajo"). */
function rutaLabel(m) {
  const r = m && RUTAS[m.ruta];
  if (!r) return m ? m.grade : '';
  const etapaTxt = m.etapa === 0 ? 'Punto de partida' : `Etapa ${m.etapa} de ${rutaMaxEtapa(m.ruta)}`;
  return `${r.emoji} ${r.nombre} · ${etapaTxt}`;
}
