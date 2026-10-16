(function () {
  'use strict';

  function csrfToken() {
    var token = document.cookie.split('; ').find(function (cookie) {
      return cookie.indexOf('csrftoken=') === 0;
    });
    return token ? token.split('=')[1] : '';
  }

  function showMessage(header, message) {
    var target = header.querySelector('[data-session-message]');
    target.textContent = message;
    target.hidden = false;
  }

  function renderAnonymous(header) {
    var controls = header.querySelector('[data-account-controls]');
    controls.replaceChildren();
    var login = document.createElement('a');
    login.href = '/login';
    login.textContent = 'Log in';
    var register = document.createElement('a');
    register.className = 'button button-primary';
    register.href = '/register';
    register.textContent = 'Join free';
    controls.append(login, register);
  }

  function bindLogout(header) {
    var button = header.querySelector('[data-logout]');
    if (!button) return;
    button.addEventListener('click', function () {
      if (button.disabled) return;
      button.disabled = true;
      button.textContent = 'Signing out…';
      fetch('/djangoapp/csrf', { credentials: 'same-origin' })
        .then(function () {
          return fetch('/djangoapp/logout', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'X-CSRFToken': csrfToken() }
          });
        })
        .then(function (response) {
          if (!response.ok) throw new Error('Unable to sign out. Please try again.');
          return response.json();
        })
        .then(function (result) {
          if (!result || result.userName !== '') throw new Error('Sign-out response was invalid.');
          window.location.replace('/');
        })
        .catch(function (error) {
          button.disabled = false;
          button.textContent = 'Log out';
          showMessage(header, error.message);
          fetch('/djangoapp/session', { credentials: 'same-origin' }).catch(function () {});
        });
    });
  }

  function bindMenu(header) {
    var toggle = header.querySelector('.menu-toggle');
    var navigation = header.querySelector('.nav-links');
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      navigation.setAttribute('data-open', String(open));
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        toggle.setAttribute('aria-expanded', 'false');
        navigation.setAttribute('data-open', 'false');
      }
    });
  }

  document.querySelectorAll('[data-public-header]').forEach(function (header) {
    bindLogout(header);
    bindMenu(header);
  });
}());
