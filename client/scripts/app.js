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
  username: window.location.search.split("=")[1],
  server: 'https://api.parse.com/1/classes/chatterbox',
  friends: {},
  init: function() {
    // fetch
    app.fetch();

    $('.submit').on('click', function(e){
      e.preventDefault();

      app.handleSubmit();
    });

    // refreshing
    setInterval(function(){
      app.fetch();
      console.log('refreshing..');
    }, 3000);

    $('body').on('click', '.username', function(e){
      e.preventDefault();
      var $friend = $(this).text();
      app.addFriend($friend);
    });

    $('#roomSelect').on('change', function(e){
      app.room = $(this).val();
      app.fetch();
    });
  },
  send: function(message) {
    $.ajax({
      url: app.server,
      method: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
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
      data: {'order': '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        var $results = data.results;
        var $html = '';
        var $options = '';
        var $rooms = {};
        var $currentRoom = $('#roomSelect').val() || 'lobby';

        $.each($results, function(index, message) {
          if ( app.friends[escapeHtml(message.username)] ) {
            $html += '<div class="message friend">' + escapeHtml(message.text) + '</div>';
          } else {
            $html += '<div class="message">' + escapeHtml(message.text) + '</div>';
          }
          $html += '<a href="#" class="username">' + escapeHtml(message.username) + '</a>';

          if ( !$rooms[escapeHtml(message.roomname)] ) {
            $rooms[escapeHtml(message.roomname)] = escapeHtml(message.roomname);
          }
        });

        $.each($rooms, function(index, room) {
          $options += '<option>' + room + '</option>';
        });

        $('#chats').html($html);
        $('#roomSelect').html($options);
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
  addFriend: function(friend) {
    if ( !app.friends[friend] ) {
      app.friends[friend] = friend;
    }
    app.fetch();
  },
  handleSubmit: function() {
    var $obj = {};
    $obj['text'] = $('#message').val();
    $obj['username'] = app.username;
    $obj['roomname'] = app.room || 'lobby';

    app.send($obj);
  }
};
