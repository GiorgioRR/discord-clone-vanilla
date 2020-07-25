function append_file () {
    console.log("fuck uuuuuuuuuuuuuuuuuuuu");
}


function urlify (text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '</a12>' + url + '</a12>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}


function append_message (t_author, t_message, t_date, v_category){
    t_category = document.getElementById("category").textContent;

    if (v_category.toLowerCase() == t_category.substring(2).toLowerCase()){
        var author  = document.createElement("h4");
        var message = document.createElement("h4");
        var date    = document.createElement("h4");

        author.className  = "author";
        message.className = "message";
        date.className    = "date";

        author.appendChild(document.createTextNode(t_author));
        // message.appendChild(document.createTextNode(t_message));
        date.appendChild(document.createTextNode(t_date));

        try {
            // Try to convert to utf-8
            // If the conversion succeeds, text is not utf-8
            var t_message = decodeURIComponent(escape(t_message));
        }catch(e) {
            // console.log(e.message); // URI malformed
            // This exception means text is utf-8
        }

        // console.log(typeof(t_message));
        var t_message = urlify(t_message); // ავღნიშნოთ <a>-ით ლინკები

        var lines = t_message.split("\n");
        for (i = 0; i < lines.length; i++) {
            var links = lines[i].split('</a12>');
            var length = links.length;  // 0
            if (length > 1){
                for (i = 0; i < length; i++) {
                    var text_l = links[i];
                    if (i % 2 == 1) {
                        

                        var a = document.createElement('a');  
                        var t_text = document.createTextNode(text_l);

                        a.appendChild(t_text);
                        // a.title = text_l;
                        a.href = text_l;
                        a.target = "_blank";

                        message.appendChild(a);
                    }
                    else {
                        message.appendChild(document.createTextNode(text_l));
                    }
                }
            }
            else {
                message.appendChild(document.createTextNode(lines[i]));
            }

            message.appendChild(document.createElement("br"));
        }

        document.getElementsByClassName("chat-screen")[0].appendChild(author);
        document.getElementsByClassName("chat-screen")[0].appendChild(message);
        document.getElementsByClassName("chat-screen")[0].appendChild(date);
    }
    else {
        new_message(v_category);

    // document.getElementById("text-area").value = "";
    }
}


function new_message (category){
    var categories = ["welcome", "announcements", "rules", "whoami", "general", "ლინუქსი", "მეცნიერება", "კრიპტოგრაფია",
                      "coding-challenges", "movies-n-books", "hacking-penetration-forensics-ctf", "multiplayer-games",
                      "good-stuff", "tldr", "memes", "python", "c-cpp", "java", "front-end", "database-languages",
                      "el-general", "radio-circuits", "bot-spam", "music", "git", "github-notifs", "v-general", "funker",
                      "root"]

    var items = document.getElementsByClassName("li");
    var num = categories.indexOf(category);
    
    items[num].style.backgroundColor = "white";
    items[num].style.color = "black";  // no idea why, but this doesn't works
}


function status_bar ( data ){
    right = document.getElementById("right");

    while(right.firstChild){
        right.removeChild(right.firstChild);
    }

    const parsed = JSON.parse(JSON.stringify(data));

    admin   = document.createElement("h2");
    admin.appendChild(document.createTextNode("ADMIN - " + parsed.num_of_users[0]));
    right.appendChild(admin);
    for (i=0; i < parsed.admins.length; i++) {
        a = document.createElement("h2");
        a.className = "online";
        a.appendChild(document.createTextNode("--- " + parsed.admins[i]));

        right.appendChild(a);
    }

    moderator = document.createElement("h2");
    moderator.appendChild(document.createTextNode("MODERATOR - " + parsed.num_of_users[1]));
    right.appendChild(moderator);
    for (i=0; i < parsed.moderators.length; i++) {
        a = document.createElement("h2");
        a.className = "online";
        a.appendChild(document.createTextNode("--- " + parsed.moderators[i]));

        right.appendChild(a);
    }

    online = document.createElement("h2");
    online.appendChild(document.createTextNode("ONLINE - " + parsed.num_of_users[2]));
    right.appendChild(online);
    for (i=0; i < parsed.online.length; i++) {
        a = document.createElement("h2");
        a.className = "online";
        a.appendChild(document.createTextNode("--- " + parsed.online[i]));

        right.appendChild(a);
    }

    offline = document.createElement("h2");
    offline.appendChild(document.createTextNode("OFFLINE - " + parsed.num_of_users[3]));
    right.appendChild(offline);
    for (i=0; i < parsed.offline.length; i++) {
        a = document.createElement("h2");
        a.className = "online";
        a.appendChild(document.createTextNode("--- " + parsed.offline[i]));

        right.appendChild(a);
    }
}


function send_message (){
    var user_input  = document.getElementById("text-area").value.trim();
    if (user_input != ""){
        var user_name   = document.getElementById("user").textContent;
        var vv_category = document.getElementById("category").textContent;
    
        socket.emit( 'message', {
            user_name : user_name,
            category: vv_category,
            message : user_input  // encodeURI(user_input)
        })
        document.getElementById("text-area").value = "";
    }
}


function send_data (data){
    socket.emit( 'voice', {
        category: data
    })
}


function main (){
    var entry_t = document.getElementById("text-area");
    entry_t.addEventListener("keypress", function (e) {  // bind shift+enter to send a message
        if (e.keyCode == 13 && e.shiftKey) {
            console.log("fucked u");
            send_message();
        }
    }
    );

    var user_na  = document.getElementById("user").textContent;

    socket.on( 'connect', function() {
        socket.emit( 'joined', {
            user_name: user_na,
            data: 'User Connected'
        })
    })

    // socket.on( 'my response', function( msg ) {})

    socket.on( 'm_s_o', function( msg ) {
        // typeof(msg) == object
        const parsed = JSON.parse(JSON.stringify(msg));
        append_message(parsed.user_name, parsed.message, parsed.date, parsed.category);
    })

    socket.on( 'connect/disconnect', function( msg ) {
        status_bar(msg);
    })
}


var socket = io.connect('http://' + document.domain + ':' + location.port);
