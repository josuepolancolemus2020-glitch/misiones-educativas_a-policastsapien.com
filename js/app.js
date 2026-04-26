const missionsData = [
  // Español
  { id: 1, title: 'Adjetivos', subject: 'español', grade: 'II y III', url: '2y3ciclo-adjetivos/adjetivos-II-IIICiclo.html' },
  { id: 2, title: 'Verbos', subject: 'español', grade: 'II y III', url: '2y3ciclo-verbos/verbos-II-III-ciclo-basica.html' },
  { id: 3, title: 'Sustantivos', subject: 'español', grade: 'II y III', url: '2y3ciclo-sustantivos/sustantivos-II-III-ciclo-basica.html' },
  { id: 4, title: 'Pronombres', subject: 'español', grade: 'II y III', url: '2y3ciclo-pronombres/pronombres-II-III-ciclo-basica.html' },
  { id: 5, title: 'El Adjetivo Avanzado', subject: 'español', grade: 'Bach', url: 'bach-uni-adjetivos/adjetivos-avanzado.html' },
  
  // Math
  { id: 6, title: 'Números de Tres Cifras (2° Grado)', subject: 'matemáticas', grade: '2', url: '1ciclo-2º-grado/numeros-hasta-999.html' },
  { id: 7, title: 'Ángulos y bisectriz', subject: 'matemáticas', grade: 'II y III', url: '2y3ciclo-angulo-bisectriz/angulos-bisectriz_II y III-Ciclo_Básica.html' },
  { id: 8, title: 'Números Decimales', subject: 'matemáticas', grade: 'II y III', url: '2y3ciclo-numeros-decimales/2y3ciclo-numeros-decimales.html' },

  // Naturales
  { id: 9, title: 'Las Eras Geológicas', subject: 'ciencias naturales', grade: 'II y III', url: '2y3ciclo-eras-geológicas/eras_geológicas.html' },
  { id: 10, title: 'Áreas Protegidas de Honduras', subject: 'ciencias naturales', grade: 'II y III', url: '2y3ciclo-áreas-protegidas-de-honduras/2y3ciclo-áreas-protegidas-de-Honduras.html' },

  // Sociales
  { id: 11, title: 'Geografía y Coordenadas', subject: 'ciencias sociales', grade: 'II y III', url: '2y3ciclo-geografía-coordenadas/2y3ciclo_geografia-coordenadas.html' },
  { id: 12, title: 'Continentes: Europa, Asia y África', subject: 'ciencias sociales', grade: 'II y III', url: '2y3ciclo-los-Continentes-Europa-Asia-y-Africa/2y3ciclo_geografia-continentes-eas.html' },
  { id: 13, title: 'Continentes: América, Oceanía y Antártida', subject: 'ciencias sociales', grade: 'II y III', url: '2y3ciclo-los-continentes-América-Oceanía-Antártida/2y3ciclo-los-continentes-América-Oceanía-Antártida.html' },
];

let currentSubjectFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Logic
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Deactivate all
      navItems.forEach(n => n.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));

      // Activate clicked
      item.classList.add('active');
      const targetView = item.getAttribute('data-target');
      document.getElementById(targetView).classList.add('active');

      if(targetView === 'view-misiones') {
        renderMissions();
      }
    });
  });

  // Home Filters (Subject selection)
  const homeCards = document.querySelectorAll('.item-card');
  homeCards.forEach(card => {
    card.addEventListener('click', () => {
      // Simple routing: if an subject or grade is clicked, we switch to 'Misiones' tab and filter
      const subject = card.getAttribute('data-subject');
      if (subject) {
        currentSubjectFilter = subject;
        
        // Trigger tab switch to Misiones
        document.querySelector('.nav-item[data-target="view-misiones"]').click();
        
        // Also update filter tabs visually
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${subject}"]`);
        if (targetBtn) targetBtn.classList.add('active');
      }
    });
  });

  // Missions Tab Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSubjectFilter = btn.getAttribute('data-filter');
      renderMissions();
    });
  });

  // Notification
  document.querySelector('.notification-btn').addEventListener('click', () => {
    alert("¡No tienes notificaciones nuevas!");
  });
});

function renderMissions() {
  const container = document.getElementById('missions-container');
  container.innerHTML = '';

  const filtered = currentSubjectFilter === 'all' 
    ? missionsData 
    : missionsData.filter(m => m.subject === currentSubjectFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 40px; margin-bottom: 10px;">🚧</div>
        <h3>Próximamente</h3>
        <p>Aún no hay misiones disponibles para esta categoría.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(mission => {
    // Generate icons depending on subject for flair
    let icon = '📄';
    let iconClass = '';
    if (mission.subject === 'español') { icon = '📖'; iconClass = 'theme-green'; }
    if (mission.subject === 'matemáticas') { icon = '➗'; iconClass = 'theme-blue'; }
    if (mission.subject === 'ciencias naturales') { icon = '🌱'; iconClass = 'theme-green'; }
    if (mission.subject === 'ciencias sociales') { icon = '🌍'; iconClass = 'theme-orange'; }

    const item = document.createElement('a');
    item.className = `mission-item`;
    item.href = mission.url;
    item.innerHTML = `
      <div class="m-icon ${iconClass}">
        ${icon}
      </div>
      <div class="m-info">
        <h3>${mission.title}</h3>
        <p>Nivel: ${mission.grade}</p>
      </div>
      <div style="color: #ccc;">
        <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
      </div>
    `;
    container.appendChild(item);
  });
}
