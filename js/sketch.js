paper.install(window);

window.onload = function () {
  paper.setup("gameCanvas");
  let tool = new Tool();
  const foodCount = 200;
  const margin = 30;
  const workspace = new Rectangle(margin, margin, view.size.width - margin * 2, view.size.height - margin * 2)
  let foods = new Group();
  let playerConfig = {
    fillColor: "plum",
    strokeColor: "purple",
    strokeWidth: 3,
    radius: 3,
    position: view.center,
    data: {
      vel: new Point(0, 0)
    }
  }

  let foodConfig = {
    fillColor: "black",
    strokeColor: "silver",
    strokeWidth: "3",
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
  for (let i = 0; i < foodCount; i++) {
    let sz = Math.floor(Math.random() * 20);
    let food = new Shape.Circle(foodConfig);
    food.setPosition(Point.random().multiply(workspace.size).add([margin, margin]));
    food.radius = sz;
    foods.addChild(food);
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
    let hit = foods.hitTest(player.position);
    console.log(hit);
    if(hit) {
      hit.item.remove();
      player.radius += 1;
    }
    player.setPosition(player.position.add(player.data.vel));
  }


  view.draw();
};
