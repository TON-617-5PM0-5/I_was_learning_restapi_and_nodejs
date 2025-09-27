const button = document.getElementById("btn-requester");
const chat_box = document.getElementById("chat-box");
const name_box = document.getElementById("name-box");
const message_box = document.getElementById("message-box");

function create_json(_name, _message){
    let result =  {
        name: _name,
        message: _message
    }
    return JSON.stringify(result);
}

function send_message(){
    const message = message_box.value;
    const name = name_box.value;
    let json_to_be_sent = create_json(name, message);

    let request = new XMLHttpRequest();

    request.open('POST', 'http://localhost:3000/send', true)

    request.responseType = 'json';
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = () => {
        if (request.status === 200) {
            const data = request.response;
            show_message({
                name: "debug",
                time: "??:??:?? ??.??",
                message: "Sending was successful"
            });
        }
        else {
            show_message({
                name: "system",
                time: "??:??:?? ??.??",
                message: "Error occured while sending message"
            });
        }
    }

    request.onerror = () => {
        show_message({
                name: "system",
                time: "??:??:?? ??.??",
                message: "Error occured while sending message"
            });
    }

    request.send(json_to_be_sent);
}

function get_message(message_json){
    let in_html = "<p>" + message_json.name + " - " + message_json.time + "</p>";
       in_html += "<p>   > " + message_json.message + "</p>";
       in_html += "<hr></hr>";
    return in_html;
}

function show_all_messages(message_table){
    result = "";
    for (let i = 0; i < message_table.length; i++){
        result += get_message(message_table[i]);
    }
    chat_box.innerHTML = result;  
};

function show_message(message_json){
    let in_html = "<p>" + message_json.name + " - " + message_json.time + "</p>";
       in_html += "<p>   > " + message_json.message + "</p>";
       in_html += "<hr></hr>";
    chat_box.innerHTML += in_html;    
}

async function sending_listening() {
    const request = await fetch('http://localhost:3000/listening', {
        method: "POST",
    }).catch((error) => {
        show_message({
            name: "system",
            time: "??:??:?? ??.??",
            message: "Error occured while trying to recieve messages, please reboot you page"
        });
    });
    let data = await request.json();
    show_all_messages(data);
    sending_listening();
}

async function get_history() {
    const request = await fetch('http://localhost:3000/get_history', {
        method: "POST",
    }).catch((error) => {
        show_message({
            name: "system",
            time: "??:??:?? ??.??",
            message: "failed to get history of chat"
        });
    });

    let data = await request.json();
    show_all_messages(data);
}


button.addEventListener('click', send_message);
get_history();
sending_listening();