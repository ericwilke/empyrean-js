// Bresenham-based supercover line algorithm

function getLine (x1, y1, x2, y2) {
  let points = [];
  let i;               // loop counter
  let ystep, xstep;    // the step on y and x axis
  let error;           // the error accumulated during the increment
  let errorprev;       // *vision the previous value of the error variable
  let y = y1, x = x1;  // the line points
  let ddy, ddx;        // compulsory variables: the double values of dy and dx
  let dx = x2 - x1;
  let dy = y2 - y1;

  points.push({x: x1, y: y1});
  // NB the last point can't be here, because of its previous point (which has to be verified)
  if (dy < 0) {
    ystep = -1;
    dy = -dy;
  } else {
      ystep = 1;
  }
  if (dx < 0){
    xstep = -1;
    dx = -dx;
  } else {
      xstep = 1;
  }
  ddy = 2 * dy;  // work with double values for full precision
  ddx = 2 * dx;
  if (ddx >= ddy) {  // first octant (0 <= slope <= 1)
    // compulsory initialization (even for errorprev, needed when dx==dy)
    errorprev = error = dx;  // start in the middle of the square
    for (i=0 ; i < dx ; i++) {  // do not use the first point (already done)
      x += xstep;
      error += ddy;
      if (error > ddx){  // increment y if AFTER the middle ( > )
        y += ystep;
        error -= ddx;
        // three cases (octant == right->right-top for directions below):
        if (error + errorprev < ddx)  // bottom square also
          points.push({x: x, y: y-ystep});
        else if (error + errorprev > ddx)  // left square also
          points.push({x: x-xstep, y: y});
        else {  // corner: bottom and left squares also
          points.push({x: x, y: y-ystep});
          points.push({x: x-xstep, y: y});
        }
      }
      points.push({x: x, y: y});
      errorprev = error;
    }
  } else {  // the same as above
    errorprev = error = dy;
    for (i=0 ; i < dy ; i++) {
      y += ystep;
      error += ddx;
      if (error > ddy) {
        x += xstep;
        error -= ddy;
        if (error + errorprev < ddy) {
          points.push({x: x-xstep, y: y});
        }
        else if (error + errorprev > ddy) {
          points.push({x: x, y: y-ystep});
        }
        else {
          points.push({x: x-xstep, y: y});
          points.push({x: x, y: y-ystep});
        }
      }

      points.push({x: x, y: y});
      errorprev = error;
    }
  }
  return points;
}
