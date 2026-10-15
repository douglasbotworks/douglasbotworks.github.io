import {AREAS, WITNESSES, EVIDENCE, initialState, objective, reduce, serializeCheckpoint, restoreCheckpoint} from './model.js';
let state = initialState();
let checkpointRevision = 0;
let checkpointPending = false;
let cancelCheckpointRead;
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
    cancelCheckpointRead?.();
    get('cancel-load').hidden = true;
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
  let url;
  let link;
  try {
    url = URL.createObjectURL(new Blob([serializeCheckpoint(state)], {type: 'application/json'}));
    link = document.createElement('a');
    link.href = url; link.download = 'whispering-evidence-checkpoint.json';
    document.body.append(link); link.click();
    get('checkpoint-status').textContent = 'Checkpoint download requested. Check that your browser saved the JSON file before leaving; this page cannot confirm it was saved.';
  } catch {
    get('checkpoint-status').textContent = 'Checkpoint download could not be requested. Your investigation is unchanged. Try Download checkpoint again before leaving.';
  } finally {
    link?.remove();
    if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});
function cancelLoad() {
  if (!checkpointPending) return;
  checkpointRevision++;
  checkpointPending = false;
  cancelCheckpointRead?.();
  const hadFocus = document.activeElement === get('cancel-load');
  get('cancel-load').hidden = true;
  get('checkpoint-status').textContent = 'Checkpoint load cancelled. Your investigation is unchanged. Select a checkpoint to try again.';
  if (hadFocus) get('load-progress').focus();
}
get('cancel-load').addEventListener('click', cancelLoad);
get('load-progress').addEventListener('cancel', cancelLoad);
get('load-progress').addEventListener('change', async event => {
  const input = event.target;
  const file = input.files?.[0];
  if (!file) { cancelLoad(); return; }
  const revision = ++checkpointRevision;
  cancelCheckpointRead?.();
  input.value = '';
  checkpointPending = true;
  get('cancel-load').hidden = false;
  get('checkpoint-status').textContent = 'Reading checkpoint…';
  try {
    if (file.size > 4096) throw Error('Choose a checkpoint smaller than 4 KB.');
    const text = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(Error('The file read timed out. Select the checkpoint again to retry.')), 10000);
      cancelCheckpointRead = () => { clearTimeout(timer); reject(Error('Checkpoint load cancelled.')); };
      try {
        Promise.resolve(file.text()).then(resolve, () => reject(Error('The file could not be read. Select the checkpoint again to retry.'))).finally(() => clearTimeout(timer));
      } catch { clearTimeout(timer); reject(Error('The file could not be read. Select the checkpoint again to retry.')); }
    });
    const restored = restoreCheckpoint(text);
    if (revision !== checkpointRevision) return;
    checkpointPending = false;
    const wasCompleted = state.completed;
    const focused = document.activeElement;
    state = restored;
    render();
    if (focused?.closest('[hidden]')) input.focus();
    get('checkpoint-status').textContent = 'Checkpoint loaded. Your case notes and objective are restored.';
    if (state.completed && !wasCompleted && document.activeElement === input) get('ending-title').focus();
  } catch (error) {
    if (revision === checkpointRevision) {
      checkpointPending = false;
      get('checkpoint-status').textContent = 'Checkpoint not loaded: ' + error.message;
    }
  } finally {
    if (revision === checkpointRevision) {
      checkpointPending = false;
      cancelCheckpointRead = undefined;
      const hadFocus = document.activeElement === get('cancel-load');
      get('cancel-load').hidden = true;
      if (hadFocus) input.focus();
    }
  }
});
