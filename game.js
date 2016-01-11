

document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementsByTagName("canvas")[0],
      ctx = canvas.getContext("2d"),
      height = 800,
      width = 600;


  // canvas.height = height;
  // canvas.width = width;

  /*
   * width and height are the overall width and height we have to work with, displace is
   * the maximum deviation value. This stops the terrain from going out of bounds if we choose
   */

   function terrain(width, height, displace, roughness, seed) {
       var points = [],
           // Gives us a power of 2 based on our width
           power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2)))),
           seed = seed || {
               s: height / 2 + (Math.random() * displace * 2) - displace,
           };

       // Set the initial left point
       points[0] = seed.s;

       // set the initial right point
       points[power] = height / 2 + (Math.random() * displace * 2) - displace;

       displace *= roughness;

       // Increase the number of segments
       for (var i = 1; i < power; i *= 2) {
           // Iterate through each segment calculating the center point
           for (var j = (power / i) / 2; j < power; j += power / i) {
               points[j] = ((points[j - (power / i) / 2] + points[j + (power / i) / 2]) / 2);
               points[j] += (Math.random() * displace * 2) - displace
           }
           // reduce our random range
           displace *= roughness;
       }
       return points;
   }

   // get the points
   var terPoints = terrain(width, height, height / 3, 0.5),
       terPoints2 = terrain(width, height, height / 3, 0.5, {s : terPoints[terPoints.length - 1], e : 0});

   var offset = 0;

   function scrollTerrain() {
      ctx.clearRect(0, 0, width, height);
      offset -= 3;

      // draw the first half
      ctx.beginPath();
      ctx.moveTo(offset, terPoints[0]);
      for (var t = 0; t < terPoints.length; t++) {
          ctx.lineTo(t + offset, terPoints[t]);
      }

      for (t = 0; t < terPoints2.length; t++) {
          ctx.lineTo((terPoints.length - 1) + offset + t, terPoints2[t]);
      }

      // finish creating the rect so we can fill it
      ctx.lineTo(width + offset+t, canvas.height);
      ctx.lineTo(offset, canvas.height);
      ctx.closePath();
      ctx.fill();

      /*
      * if the number of our points on the 2nd array is less than or equal to our screen width
      * we reset the offset to 0, copy terpoints2 to terpoints,
      * and gen a new set of points for terpoints 2
      */

      if(terPoints2.length-1 + width + offset <= width){
          terPoints = terPoints2;
          terPoints2 = terrain(width, height, height / 3, 0.5, {s : terPoints[terPoints.length - 1]});
          offset = 0;
      }

      requestAnimationFrame(scrollTerrain);
  }

  scrollTerrain();

})
