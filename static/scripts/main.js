function append_file () {
    console.log("fuck uuuuuuuuuuuuuuuuuuuu");
}


function urlify (text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return `</a12>${url}</a12>`;
    })
}


function append_message (t_author, t_message, t_date, v_category){
    t_category = document.getElementById("category").textContent;

    if (v_category.toLowerCase() == t_category.substring(2).toLowerCase()){
        try {
            // Try to convert to utf-8
            // If the conversion succeeds, text is not utf-8
            var t_message = decodeURIComponent(escape(t_message));
        }catch(e) {
            // console.log(e.message); // URI malformed
            // This exception means text is utf-8
        }

        // console.log(typeof(t_message));
        var t_message = urlify(t_message); // ავღნიშნოთ <a>-თი ლინკები
        var message = "";

        var lines = t_message.split("\n");
        for (i = 0; i < lines.length; i++) {
            var links = lines[i].split('</a12>');
            var length = links.length;  // 0
            if (length > 1){
                for (i = 0; i < length; i++) {
                    var text_l = links[i];
                    if (i % 2 == 1) {
                        var a_html = `<a href="#{text_l}", target="_blank">${text_l}</a>`;

                        message += a;
                    }
                    else {
                        message += text_l;
                    }
                }
            }
            else {
                message += lines[i];
            }
            message += "</br>";
        }

        var html = `
        <div class="mmm">
            <h4 class="author">${t_author}</h4>
            <h4 class="message">${message}</h4>
            <h4 class="date">${t_date}</h4>
        </div>
        `;
        document.getElementById("chat-screen").innerHTML += html;
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
    var num   = categories.indexOf(category);
    
    items[num].style.backgroundColor = "white";
    items[num].style.color = "black";  // no idea why, but this doesn't works
}


function status_bar ( data ){
    right = document.getElementById("right");

    while(right.firstChild){
        right.removeChild(right.firstChild);
    }

    const parsed = JSON.parse(JSON.stringify(data));
    
    var s_html = `<h2>ADMIN - ${parsed.num_of_users[0]}</h2>`;
    for (i=0; i < parsed.admins.length; i++) {
        s_html += `<h2 class="online">--- ${parsed.admins[i]}</h2>`;
    }

    s_html += `<h2>MODERATOR - ${parsed.num_of_users[1]}</h2>`;
    for (i=0; i < parsed.moderators.length; i++) {
        s_html += `<h2 class="online">--- ${parsed.moderators[i]}</h2>`;
    }

    s_html += `<h2>ONLINE - ${parsed.num_of_users[2]}</h2>`;
    for (i=0; i < parsed.online.length; i++) {
        s_html += `<h2 class="online">--- ${parsed.online[i]}</h2>`;
    }

    s_html += `<h2>OFFLINE - ${parsed.num_of_users[3]}</h2>`;
    for (i=0; i < parsed.offline.length; i++) {
        s_html += `<h2 class="online">--- ${parsed.offline[i]}</h2>`;
    }

    right.innerHTML += s_html;
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
            // pass - this does what it is supposed to do
        }
        else if (e.keyCode == 13) {
            send_message();
            entry_t.value = "";
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
        let el = document.getElementsByClassName("mmm");
        el[el.length-1].scrollIntoView();
    })

    socket.on( 'connect/disconnect', function( msg ) {
        status_bar(msg);
    })
}


// console.log(`http://${document.domain}:${location.port}`);
var socket = io.connect(`http://${document.domain}:${location.port}`);
