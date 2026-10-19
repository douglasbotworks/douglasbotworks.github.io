(() => {
  'use strict';
  const form = document.getElementById('brief-form');
  const preview = document.getElementById('preview');
  const status = document.getElementById('status');
  const copyStatus = document.getElementById('copy-status');
  const download = document.getElementById('download');
  const copy = document.getElementById('copy');
  const emailDraft = document.getElementById('email-draft');
  const scopes = {
    repair: 'Repair scope: one reproducible JavaScript or TypeScript defect, a bounded patch, passing checks and a handoff. Integration and acceptance must be agreed.',
    release: 'Release scope: one specified static build, inventory, literal local-reference checks and packaging if the agreed gate passes. Browser execution, deployment and security certification are excluded.'
  };
  // Only a single allowlisted offer may be imported; request text stays local.
  const offerParameters = new URLSearchParams(window.location.search).getAll('offer');
  const initialOffer = offerParameters.length === 1 && Object.hasOwn(scopes, offerParameters[0])
    ? offerParameters[0] : 'repair';
  for (const option of form.elements.offer.options) {
    option.defaultSelected = option.value === initialOffer;
  }
  form.elements.offer.value = initialOffer;
  const fields = [
    ['expected', 'Expected result'], ['actual', 'Current result'],
    ['steps', 'Minimal reproduction'], ['runtime', 'Runtime / files'],
    ['sample', 'Sanitized sample'], ['acceptance', 'Completion check'],
    ['boundaries', 'Included scope / exclusions'], ['delivery', 'Delivery / timeline for discussion']
  ];
  const repairLabels = fields.map(([, label]) => label);
  const releaseLabels = ['Review objective', 'Known concerns (optional)', 'Build preparation / safe access',
    'Build format / runtime', 'Sanitized reference examples', 'Review gate / completion check',
    'Included build / exclusions', 'Delivery / timeline for discussion'];
  const repairPrompts = fields.map(([key]) => document.querySelector(`label[for="${key}"]`).textContent);
  const releasePrompts = ['What should the static review check? (required)', 'Known concerns (optional)',
    'How is the sanitized build prepared, and how can access be agreed? (required)',
    'Build format, runtime versions and relevant files', 'Fictional reference examples (optional)',
    'Which review gate and outputs will show completion? (required)',
    'Included build and explicit exclusions', 'Preferred delivery format and timeline for discussion'];
  const repairPlaceholders = fields.map(([key]) => form.elements[key].placeholder);
  const releasePlaceholders = ['', 'Leave blank if no defect is known.',
    'For example: npm run build produces dist/. Agree authorized access after initial review; do not paste private links or credentials.',
    'For example: static HTML/CSS/JS build or MV3 extension; runtime and build command versions', '',
    'For example: inventory and local-reference report; package only if the agreed gate passes', '', ''];
  function updateOffer() {
    const release = form.elements.offer.value === 'release';
    fields.forEach(([key], index) => {
      document.querySelector(`label[for="${key}"]`).textContent = (release ? releasePrompts : repairPrompts)[index];
      form.elements[key].placeholder = (release ? releasePlaceholders : repairPlaceholders)[index];
    });
    form.elements.actual.required = !release;
  }
  let prepared = null;
  let revision = 0;
  let copyTimer;
  function invalidate() {
    clearTimeout(copyTimer);
    prepared = null;
    revision++;
    copy.disabled = true;
    download.disabled = true;
    emailDraft.hidden = true;
    emailDraft.removeAttribute('href');
    preview.textContent = 'Complete the required fields, then preview.';
    status.textContent = '';
    copyStatus.textContent = '';
    updateOffer();
    document.getElementById('offer-scope').textContent = scopes[form.elements.offer.value] || '';
  }
  form.addEventListener('input', invalidate);
  form.addEventListener('change', invalidate);
  form.addEventListener('reset', () => { invalidate(); queueMicrotask(invalidate); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    invalidate();
    const offer = form.elements.offer.value;
    if (!Object.hasOwn(scopes, offer)) {
      status.textContent = 'Choose one of the available services.';
      return;
    }
    const labels = offer === 'release' ? releaseLabels : repairLabels;
    const required = new Set(offer === 'release' ? ['expected', 'steps', 'acceptance'] : ['expected', 'actual', 'steps', 'acceptance']);
    const values = fields.map(([key], index) => [key, labels[index], form.elements[key].value.trim()]);
    for (const [key, label, value] of values) {
      if ((required.has(key) && !value) || value.length > 4000) {
        status.textContent = `${label}: enter ${required.has(key) ? '1–4000' : 'at most 4000'} characters.`;
        form.elements[key].focus();
        return;
      }
    }
    prepared = [
      'DOUGLAS BOT WORKS — REQUEST FOR SCOPE REVIEW',
      'Local worksheet only. No booking, contract, payment or submission.',
      `Offer: ${offer === 'repair' ? 'One JavaScript / TypeScript defect — proposed USD 150' : 'One static build release review — proposed USD 99'}`,
      scopes[offer],
      ...values.map(([, label, value]) => `${label}:\n${value || '(not supplied)'}`),
      'Before work: agree authorized source access, exact scope, acceptance, timeline, price and payment channel. Do not include credentials or personal customer records.'
    ].join('\n\n') + '\n';
    preview.textContent = prepared;
    download.disabled = false;
    copy.disabled = false;
    const subject = offer === 'repair' ? 'Software repair scope review' : 'Static release scope review';
    emailDraft.href = `mailto:douglasbotworks@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Hello Douglas, I would like a scope review. I will paste my prepared brief or attach my downloaded request brief before sending. Please confirm scope, price and payment arrangements before starting work.')}`;
    emailDraft.hidden = false;
    status.textContent = 'Brief prepared locally. Review it before downloading or sharing.';
  });
  copy.addEventListener('click', async () => {
    if (prepared === null) return;
    const currentRevision = revision;
    const text = prepared;
    copy.disabled = true;
    copyStatus.textContent = 'Copying prepared brief…';
    let expired = false;
    copyTimer = setTimeout(() => {
      expired = true;
      if (revision === currentRevision) {
        copy.disabled = false;
        copyStatus.textContent = 'Automatic copy has not finished. Copy the preview text manually or download the brief. The browser may still finish the earlier clipboard write; check pasted text before sharing. Nothing was sent.';
      }
    }, 10000);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      if (!expired && revision === currentRevision) {
        copyStatus.textContent = 'Brief copied. Review before sharing; email retrieval is unavailable. The GitHub inquiry is public: share a sanitized summary only, not private brief contents. Nothing was sent. Clear does not erase your clipboard.';
      }
    } catch {
      if (!expired && revision === currentRevision) {
        // Selection is a manual fallback; never claim a failed write copied text.
        const selection = window.getSelection();
        if (selection) {
          preview.focus();
          const range = document.createRange();
          range.selectNodeContents(preview);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        copyStatus.textContent = 'Automatic copy unavailable. Select the preview text and use your device’s Copy command, or download the brief. Nothing was sent.';
      }
    } finally {
      if (!expired && revision === currentRevision) {
        clearTimeout(copyTimer);
        copy.disabled = false;
      }
    }
  });
  download.addEventListener('click', () => {
    if (prepared === null) return;
    let url;
    try {
      url = URL.createObjectURL(new Blob([prepared], {type: 'text/plain;charset=utf-8'}));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'douglas-service-request.txt';
      document.body.append(link);
      try { link.click(); } finally { link.remove(); }
      status.textContent = 'Download requested. Nothing was sent. Check your downloaded file before sharing.';
    } catch {
      status.textContent = 'Download unavailable in this browser. Copy the preview text or use the plain-text worksheet.';
    } finally {
      if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  });
  const saveDraft = document.getElementById('save-draft');
  const openDraft = document.getElementById('open-draft');
  const draftStatus = document.getElementById('draft-status');
  let importRequest = 0;
  let importTimer;
  function forgetDraftNotice() {
    clearTimeout(importTimer);
    importRequest++;
    openDraft.value = '';
    draftStatus.textContent = '';
  }
  form.addEventListener('input', forgetDraftNotice);
  form.addEventListener('change', forgetDraftNotice);
  form.addEventListener('reset', forgetDraftNotice);
  form.addEventListener('submit', forgetDraftNotice);
  function exactKeys(value, keys) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      && Object.keys(value).length === keys.length
      && keys.every(key => Object.hasOwn(value, key));
  }
  function validDraft(value) {
    return exactKeys(value, ['format', 'version', 'offer', 'fields'])
      && value.format === 'douglas-service-draft' && value.version === 1
      && typeof value.offer === 'string' && Object.hasOwn(scopes, value.offer)
      && exactKeys(value.fields, fields.map(([key]) => key))
      && fields.every(([key]) => typeof value.fields[key] === 'string'
        && value.fields[key].length <= 4000);
  }
  saveDraft.addEventListener('click', () => {
    const draft = {format: 'douglas-service-draft', version: 1,
      offer: form.elements.offer.value, fields: {}};
    for (const [key] of fields) draft.fields[key] = form.elements[key].value;
    if (!validDraft(draft)) {
      draftStatus.textContent = 'Choose an available service and keep each field within 4000 characters before saving.';
      return;
    }
    let url;
    try {
      url = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2) + '\n'],
        {type: 'application/json;charset=utf-8'}));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'douglas-service-draft.json';
      document.body.append(link);
      try { link.click(); } finally { link.remove(); }
      draftStatus.textContent = 'Draft download requested. Check the saved file before closing this page. Nothing was sent.';
    } catch {
      draftStatus.textContent = 'Draft download unavailable. Keep this page open or copy your entries manually.';
    } finally {
      if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  });
  openDraft.addEventListener('change', async () => {
    const file = openDraft.files?.[0];
    if (!file) return;
    clearTimeout(importTimer);
    const request = ++importRequest;
    const currentRevision = revision;
    draftStatus.textContent = 'Reading local draft…';
    const readTimer = importTimer = setTimeout(() => {
      if (request !== importRequest || currentRevision !== revision) return;
      // File.text() cannot be canceled; invalidate its eventual result instead.
      importRequest++;
      openDraft.value = '';
      draftStatus.textContent = 'Draft reading timed out. Current entries were kept. Choose the file again to retry, or keep editing. Nothing was sent.';
    }, 10000);
    try {
      if (file.size > 256 * 1024) throw new Error('Draft too large');
      const draft = JSON.parse(await file.text());
      if (request !== importRequest || currentRevision !== revision) return;
      if (!validDraft(draft)) throw new Error('Unsupported draft');
      form.elements.offer.value = draft.offer;
      for (const [key] of fields) form.elements[key].value = draft.fields[key];
      invalidate();
      draftStatus.textContent = 'Draft reopened locally. Review the form, then preview a new brief. Nothing was sent.';
    } catch {
      if (request === importRequest && currentRevision === revision) {
        draftStatus.textContent = 'Draft could not be reopened. Choose a supported editable draft (.json, up to 256 KiB, at most 4000 characters per field). Current entries were kept.';
      }
    } finally {
      clearTimeout(readTimer);
      if (request === importRequest) openDraft.value = '';
    }
  });
  invalidate();
  document.getElementById('builder-fields').disabled = false;
  saveDraft.disabled = false;
  openDraft.disabled = false;
})();
