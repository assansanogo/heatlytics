(function() {

    document.onmousemove = handleMouseMove;
    let csvContent = "data:text/csv;charset=utf-8,";
    document.onclick = handleMouseClick;


    let
    body    = document.querySelector('body'),
    beginPath = false;


    let started = false;

    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism
        if (event.pageX != null & started== false) {
            started = true;
            alert(`the script is recording your mouse positions, when you click it will automatically download the mouse positions`);
            window.resizeTo(500,500);
        }

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        if (event.pageX != null) 
        {
         let string_pos = [event.pageX,event.pageY,window.pageXOffset,window.pageYOffset, window.innerHeight, window.innerWidth].join(",");
         console.log(string_pos);
         csvContent += string_pos + "\r\n";
        }
        // Use event.pageX / event.pageY here
    }


    function handleMouseClick(event) {
        var eventDoc, doc, body;

        event = event || window.event;
        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    }
})();