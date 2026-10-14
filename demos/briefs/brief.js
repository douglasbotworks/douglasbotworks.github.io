(() => {
  'use strict';
  const form = document.getElementById('brief-form');
  const preview = document.getElementById('preview');
  const status = document.getElementById('status');
  const download = document.getElementById('download');
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
  const required = new Set(['expected', 'actual', 'steps', 'acceptance']);
  let prepared = null;
  function invalidate() {
    prepared = null;
    download.disabled = true;
    emailDraft.hidden = true;
    emailDraft.removeAttribute('href');
    preview.textContent = 'Complete the required fields, then preview.';
    status.textContent = '';
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
    const values = fields.map(([key, label]) => [key, label, form.elements[key].value.trim()]);
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
    const subject = offer === 'repair' ? 'Software repair scope review' : 'Static release scope review';
    emailDraft.href = `mailto:douglasbotworks@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Hello Douglas, I would like a scope review. I will attach my downloaded request brief before sending. Please confirm scope, price and payment arrangements before starting work.')}`;
    emailDraft.hidden = false;
    status.textContent = 'Brief prepared locally. Review it before downloading or sharing.';
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
  invalidate();
  document.getElementById('builder-fields').disabled = false;
})();
