paper.install(window);

window.onload = function () {
  paper.setup("gameCanvas");
  let tool = new Tool();
  const margin = 30;
  const workspace = new Rectangle(margin, margin, view.size.width - margin * 2, view.size.height - margin * 2)
  let foods = new Group();
  const startSize = 30;

  const colors = {
    a: {
      main: "#55efc4",
      accent: "#00b894",
    },
    b: {
      main: "#81ecec",
      accent: "#00cec9",
    },
    c: {
      main: "#74b9ff",
      accent: "#0984e3",
    },
    d: {
      main: "#a29bfe",
      accent: "#6c5ce7",
    },
    e: {
      main: "#ffeaa7",
      accent: "#fdcb6e",
    },
    f: {
      main: "#fab1a0",
      accent: "#e17055",
    },
    g: {
      main: "#ff7675",
      accent: "#d63031",
    },
    h: {
      main: "#fd79a8",
      accent: "#e84393",
    },
    i: {
      main: "#dfe6e9",
      accent: "#b2bec3",
    },
    j: {
      main: "#636e72",
      accent: "#2d3436",
    },
  }

  const sizeCategories = {
    speck: {
      lower: 0,
      upper: .1,
      qty: 5,
      color: "black",
      growBy: .05,
    },
    xxs: {
      lower: .1,
      upper: .25,
      qty: 5,
      color: colors.d.main,
      growBy: .1,
    },
    xs: {
      lower: .25,
      upper: .5,
      qty: 5,
      color: colors.c.main,
      growBy: .15,
    },
    s: {
      lower: .5,
      upper: .75,
      qty: 10,
      color: colors.b.main,
      growBy: .2,
    },
    m: {
      lower: .75,
      upper: 1.25,
      qty: 5,
      color: colors.a.main,
      growBy: .25,
    },
    l: {
      lower: 1.25,
      upper: 1.75,
      qty: 5,
      color: colors.e.main,
      growBy: null,
    },
    xl: {
      lower: 1.75,
      upper: 2.5,
      qty: 5,
      color: colors.f.main,
      growBy: null,
      
    },
    xxl: {
      lower: 2.5,
      upper: 3.5,
      qty: 5,
      color: colors.g.main,
      growBy: null,
    },
  }

  let playerConfig = {
    fillColor: "plum",
    strokeColor: "purple",
    strokeWidth: 3,
    radius: startSize,
    position: view.center,
    data: {
      vel: new Point(0, 0)
    }
  }

  let foodConfig = {
    strokeColor: "black",
    strokeWidth: "2",
  }

  new Path.Rectangle(workspace).strokeColor = "red";

  /*******************
   *  Create player  *
   *******************/

  let player = new Shape.Circle(playerConfig);
  player.bringToFront();

  /*******************
   *   Create food   *
   *******************/
  
  for (const [k, v] of Object.entries(sizeCategories)) {
    console.log(`${k}:
    range: ${v.lower} - ${v.upper} times player size
    qty: ${v.qty}`)
    let szRange = v.upper - v.lower;
    for (let i = 0; i < v.qty; i++) {
      let sz = player.radius * (Math.random() * szRange + v.lower);
      let position = Point.random().multiply(workspace.size).add([margin, margin]);
      let food = new Shape.Circle(foodConfig);
      food.radius = sz;
      food.setPosition(position);
      food.data = {
        szCat: k,
        feeds: player.radius * v.growBy,
      };
      console.log(v.color);
      food.fillColor = v.color;
      foods.addChild(food);
    }
  }
  

  /*******************
   * Keyboard Events *
   *******************/
  tool.onKeyDown = (event) => {
    // controlled movement for player
    switch (event.key) {
      case 'w':
        player.data.vel.y += -1
        break;
      case 'a':
        player.data.vel.x += -1
        break;
      case 's':
        player.data.vel.y += 1
        break;
      case 'd':
        player.data.vel.x += 1
        break;

      default:
        player.data.vel.set(0, 0);
        break;
    }
  }

  /*******************
   *  Update frames  *
   *******************/
  view.onFrame = (frame) => {
    // decay speed - this works well with the switch to each key press increasing the magnitude of velocity
    player.data.vel = player.data.vel.multiply(.99);
    foods.children.forEach(food => {
      if (food.intersects(player)) {
        console.log('intersect');
        if (food.radius < player.radius) {
          player.radius += food.data.feeds;
          food.remove();
        }
      }
    });
    player.setPosition(player.position.add(player.data.vel));
  }


  view.draw();
};
