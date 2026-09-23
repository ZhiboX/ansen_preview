(() => {
  'use strict';
  const form = document.getElementById('contact-form');
  if (!form) return;
  const button = document.getElementById('contact-submit');
  const notice = document.getElementById('contact-notice');
  const status = document.getElementById('contact-status');
  const config = window.ANSEN_CONTACT || {};
  let endpoint = null;
  if (config.enabled === true && typeof config.endpoint === 'string' && config.endpoint.trim()) {
    try {
      const candidate = new URL(config.endpoint, window.location.href);
      if (candidate.origin === window.location.origin && /^https?:$/.test(candidate.protocol)
          && !candidate.username && !candidate.password && !candidate.hash) endpoint = candidate;
    } catch {  }
  }
  notice.hidden = Boolean(endpoint);
  notice.textContent = 'Online enquiries are temporarily unavailable. Please try again later.';
  button.disabled = !endpoint;
  let submitting = false;
  const show = (text, state) => {
    status.textContent = text;
    status.dataset.state = state;
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    if (!endpoint) {
      show('Online enquiries are temporarily unavailable. Please try again later.', 'info');
      return;
    }
    for (const name of ['name', 'email', 'organisation', 'message']) {
      const field = form.elements.namedItem(name);
      field.value = field.value.trim();
    }
    if (!form.reportValidity()) return;
    const payload = Object.fromEntries(['name', 'email', 'organisation', 'topic', 'message', 'website']
      .map(name => [name, form.elements.namedItem(name).value]));
    submitting = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    show('', 'info');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint.href, {
        method: 'POST', credentials: 'same-origin', redirect: 'error',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(payload), signal: controller.signal
      });
      const json = (response.headers.get('content-type') || '').includes('application/json')
        ? await response.json() : null;
      if (response.ok && json?.ok === true) {
        show('Thank you. Your enquiry has been received.', 'success');
        form.reset();
      } else if (response.status === 429) {
        show('Too many attempts. Please wait a little before trying again.', 'error');
      } else {
        show('We could not confirm your enquiry was received. Your details are still here; please try again later.', 'error');
      }
    } catch {
      show('We could not confirm your enquiry was received. Your details are still here; please try again later.', 'error');
    } finally {
      clearTimeout(timeout);
      submitting = false;
      button.disabled = false;
      button.textContent = 'Send enquiry';
      form.removeAttribute('aria-busy');
    }
  });
})();
