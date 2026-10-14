(() => {
  'use strict';
  const form = document.getElementById('brief-form');
  const preview = document.getElementById('preview');
  const status = document.getElementById('status');
  const download = document.getElementById('download');
  const emailDraft = document.getElementById('email-draft');
  const fields = [['runtime', 'Operating system and Node.js version'], ['size', 'Approximate file sizes, row counts and number of pairs'], ['needs', 'Reports and review needs'], ['workflow', 'Review workflow and intended internal users'], ['delivery', 'Timeline and license questions for discussion']];
  const required = new Set(['runtime', 'size', 'needs']);
  let prepared = null;
  function invalidate() {
    prepared = null;
    download.disabled = true;
    emailDraft.hidden = true;
    emailDraft.removeAttribute('href');
    preview.textContent = 'Complete the required fields, then preview.';
    status.textContent = '';
  }
  form.addEventListener('input', invalidate);
  form.addEventListener('change', invalidate);
  form.addEventListener('reset', () => { invalidate(); queueMicrotask(invalidate); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    invalidate();
    const values = fields.map(([key, label]) => [key, label, form.elements[key].value.trim()]);
    for (const [key, label, value] of values) {
      if ((required.has(key) && !value) || form.elements[key].value.length > 4000) {
        status.textContent = `${label}: enter ${required.has(key) ? '1–4000' : 'at most 4000'} characters.`;
        form.elements[key].focus();
        return;
      }
    }
    prepared = [
      'CATALOG CHANGE GUARD — CLI AVAILABILITY REQUEST',
      'Local worksheet only. No booking, contract, payment or submission.',
      'Availability discussion only. Checkout is not open. No Shopify connection, import or import-safety guarantee.',
      ...values.map(([, label, value]) => `${label}:\n${value || '(not supplied)'}`),
      'Before purchase: agree license, delivery, scope, price and payment. Do not include merchant CSVs, Handles, SKUs, cell values, credentials or customer records.'
    ].join('\n\n') + '\n';
    preview.textContent = prepared;
    download.disabled = false;
    const subject = 'Catalog CLI availability';
    emailDraft.href = `mailto:douglasbotworks@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Hello Douglas, I would like to discuss Catalog CLI availability. I will attach my downloaded inquiry before sending. Please confirm license, scope, price and delivery arrangements before any purchase.')}`;
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
      link.download = 'catalog-cli-request.txt';
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
