// Coastline Sips — shared site behavior. Change the inquiry address in ONE place here.
var INQUIRY_EMAIL = 'inquiries@coastlinesip.com';

(function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
    });
  }

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Copy email button
  var copy = document.getElementById('copy-email');
  var status = document.getElementById('copy-status');
  if (copy) {
    copy.addEventListener('click', function () {
      var done = function () { if (status) status.textContent = 'Copied ' + INQUIRY_EMAIL; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(INQUIRY_EMAIL).then(done, function () {
          if (status) status.textContent = 'Select and copy: ' + INQUIRY_EMAIL;
        });
      } else if (status) {
        status.textContent = 'Select and copy: ' + INQUIRY_EMAIL;
      }
    });
  }

  // Inquiry form: builds a ready-to-send email in the visitor's mail app
  var form = document.getElementById('inquiry-form');
  if (!form) return;

  // Pre-fill package from ?package=Signature links
  var params = new URLSearchParams(window.location.search);
  var pkg = params.get('package');
  var pkgSelect = form.querySelector('#package');
  if (pkg && pkgSelect) {
    for (var i = 0; i < pkgSelect.options.length; i++) {
      if (pkgSelect.options[i].value.toLowerCase() === pkg.toLowerCase()) pkgSelect.selectedIndex = i;
    }
  }

  // No past event dates
  var dateInput = form.querySelector('#date');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = document.getElementById('form-error');
    var v = function (id) { var el = form.querySelector('#' + id); return el ? el.value.trim() : ''; };

    var name = v('name'), email = v('email'), date = v('date'), guests = v('guests');
    if (!name || !email || !date || !guests) {
      err.textContent = 'Add your name, email, event date, and guest count so we can check availability.';
      return;
    }
    err.textContent = '';

    var niceDate = date;
    try {
      niceDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch (x) {}

    var type = v('type') || 'Event';
    var subject = 'Event inquiry: ' + type + ' on ' + niceDate;
    var lines = [
      'Hi Coastline Sips,',
      '',
      "I'd love to learn more about booking your mobile mocktail bar.",
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Phone: ' + (v('phone') || 'Not provided'),
      'Event type: ' + type,
      'Event date: ' + niceDate,
      'Guest count: ' + guests,
      'Package: ' + (v('package') || 'Not sure yet'),
      'Location / venue: ' + (v('location') || 'Not provided'),
      '',
      'About the event:',
      v('message') || '(No extra details yet)',
      '',
      'Thank you!',
      name
    ];
    window.location.href = 'mailto:' + INQUIRY_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));

    var sent = document.getElementById('form-sent');
    if (sent) sent.textContent = 'Your email app should open with your inquiry ready to send. If nothing opened, email us directly at ' + INQUIRY_EMAIL + '.';
  });
})();
