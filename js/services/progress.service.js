'use strict';

window.META_SERVICES = window.META_SERVICES || {};

// Progress service scaffold for future extraction from app.js.
window.META_SERVICES.progress = {
  calculateSubjectCompletion: function calculateSubjectCompletion(missions, visitedIds, subjectKey) {
    const total = missions.filter(m => m.subject === subjectKey).length;
    const done = missions.filter(m => m.subject === subjectKey && visitedIds.includes(m.id)).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }
};
