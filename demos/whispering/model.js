// A separate scripted vignette, inspired by the owner's RPG investigation route.
export const AREAS = Object.freeze({town: 'Town square', library: 'Library', school: 'School courtyard'});
export const WITNESSES = Object.freeze({town: 'Grace', library: 'Sarah', school: 'Elena'});
export const EVIDENCE = Object.freeze({
  photo: Object.freeze({title: 'Maya’s photograph', detail: 'A stone arch stands behind Maya. Grace says it was taken on the northern trail.'}),
  ledger: Object.freeze({title: 'The library ledger', detail: 'A local account describes whispers near the northern stone cave. Maya recently borrowed it.'}),
  note: Object.freeze({title: 'A teacher’s note', detail: 'Elena remembers Maya asking about a cave on the northern trail. She has not seen Maya since.'})
});
export const initialState = () => ({area: 'town', evidence: [], completed: false, message: 'Start with Grace in the town square. Ask what she can share about Maya.'});
export function objective(state) {
  if (state.completed) return 'Vignette complete. The larger mystery is unresolved.';
  if (!state.evidence.includes('photo')) return 'Ask Grace for Maya’s photograph.';
  if (!state.evidence.includes('ledger')) return 'Visit the library and ask Sarah about the photograph.';
  if (!state.evidence.includes('note')) return 'Visit the school courtyard and ask Elena about Maya.';
  return 'Return to the town square and connect the three clues.';
}
export function reduce(state, action) {
  if (action.type === 'reset') return initialState();
  if (action.type === 'travel') {
    if (!Object.hasOwn(AREAS, action.area)) return state;
    return {...state, area: action.area, message: `You arrive at the ${AREAS[action.area].toLowerCase()}. ${WITNESSES[action.area]} is here.`};
  }
  if (action.type === 'talk') return {...state, message: {
    town: 'Grace: “Maya liked the old paths. I wish I knew which one she took.”',
    library: 'Sarah: “A borrowed book can tell you where someone’s curiosity led.”',
    school: 'Elena: “An observation is a lead, Riley. It is not proof of guilt.”'
  }[state.area]};
  if (action.type === 'evidence') {
    const key = {town: 'photo', library: 'ledger', school: 'note'}[state.area];
    if (state.evidence.includes(key)) return {...state, message: `${WITNESSES[state.area]}: “You already have what I can share.”`};
    if (key === 'ledger' && !state.evidence.includes('photo')) return {...state, message: 'Sarah: “Bring something connected to Maya. Grace may have a photograph.”'};
    if (key === 'note' && !state.evidence.includes('ledger')) return {...state, message: 'Elena: “Speak with the librarian first. A trail name will help me remember.”'};
    return {...state, evidence: [...state.evidence, key], message: `${WITNESSES[state.area]} shares ${EVIDENCE[key].title.toLowerCase()}. Read it in your case notes.`};
  }
  if (action.type === 'conclude') {
    if (state.area !== 'town' || state.evidence.length !== 3) return {...state, message: 'Gather all three clues, then return to the town square to connect them.'};
    if (action.choice !== 'cave') return {...state, message: 'That conclusion goes beyond the evidence. Look for the place mentioned in all three clues.'};
    return {...state, completed: true, message: 'A shared lead: the northern stone cave. You have a place to investigate, not an answer to Maya’s disappearance. This short vignette ends here.'};
  }
  return state;
}
