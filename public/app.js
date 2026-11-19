const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation?.addEventListener('click', event => {
  if (event.target.closest('a')) { navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.focus();
  }
});
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const workflows = {
  anfragen: { description:'Eine neue Projektanfrage kommt an.', steps:[['Anfrage erkennen','Nachricht im Posteingang'],['Inhalt strukturieren','Thema und Bedarf zusammenfassen'],['Antwort vorbereiten','Ein Mensch prüft und gibt frei']], result:'Sortiert und vorbereitet. Jetzt prüft ein Mensch.' },
  website: { description:'Eine freigegebene Website-Änderung wird veröffentlicht.', steps:[['Änderung übernehmen','Freigegebener Stand aus GitHub'],['Website prüfen','Build und Qualitätschecks ausführen'],['Version veröffentlichen','Geprüfte Dateien auf Cloudflare bereitstellen']], result:'Geprüft und veröffentlicht — so könnte euer Ablauf aussehen.' },
  wissen: { description:'Eine wiederkehrende Frage soll schneller beantwortet werden.', steps:[['Frage verstehen','Thema der Frage erfassen'],['Wissen finden','Passende freigegebene Quellen suchen'],['Entwurf mit Quellen prüfen','Ein Mensch kontrolliert die Antwort']], result:'Quellen und Entwurf liegen zur menschlichen Prüfung bereit.' }
};
const tabs = [...document.querySelectorAll('[data-demo]')];
const steps = [...document.querySelectorAll('.demo-steps li')];
const runButton = document.querySelector('#run-demo');
const demoStatus = document.querySelector('#demo-status');
let activeWorkflow = 'anfragen';
let runId = 0;
function selectWorkflow(tab) {
  runId++;
  activeWorkflow = tab.dataset.demo;
  tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
  document.querySelector('#demo-panel').setAttribute('aria-labelledby', tab.id);
  const workflow = workflows[activeWorkflow];
  document.querySelector('#demo-description').textContent = workflow.description;
  steps.forEach((step, index) => {
    step.className = '';
    step.querySelector('strong').textContent = workflow.steps[index][0];
    step.querySelector('div > span').textContent = workflow.steps[index][1];
    step.querySelector('.step-state').textContent = 'Bereit';
  });
  runButton.disabled = false; runButton.textContent = 'Ablauf starten';
  demoStatus.textContent = 'Bereit für einen Probelauf.';
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectWorkflow(tab));
  tab.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = tabs.length - 1;
    if (target !== undefined) { event.preventDefault(); selectWorkflow(tabs[target]); tabs[target].focus(); }
  });
});
runButton?.addEventListener('click', async () => {
  const currentRun = ++runId;
  const workflow = workflows[activeWorkflow];
  runButton.disabled = true;
  runButton.textContent = 'Läuft …';
  steps.forEach(step => { step.className = ''; step.querySelector('.step-state').textContent = 'Wartet'; });
  for (let index = 0; index < steps.length; index++) {
    if (currentRun !== runId) return;
    steps[index].className = 'active'; steps[index].querySelector('.step-state').textContent = 'Läuft';
    demoStatus.textContent = workflow.steps[index][0] + ' …';
    await new Promise(resolve => setTimeout(resolve, 700));
    if (currentRun !== runId) return;
    steps[index].className = 'done'; steps[index].querySelector('.step-state').textContent = 'Erledigt';
  }
  demoStatus.textContent = workflow.result;
  runButton.disabled = false; runButton.textContent = 'Noch einmal';
});

document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  const choice = [...document.querySelectorAll('[name=service]')].find(input => input.value === link.dataset.service);
  if (choice) { choice.checked = true; choice.dispatchEvent(new Event('input', { bubbles:true })); }
}));
let currentBrief = '';
const briefResult = document.querySelector('#brief-result');
document.querySelector('#project-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const goal = String(data.get('goal') || '').trim();
  if (!goal) { document.querySelector('#project-goal').setCustomValidity('Bitte beschreibt eure Idee in ein paar Worten.'); document.querySelector('#project-goal').reportValidity(); return; }
  currentBrief = `PROJEKTBRIEF FÜR OBERSTEN OHG\n\nThema: ${data.get('service')}\nStart: ${data.get('timing')}\n\nUnsere Idee / unser Ziel:\n${goal}\n\nIm Gespräch klären:\n- Gewünschter Umfang und vorhandene Systeme\n- Budget und Zeitrahmen\n- Datenverarbeitung und laufender Betrieb\n\nLokal erstellt. Noch nicht versendet.`;
  document.querySelector('#brief-text').textContent = currentBrief;
  briefResult.hidden = false;
  document.querySelector('#brief-status').textContent = 'Der Brief ist vorbereitet und wurde nicht versendet.';
  document.querySelector('#copy-brief').textContent = 'Kopieren';
  document.querySelector('#download-brief').focus({ preventScroll:true });
  briefResult.scrollIntoView({ behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'nearest' });
});
document.querySelector('#project-goal')?.addEventListener('input', event => event.target.setCustomValidity(''));
document.querySelector('#project-form')?.addEventListener('input', () => { if (briefResult) briefResult.hidden = true; currentBrief = ''; });
document.querySelector('#download-brief')?.addEventListener('click', () => {
  if (!currentBrief) return;
  const url = URL.createObjectURL(new Blob([currentBrief], { type:'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'obersten-projektbrief.txt';
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
  document.querySelector('#brief-status').textContent = 'Der Download wurde gestartet. Es wurde nichts versendet.';
});
document.querySelector('#copy-brief')?.addEventListener('click', async () => {
  if (!currentBrief) return;
  try { await navigator.clipboard.writeText(currentBrief); document.querySelector('#brief-status').textContent = 'Projektbrief in die Zwischenablage kopiert.'; document.querySelector('#copy-brief').textContent = 'Kopiert'; }
  catch { document.querySelector('#brief-status').textContent = 'Kopieren ist hier nicht verfügbar. Bitte den Text herunterladen oder markieren und kopieren.'; }
});
const dialog = document.querySelector('#legal-dialog');
document.querySelectorAll('[data-legal]').forEach(button => button.addEventListener('click', () => {
  const imprint = button.dataset.legal === 'impressum';
  document.querySelector('#legal-title').textContent = imprint ? 'Impressum vorbereiten' : 'Datenschutz vorbereiten';
  const content = document.querySelector('#legal-content'); content.replaceChildren();
  const paragraphs = imprint ? [
    'Dies ist eine private Website-Konzeptvorschau für Obersten OHG. Die vollständigen Unternehmensangaben wurden noch nicht übermittelt.',
    'Für die öffentliche Fassung fehlen insbesondere die bestätigte Geschäftsanschrift, vertretungsberechtigte Personen, geschäftliche Kontaktangaben und Registerangaben. Diese Vorschau ersetzt kein vollständiges Impressum.'
  ] : [
    'Die Projektbrief-Funktion und die Ablauf-Demo arbeiten lokal in eurem Browser. Sie übertragen keine Formulareingaben an Obersten OHG und verwenden weder Cookies noch Browser-Speicher.',
    'Für die öffentliche Fassung muss die Datenschutzerklärung passend zum tatsächlich gewählten Hosting, zu Kontaktwegen und zu etwaigen weiteren Diensten ergänzt werden. Der Hosting-Anbieter verarbeitet unabhängig vom Formular Verbindungsdaten. Diese Vorschau enthält noch keine vollständige Datenschutzerklärung.'
  ];
  for (const text of paragraphs) { const p = document.createElement('p'); p.textContent = text; content.append(p); }
  dialog.showModal();
}));
document.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog?.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
