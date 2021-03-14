var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    rect = [],
    handlesSize = 4,
    currentHandle = false,
    drag = false,
    selected = false;
    center_deleted = true;

function init() {
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
}

function point(x, y) {
    return {
        x: x,
        y: y
    };
}

function collides(rects, x, y) {
    var isCollision = -1;
    for (var i = 0, len = rects.length; i < len; i++) {
        var left = rects[i].x, right = rects[i].x+rects[i].w;
        var top = rects[i].y, bottom = rects[i].y+rects[i].h;
        if (right >= x
            && left <= x
            && bottom >= y
            && top <= y) {
            isCollision = i;
        }
    }
    return isCollision;
}

function collide_center(rects, x, y) {
    var isCollisionCenter = -1;
    for (var i = 0, len = rects.length; i < len; i++) {
        var left = rects[i].x+ 0.8*rects[i].w/2, right = rects[i].x+ 1.2*rects[i].w;
        var top = rects[i].y + 0.8*rects[i].h/2, bottom = rects[i].y+ 1.2*rects[i].h;
        if (right >= x
            && left <= x
            && bottom >= y
            && top <= y) {
            isCollisionCenter = i;
        }
    }
    return isCollisionCenter;
}



function dist(p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
}

function getHandle(e,mouse) {
    var returned = false;
    // selected = collides(rect, e.offsetX, e.offsetY);
    if(selected || selected === 0)
    {
        if (dist(mouse, point(rect[selected].x, rect[selected].y)) <= handlesSize) returned = 'topleft';
        if (dist(mouse, point(rect[selected].x + rect[selected].w, rect[selected].y)) <= handlesSize) returned = 'topright';
        if (dist(mouse, point(rect[selected].x, rect[selected].y + rect[selected].h)) <= handlesSize) returned = 'bottomleft';
        if (dist(mouse, point(rect[selected].x + rect[selected].w, rect[selected].y + rect[selected].h)) <= handlesSize) returned = 'bottomright';
        if (dist(mouse, point(rect[selected].x + rect[selected].w / 2, rect[selected].y)) <= handlesSize) returned = 'top';
        if (dist(mouse, point(rect[selected].x, rect[selected].y + rect[selected].h / 2)) <= handlesSize) returned = 'left';
        if (dist(mouse, point(rect[selected].x + rect[selected].w / 2, rect[selected].y + rect.h)) <= handlesSize) returned = 'bottom';
        if (dist(mouse, point(rect[selected].x + rect[selected].w, rect[selected].y + rect[selected].h / 2)) <= handlesSize) returned = 'right';
    }
    
    
    return returned;
}

function mouseDown(e) {
    
    if (currentHandle && center_deleted== false) 
    {  
        draw();
        drag = true;
    }
    else
    {
        var mousePos = point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        
        selectedCenter =  collide_center(rect, e.offsetX, e.offsetY);
        
        if (selectedCenter > -1){
        	rect.splice(selectedCenter, 1);
          center_deleted = true;
        }
        else {
          rect.push({x: mousePos.x, y: mousePos.y, w: 80, h: 20});
          draw();
          drag = true;
          selected = collides(rect, e.offsetX, e.offsetY);
				}
    }
}

function mouseUp() {

  drag = false;
  currentHandle = false;
  draw();

}


function mouseMove(e) {
    var previousHandle = currentHandle;
    if (!drag) {
        selected = collides(rect, e.offsetX, e.offsetY);
        if (selected >= 0) {
            currentHandle = getHandle(e,point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop));
        }
    } else {
        var mousePos = point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        var select = rect[selected];
        switch (currentHandle) {
            case 'topleft':
                rect[selected].w += select.x - mousePos.x;
                rect[selected].h += select.y - mousePos.y;
                rect[selected].x = mousePos.x;
                rect[selected].y = mousePos.y;
                break;
            case 'topright':
                rect[selected].w = mousePos.x - rect[selected].x;
                rect[selected].h += rect[selected].y - mousePos.y;
                rect[selected].y = mousePos.y;
                break;
            case 'bottomleft':
                rect[selected].w += rect[selected].x - mousePos.x;
                rect[selected].x = mousePos.x;
                rect[selected].h = mousePos.y - rect[selected].y;
                break;
            case 'bottomright':
                rect[selected].w = mousePos.x - rect[selected].x;
                rect[selected].h = mousePos.y - rect[selected].y;
                break;

            case 'top':
                rect[selected].h += rect[selected].y - mousePos.y;
                rect[selected].y = mousePos.y;
                break;

            case 'left':
                rect[selected].w += rect[selected].x - mousePos.x;
                rect[selected].x = mousePos.x;
                break;

            case 'bottom':
                rect[selected].h = mousePos.y - rect[selected].y;
                break;

            case 'right':
                rect[selected].w = mousePos.x - rect[selected].x;
                break;
        }
    }
    
    if (drag || currentHandle != previousHandle) draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    console.log(selected);
    $.each(rect,function(i,item)
    {
    	ctx.fillRect(item.x, item.y, item.w, item.h);
    });
    
        if (currentHandle) {
        var posHandle = [];
        posHandle = point(0, 0);
        switch (currentHandle) {
            case 'topleft':
                posHandle.x = rect[selected].x;
                posHandle.y = rect[selected].y;
                break;
            case 'topright':
                posHandle.x = rect[selected].x + rect[selected].w;
                posHandle.y = rect[selected].y;
                break;
            case 'bottomleft':
                posHandle.x = rect[selected].x;
                posHandle.y = rect[selected].y + rect[selected].h;
                break;
            case 'bottomright':
                posHandle.x = rect[selected].x + rect[selected].w;
                posHandle.y = rect[selected].y + rect[selected].h;
                break;
            case 'top':
                posHandle.x = rect[selected].x + rect[selected].w / 2;
                posHandle.y = rect[selected].y;
                break;
            case 'left':
                posHandle.x = rect[selected].x;
                posHandle.y = rect[selected].y + rect[selected].h / 2;
                break;
            case 'bottom':
                posHandle.x = rect[selected].x + rect[selected].w / 2;
                posHandle.y = rect[selected].y + rect[selected].h;
                break;
            case 'right':
                posHandle.x = rect[selected].x + rect[selected].w;
                posHandle.y = rect[selected].y + rect[selected].h / 2;
                break;
        }
        ctx.globalCompositeOperation = 'xor';
        ctx.beginPath();
        ctx.arc(posHandle.x, posHandle.y, handlesSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }
}

init();
//draw();
