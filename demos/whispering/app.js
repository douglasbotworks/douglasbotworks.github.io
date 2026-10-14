import {AREAS, WITNESSES, EVIDENCE, initialState, objective, reduce, serializeCheckpoint, restoreCheckpoint} from './model.js';
let state = initialState();
let checkpointRevision = 0;
let checkpointPending = false;
const get = id => document.getElementById(id);
function render() {
  get('scene-name').textContent = AREAS[state.area];
  get('witness').textContent = WITNESSES[state.area];
  get('dialogue').textContent = state.message;
  get('objective').textContent = objective(state);
  get('progress').textContent = `${state.evidence.length} / 3 clues`;
  get('world').dataset.area = state.area;
  const positions = {town: [245, 270], library: [130, 145], school: [455, 165]};
  get('riley').setAttribute('transform', `translate(${positions[state.area].join(' ')})`);
  for (const button of document.querySelectorAll('[data-travel]')) {
    button.setAttribute('aria-pressed', String(button.dataset.travel === state.area));
  }
  get('journal').replaceChildren();
  if (!state.evidence.length) {
    const empty = document.createElement('li'); empty.className = 'muted'; empty.textContent = 'Your notebook is empty. Start with a witness.'; get('journal').append(empty);
  }
  for (const key of state.evidence) {
    const item = document.createElement('li');
    const title = document.createElement('h3'); title.textContent = EVIDENCE[key].title;
    const detail = document.createElement('p'); detail.textContent = EVIDENCE[key].detail;
    item.append(title, detail); get('journal').append(item);
  }
  get('deduction').hidden = state.evidence.length !== 3 || state.area !== 'town' || state.completed;
  get('ending').hidden = !state.completed;
  get('ending-summary').textContent = 'The three witnesses point to the northern cave. Maya’s fate is still unknown. You have completed this original, scripted evidence walk; the full RPG campaign is separate and unfinished.';
}
function dispatch(action) {
  checkpointRevision++;
  if (checkpointPending) {
    checkpointPending = false;
    get('checkpoint-status').textContent = 'Checkpoint load cancelled because the investigation changed. Select the file again to load it.';
  }
  const wasCompleted = state.completed;
  state = reduce(state, action);
  render();
  if (state.completed && !wasCompleted) get('ending-title').focus();
}
for (const button of document.querySelectorAll('[data-travel]')) button.addEventListener('click', () => dispatch({type:'travel', area:button.dataset.travel}));
get('talk').addEventListener('click', () => dispatch({type:'talk'}));
get('ask-evidence').addEventListener('click', () => dispatch({type:'evidence'}));
for (const button of document.querySelectorAll('[data-conclusion]')) button.addEventListener('click', () => dispatch({type:'conclude', choice:button.dataset.conclusion}));
get('restart').addEventListener('click', () => {dispatch({type:'reset'});get('talk').focus();});
render();

get('save-progress').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([serializeCheckpoint(state)], {type: 'application/json'}));
  const link = document.createElement('a');
  link.href = url; link.download = 'whispering-evidence-checkpoint.json';
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  get('checkpoint-status').textContent = 'Checkpoint download requested. Keep the JSON file to resume later.';
});
get('load-progress').addEventListener('change', async event => {
  const input = event.target;
  const file = input.files?.[0];
  const revision = ++checkpointRevision;
  input.value = '';
  checkpointPending = false;
  if (!file) return;
  checkpointPending = true;
  get('checkpoint-status').textContent = 'Reading checkpoint…';
  try {
    if (file.size > 4096) throw Error('Choose a checkpoint smaller than 4 KB.');
    const restored = restoreCheckpoint(await file.text());
    if (revision !== checkpointRevision) return;
    checkpointPending = false;
    const wasCompleted = state.completed;
    state = restored;
    render();
    get('checkpoint-status').textContent = 'Checkpoint loaded. Your case notes and objective are restored.';
    if (state.completed && !wasCompleted) get('ending-title').focus();
  } catch (error) {
    if (revision === checkpointRevision) {
      checkpointPending = false;
      get('checkpoint-status').textContent = 'Checkpoint not loaded: ' + error.message;
    }
  }
});
