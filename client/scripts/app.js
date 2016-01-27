var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

var escapeHtml = function(string) {
  return String(string).replace(/[&<>"'\/]/g, function(s) {
    return entityMap[s];
  });
};

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function() {
    // fetch
    app.fetch();

    $('.submit').on('click', function(e){
      e.preventDefault();
      var $obj = {};
      app.send($obj);
    });
  },
  send: function(message) {
    $.ajax({
      url: app.server,
      method: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  fetch: function() {
    $.ajax({
      url: app.server,
      method: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        var $results = data.results;
        var $html = '';

        $.each($results, function(index, message) {
          $html += '<div class="text">' + escapeHtml(message.text) + '</div>';
          $html += '<a href="#" class="username">' + escapeHtml(message.username) + '</a>';
        });

        $('#chats').html($html);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  addMessage: function(message) {
    app.send(message);
  },
  addRoom: function(roomName) {
  },
  addFriend: function() {
  },
  handleSubmit: function() {
  }
};
