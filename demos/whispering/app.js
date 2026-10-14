import {AREAS, WITNESSES, EVIDENCE, initialState, objective, reduce} from './model.js';
let state = initialState();
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
